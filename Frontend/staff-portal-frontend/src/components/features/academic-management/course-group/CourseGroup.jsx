/*eslint-disable*/
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUserRole } from "../../../../store/selectors";
import { useFilteredMenu } from "../../../../hooks";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateCourseGroupMutation,
	useDeleteCourseGroupMutation,
	useGetAllCourseTypesQuery,
	useGetBatchCycleQuery,
	useGetCourseGroupsQuery,
	useGetCoursesQuery,
	useUpdateCourseGroupMutation,
} from "../../../../store";
import {
	Button,
	CardBody,
	ConfirmDialog,
	CustomSelect,
	EmptyState,
	Modal,
	ModalBody,
	ModalHeader,
	SkeletonTable,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../layout";
import { useModal } from "../../../../providers";
import { Edit, List, Table, Trash2 } from "lucide-react";
import { ErrorFallback } from "../../../layout/errorBoundary";

const CourseGroup = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { filteredMenu = [] } = useFilteredMenu();
	const canAccessCourseGroup =
		(filteredMenu.includes("/academic-management/course-group") && userRole === "ADMIN") || userRole === "COURSE_COORDINATOR";

	const { showModal, setShowModal } = useModal();
	const [editingCourseGroup, setEditingCourseGroup] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		courseGroup: null,
	});

	//--------------------Filters--------------------
	const [filters, setFilters] = useState({
		batchCycleId: "",
		courseCode: "",
		courseTypeId: "",
		status: "",
	});
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	//------------------RTK QUERY HOOKS--------------------
	const DEFAULT_BATCH_CYCLE_OPTION = {
		value: "", 
		label: "Select batch cycle",
	};
	const selectBatchCycleOptions = (result) => {
		if (result.data) {
			// Map the API data
			const mappedOptions = result.data.map((batchCycle) => ({
				label: batchCycle.name,
				value: batchCycle.id,
			}));

			// Prepend the default option to the mapped array
			return [DEFAULT_BATCH_CYCLE_OPTION, ...mappedOptions];
		}

		// If no data is returned (e.g., initial load), still return the default option
		return [DEFAULT_BATCH_CYCLE_OPTION];
	};
	const { data: batchCycleOptions, isLoading: isLoadingBatchCycles } = useGetBatchCycleQuery(undefined, {
		selectFromResult: ({ data }) => selectBatchCycleOptions({ data }),
	});

	const { data: courseTypes, isLoading: isLoadingCourseTypes } = useGetAllCourseTypesQuery();
	const courseTypeOptions = useMemo(() => {
		// Return default if data is not available
		if (!courseTypes || courseTypes.length === 0) {
			return [{ value: "", label: "Select the Course Type" }];
		}

		const mappedTypes = courseTypes.map((courseType) => ({
			label: courseType.name,
			value: courseType.id,
		}));

		// FIX: Use the spread operator
		return [{ value: "", label: "Select the Course Type" }, ...mappedTypes];
	}, [courseTypes]);

	const { data: courses, isLoading: isLoadingCourses } = useGetCoursesQuery();
	const courseListForSelection = useMemo(() => {
		if (!filters.batchCycleId || !filters.courseTypeId || !courses) return null;
		return courses[filters.courseTypeId]?.[filters.batchCycleId] || [];
	}, [filters.batchCycleId, filters.courseTypeId, courses]);

	const courseOptions = useMemo(() => {
		if (!courseListForSelection) {
			return [{ value: "", label: "Select the Course" }];
		}
		if (courseListForSelection.length === 0) {
			return [{ value: "", label: "No course available" }];
		}
		return [
			{ value: "", label: "Select the Course" },
			...courseListForSelection.map((course) => ({
				label: course.courseCode,
				value: course.code,
			})),
		];
	}, [courseListForSelection]);

	const statusOptions = [
		{
			label: "Active",
			value: "ACTIVE",
		},
		{
			label: "Inactive",
			value: "INACTIVE",
		},
	];

	const isFilterReady = useMemo(() => {
		const requiredFilters = ["batchCycleId", "courseCode", "courseTypeId", "status"];
		return requiredFilters.every((filter) => !!filters[filter]);
	}, [filters]);

	const selectedCourse = useMemo(() => {
		if (!isFilterReady || !courseListForSelection || courseListForSelection.length === 0) return null;
		return courseListForSelection.find((course) => course.code === filters.courseCode) || [];
	}, [isFilterReady, courseListForSelection, filters.courseCode]);

	const maxGroups = useMemo(() => {
		return selectedCourse?.maxGroupCount || null;
	}, [selectedCourse]);

	const isMaxCourseGroupsReached = useMemo(() => {
		return maxGroups !== null && filteredCourseGroup?.length === maxGroups;
	}, [filteredCourseGroup, maxGroups]);
	//--------------------CRUD Actions--------------------
	const {
		data: courseGroups,
		isLoading: isLoadingCourseGroups,
		isFetching: isFetchingCourseGroups,
		isError: isErrorCourseGroups,
		error: errorCourseGroups,
	} = useGetCourseGroupsQuery();
	const [createCourseGroup, { isLoading: creating, isSuccess: created, error: createError, isError: isErrorCreateCourseGroup }] =
		useCreateCourseGroupMutation();
	const [updateCourseGroup, { isLoading: updating, isSuccess: updated, error: updateError, isError: isErrorUpdateCourseGroup }] =
		useUpdateCourseGroupMutation();
	const [deleteCourseGroup, { isLoading: deleting, isSuccess: deleted, error: deleteError, isError: isErrorDeleteCourseGroup }] =
		useDeleteCourseGroupMutation();

	useEffect(() => {
		if (created) {
			// placeholder for notification
			console.log("Course Group created successfully");
		}
		if (updated) {
			// placeholder for notification
			console.log("Course Group updated successfully");
		}
		if (deleted) {
			// placeholder for notification
			console.log("Course Group deleted successfully");
		}
		if (isErrorCreateCourseGroup) {
			console.log("Error creating course group", createError);
		}
		if (isErrorUpdateCourseGroup) {
			console.log("Error updating course group", updateError);
		}
		if (isErrorDeleteCourseGroup) {
			console.log("Error deleting course group", deleteError);
		}
	}, [
		created,
		updated,
		deleted,
		isErrorCreateCourseGroup,
		isErrorUpdateCourseGroup,
		isErrorDeleteCourseGroup,
		createError,
		updateError,
		deleteError,
	]);

	useEffect(() => {
		if (!canAccessCourseGroup) return;
		let actionDisabled = false;
		let actionTooltip = null;
		if (!isFilterReady) {
			actionDisabled = true;
			actionTooltip = "Please select Batch Cycle, Course Type, Course and Status filters before creating a Course Group.";
		} else if (isMaxCourseGroupsReached) {
			actionDisabled = true;
			actionTooltip = `Maximum number of groups (${maxGroups}) for this course has been reached.`;
		}
		dispatch(
			setHeaderInfo({
				title: "Course Group",
				subtitle: "Manage course groups",
				actions: [
					{
						label: "Create Course Group",
						icon: "plus",
						disabled: actionDisabled,
						tooltip: actionTooltip, // Tooltip for why it's disabled
					},
				],
			})
		);
	}, [dispatch, isFilterReady, isMaxCourseGroupsReached, maxGroups, canAccessCourseGroup]);

	useEffect(() => {
		if (!canAccessCourseGroup) return;
		dispatch(
			setBreadcrumbs([
				{
					title: "Home",
					path: "/dashboard",
					icon: "home",
				},
				{
					title: "Academic Management",
					icon: "academic-cap",
				},
				{
					title: "Course Group",
					path: "/academic-management/course-group",
					icon: "academic-cap",
				},
			])
		);
	}, [dispatch, canAccessCourseGroup]);

	//--------------------Filtered Course Group--------------------

	const filteredCourseGroup = useMemo(() => {
		if (!isFilterReady) {
			return [];
		}
		if (courseGroups?.length === 0) {
			return [];
		}
		let result = courseGroups;
		result = result.filter(
			(courseGroup) =>
				courseGroup.batchCycleId === filters.batchCycleId &&
				courseGroup.courseTypeId === filters.courseTypeId &&
				courseGroup.courseCode === filters.courseCode &&
				courseGroup.status === filters.status
		);
		return result;
	}, [courseGroups, filters.batchCycleId, filters.courseTypeId, filters.courseCode, filters.status, isFilterReady]);

	//------------------Can Access------------------
	if (!canAccessCourseGroup) {
		return <ErrorFallback errorMessage='You are not authorized to view this page.' />;
	}
	if (isErrorCourseGroups) {
		return <EmptyState icon={<AlertTriangle size={50} />} title='Error' description={errorCourseGroups?.data?.message} />;
	}
	//--------------------CRUD Actions--------------------
	const handleCreateCourseGroup = async (formData) => {
		try {
			await createCourseGroup(formData).unwrap();
			setShowModal(false);
			setEditingCourseGroup(null);
		} catch (error) {
			// do nothing
		}
	};
	const handleUpdateCourseGroup = async (updatedCourseGroup) => {
		try {
			await updateCourseGroup({ courseGroupId: updatedCourseGroup.id, ...updatedCourseGroup }).unwrap();
			setShowModal(false);
			setEditingCourseGroup(null);
		} catch (error) {
			// do nothing
		}
	};
	const handleDeleteCourseGroup = async (courseGroupId) => {
		const idToDelete = courseGroupId;
		if (!idToDelete) return;
		try {
			await deleteCourseGroup(idToDelete).unwrap();
		} catch (error) {
			// do nothing
		}
	};

	const handleOpenEditModal = (courseGroup) => {
		setEditingCourseGroup(courseGroup);
		setShowModal(true);
	};
	return (
		<>
			{/* Filters/Selectors */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg-grid-cols-4 gap-4'>
				<CustomSelect
					value={filters.courseTypeId}
					options={courseTypeOptions}
					onChange={(e) => handleFilterChange("courseTypeId", e.target.value)}
					isLoading={isLoadingCourseTypes}
				/>
				<CustomSelect
					value={filters.batchCycleId}
					options={batchCycleOptions}
					onChange={(e) => handleFilterChange("batchCycleId", e.target.value)}
					isLoading={isLoadingBatchCycles}
					disabled={!filters.courseTypeId}
				/>

				<CustomSelect
					value={filters.courseCode}
					options={courseOptions}
					onChange={(e) => handleFilterChange("courseCode", e.target.value)}
					isLoading={isLoadingCourses}
					disabled={!filters.courseTypeId && !filters.batchCycleId}
				/>
				<CustomSelect value={filters.status} options={statusOptions} onChange={(e) => handleFilterChange("status", e.target.value)} />
			</div>
			<Card>
				<CardBody>
					{isLoadingCourseGroups ? (
						<SkeletonTable />
					) : courseGroups?.length === 0 ? (
						<EmptyState
							icon={<List className='w-12 h-12' />}
							title={"No course group found"}
							description={"No Course Group found in the system. Please create a new course group after selecting the filters."}
						/>
					) : filteredCourseGroup?.length === 0 ? (
						<EmptyState
							icon={<List className='w-12 h-12' />}
							title={"No course group found"}
							description={"No Course Group present for the selected filters. Please add a new course group.."}
						/>
					) : (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-3/5'>Title</TableHeader>
										<TableHeader className='w-3/5'>Description</TableHeader>
										<TableHeader className='w-1/5'>Capacity</TableHeader>
										<TableHeader className='rounded-tr-2xl w-[120px]'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<Table>
								<TableBody>
									{filteredCourseGroup?.map((courseGroup, index) => (
										<TableRow key={courseGroup.id}>
											<TableCell className='w-1/12'>{index + 1}</TableCell>
											<TableCell className='w-3/5'>{courseGroup.title}</TableCell>
											<TableCell className='w-3/5'>{courseGroup.description}</TableCell>
											<TableCell className='w-1/5'>{courseGroup.capacity}</TableCell>
											<TableCell className='w-[120px]'>
												<div className='flex items-center justify-center space-x-2'>
													<Button
														variant='ghost'
														className='cursor-pointer dark:hover:text-yellow-400'
														size='sm'
														onClick={() => handleOpenEditModal(courseGroup)}
														disabled={creating || deleting}>
														<Edit size={16} />
													</Button>
													<Button
														variant='ghost'
														size='sm'
														className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
														onClick={() =>
															setDeleteModal({
																open: true,
																courseGroup,
															})
														}
														disabled={creating || updating}>
														<Trash2 size={16} />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</>
					)}
				</CardBody>
			</Card>
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setEditingCourseGroup(null);
				}}
				size='lg'>
				<ModalHeader
					title={editingCourseGroup ? "Update Course Group" : "Create Course Group"}
					subtitle={editingCourseGroup ? "Update course group details" : "Add a new course group to the system"}
					onClose={() => {
						setShowModal(false);
						setEditingCourseGroup(null);
					}}
				/>
				<ModalBody>
					<CourseGroupForm
						courseGroup={editingCourseGroup}
						maxGroupCount={maxGroups}
						existingGroupCount={filteredCourseGroup?.length}
						batchCycle={filters.batchCycleId}
						batchCycleName={selectedCourse?.batchCycleName}
						courseType={filters.courseTypeId}
						courseTypeName={selectedCourse?.courseTypeName}
						course={filters.courseCode}
						status={statusOptions}
						onSubmit={editingCourseGroup ? handleUpdateCourseGroup : handleCreateCourseGroup}
						onCancel={() => {
							setShowModal(false);
							setEditingCourseGroup(null);
						}}
					/>
				</ModalBody>
			</Modal>
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, courseGroup: null })}
				onConfirm={() => handleDeleteCourseGroup()}
				title='Delete Course Group'
				message={`Are you sure you want to delete ${deleteModal.courseGroup.title}? This action cannot be undone`}
				confirmText={"Delete"}
				type='danger'
			/>
		</>
	);
};

export default CourseGroup;
