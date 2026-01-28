/*eslint-disable*/
import { AlertTriangle, Edit, List, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFilteredMenu } from "../../../../hooks";
import { useModal } from "../../../../providers";
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
import { selectUserRole } from "../../../../store/selectors";
import { notify } from "../../../../utils/Notify";
import {
	Button,
	Card,
	CardBody,
	ConfirmDialog,
	CustomSelect,
	EmptyState,
	SkeletonTable,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../layout";
import { ErrorFallback } from "../../../layout/errorBoundary";
import { ModalForm } from "../../../layout/modals/ModalForm";
import CourseGroupForm from "./CourseGroupForm";

const CourseGroup = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessCourseGroup = pathSet.has("/academic-management/course-groups") && (userRole === "ADMIN" || userRole === "COURSE_COORDINATOR");

	const formRef = useRef(null);
	const { showModal, openModal, closeModal } = useModal();
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
		value: "", // Value should be empty string for the selector's default/unselected state
		label: "Select batch cycle",
	};
	const selectBatchCycleOptions = (result) => {
		console.log("Batch Cycles:", result.data);
		if (result.data) {
			// Map the API data
			const mappedOptions = result?.data.map((batchCycle) => ({
				label: batchCycle.title,
				value: batchCycle.id,
			}));

			// Prepend the default option to the mapped array
			return [DEFAULT_BATCH_CYCLE_OPTION, ...mappedOptions];
		}

		// If no data is returned (e.g., initial load), still return the default option
		return [DEFAULT_BATCH_CYCLE_OPTION];
	};
	const { data: batchCycleOptions, isLoading: isLoadingBatchCycles } = useGetBatchCycleQuery(undefined, {
		selectFromResult: (result) => ({
			...result,
			data: selectBatchCycleOptions(result),
		}),
	});

	const { data: courseTypes, isLoading: isLoadingCourseTypes } = useGetAllCourseTypesQuery();
	const courseTypeOptions = useMemo(() => {
		// Return default if data is not available
		if (!courseTypes || courseTypes?.length === 0) {
			return [{ value: "", label: "Select the Course Type" }];
		}

		const mappedTypes = courseTypes?.map((courseType) => ({
			label: courseType.title,
			value: courseType.id,
		}));

		// FIX: Use the spread operator
		return [{ value: "", label: "Select the Course Type" }, ...mappedTypes];
	}, [courseTypes]);

	const { data: courses, isLoading: isLoadingCourses } = useGetCoursesQuery();
	console.log("Courses:", courses);
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
			...courseListForSelection?.map((course) => ({
				label: course.courseCode,
				value: course.courseCode,
			})),
		];
	}, [courseListForSelection]);

	const statusOptions = [
		{
			label: "Select Status",
			value: "",
		},
		{
			label: "Filled",
			value: "FILLED",
		},
		{
			label: "Vacant",
			value: "VACANT",
		},
	];

	const isFilterReady = useMemo(() => {
		const requiredFilters = ["batchCycleId", "courseCode", "courseTypeId"];
		return requiredFilters.every((filter) => !!filters[filter]);
	}, [filters]);

	const selectedCourse = useMemo(() => {
		if (!isFilterReady || !courseListForSelection || courseListForSelection.length === 0) return null;
		return courseListForSelection.find((course) => course.courseCode === filters.courseCode) || [];
	}, [isFilterReady, courseListForSelection, filters.courseCode]);

	const maxGroups = useMemo(() => {
		return selectedCourse?.maxGroupCount || null;
	}, [selectedCourse]);

	//--------------------CRUD Actions--------------------
	const {
		data: courseGroups = [],
		isLoading: isLoadingCourseGroups,
		isFetching: isFetchingCourseGroups,
		isError: isErrorCourseGroups,
		error: errorCourseGroups,
	} = useGetCourseGroupsQuery(filters.courseCode);
	const [createCourseGroup, { isLoading: creating, isSuccess: created, error: createError, isError: isErrorCreateCourseGroup }] =
		useCreateCourseGroupMutation();
	const [updateCourseGroup, { isLoading: updating, isSuccess: updated, error: updateError, isError: isErrorUpdateCourseGroup }] =
		useUpdateCourseGroupMutation();
	const [deleteCourseGroup, { isLoading: deleting, isSuccess: deleted, error: deleteError, isError: isErrorDeleteCourseGroup }] =
		useDeleteCourseGroupMutation();

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
		// sort result based courseGroup.title
		result.sort((a, b) => a.title.localeCompare(b.title));
		return result;
	}, [courseGroups, filters.batchCycleId, filters.courseTypeId, filters.courseCode, filters.status, isFilterReady]);

	const isMaxCourseGroupsReached = useMemo(() => {
		return maxGroups !== null && filteredCourseGroup?.length === maxGroups;
	}, [filteredCourseGroup, maxGroups]);
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
				action: [
					{
						label: "Create Course Group",
						icon: "plus",
						entity: "CourseGroup",
						mode: "CREATE",
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

	//------------------Can Access------------------
	if (!canAccessCourseGroup) {
		return <ErrorFallback errorMessage='You are not authorized to view this page.' />;
	}
	if (isErrorCourseGroups) {
		return <EmptyState icon={<AlertTriangle size={50} />} title='Error' description={errorCourseGroups?.data?.message} />;
	}
	//--------------------CRUD Actions--------------------
	const handleSubmitCourseGroup = async (data) => {
		const { id, payload, courseCode } = data;
		try {
			if (id) {
				const response = await updateCourseGroup({
					id,
					payload,
					courseCode,
					batchCycleId: filters.batchCycleId,
					courseTypeId: filters.courseTypeId,
				}).unwrap();
				console.log("Response", response);
				notify.success(`Course Group ${showModal.payload.title} updated successfully!`);
			} else {
				await createCourseGroup({ payload, courseCode, batchCycleId: filters.batchCycleId, courseTypeId: filters.courseTypeId }).unwrap();
				notify.success(`Course Group ${payload.title} created successfully!`);
			}
		} catch (error) {
			notify.error(error?.data?.message || "Failed to save course group.");
			if (formRef.current) {
				formRef.current.reset();
			}
		}
		closeModal();
	};

	const handleDeleteCourseGroup = async (courseGroup) => {
		const idToDelete = courseGroup.id;
		if (!idToDelete) return;
		try {
			const response = await deleteCourseGroup({ id: idToDelete, courseCode: filters.courseCode }).unwrap();
			console.log("Delete Response: ", response);
		} catch (error) {
			// do nothing
		}
		setDeleteModal({ open: false, courseGroup: null });
	};

	const handleOpenEditModal = (courseGroup) => {
		openModal("CourseGroup", "EDIT", courseGroup);
	};
	return (
		<>
			{/* Filters/Selectors */}
			<div className='mt-2 mb-2 grid grid-cols-4 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
				<CustomSelect
					label='Course Type'
					value={filters.courseTypeId}
					options={courseTypeOptions}
					onChange={(e) => handleFilterChange("courseTypeId", e.target.value)}
					isLoading={isLoadingCourseTypes}
				/>
				<CustomSelect
					label='Batch Cycle'
					value={filters.batchCycleId}
					options={batchCycleOptions}
					onChange={(e) => handleFilterChange("batchCycleId", e.target.value)}
					isLoading={isLoadingBatchCycles}
					disabled={!filters.courseTypeId}
				/>

				<CustomSelect
					label='Course'
					value={filters.courseCode}
					options={courseOptions}
					onChange={(e) => handleFilterChange("courseCode", e.target.value)}
					isLoading={isLoadingCourses}
					disabled={!filters.courseTypeId || !filters.batchCycleId}
				/>
				<CustomSelect
					label='Status'
					value={filters.status}
					options={statusOptions}
					onChange={(e) => handleFilterChange("status", e.target.value)}
					disabled={!filters.courseTypeId || !filters.batchCycleId || !filters.courseCode}
				/>
			</div>
			<Card className='h-[520px]'>
				<CardBody>
					{isLoadingCourseGroups ?
						<SkeletonTable />
					: courseGroups?.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title={"No course group found"}
							description={"No Course Group found in the system. Please create a new course group after selecting the filters."}
						/>
					: filteredCourseGroup?.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title={"No course group found"}
							description={"No Course Group present for the selected filters. Please add a new course group.."}
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-[10%] rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-[20%]'>Title</TableHeader>
										<TableHeader className='w-[40%]'>Description</TableHeader>
										<TableHeader className='w-[10%]'>Capacity</TableHeader>
										<TableHeader className='w-[20%] rounded-tr-2xl'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<Table>
								<TableBody>
									{filteredCourseGroup?.map((courseGroup, index) => (
										<TableRow key={courseGroup.id}>
											<TableCell className={`w-[10%] ${index === filteredCourseGroup.length - 1 ? "rounded-bl-2xl" : ""}`}>{index + 1}</TableCell>
											<TableCell className='w-[20%]'>{courseGroup.title}</TableCell>
											<TableCell className='w-[40%]'>{courseGroup.description}</TableCell>
											<TableCell className='w-[10%]'>{courseGroup.capacity}</TableCell>
											<TableCell className={`w-[20%] ${index === filteredCourseGroup.length - 1 ? "rounded-br-2xl" : ""} `}>
												<div className='flex items-center justify-center space-x-2'>
													<Button
														variant='gradientAmber'
														icon={Edit}
														className='h-6 w-6 rounded-lg'
														size='sm'
														onClick={() => handleOpenEditModal(courseGroup)}
														disabled={creating || deleting}
													/>
													<Button
														variant='gradientRose'
														icon={Trash2}
														className='h-6 w-6 rounded-lg'
														onClick={() =>
															setDeleteModal({
																open: true,
																courseGroup,
															})
														}
														disabled={creating || updating}
													/>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</>
					}
				</CardBody>
			</Card>
			<ModalForm
				isOpen={showModal.open && showModal.entity === "CourseGroup"}
				onClose={closeModal}
				title={showModal.payload ? "Update Course Group" : "Create Course Group"}
				description={showModal.payload ? "Update course group details" : "Add a new course group to the system"}
				formRef={formRef}
				loading={creating || updating}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<CourseGroupForm
							ref={modalFormRef}
							courseGroup={showModal.payload}
							maxGroupCount={maxGroups}
							existingGroupCount={filteredCourseGroup?.length}
							batchCycle={filters.batchCycleId}
							batchCycleName={selectedCourse?.batchCycleName}
							courseType={filters.courseTypeId}
							courseTypeName={selectedCourse?.courseTypeName}
							course={filters.courseCode}
							status={statusOptions}
							onSubmit={handleSubmitCourseGroup}
						/>
					);
				}}
			</ModalForm>

			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, courseGroup: null })}
				onConfirm={() => handleDeleteCourseGroup(deleteModal.courseGroup)}
				title='Delete Course Group'
				message={`Are you sure you want to delete ${deleteModal.courseGroup?.title}? This action cannot be undone`}
				confirmText={"Delete"}
				type='danger'
			/>
		</>
	);
};

export default CourseGroup;
