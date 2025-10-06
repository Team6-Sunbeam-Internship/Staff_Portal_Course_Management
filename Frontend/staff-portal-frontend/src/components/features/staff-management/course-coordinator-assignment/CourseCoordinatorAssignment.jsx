import { useState, useEffect, useMemo } from "react";
import { Trash2, Edit, List, UserPlus } from "lucide-react";
import {
	Card,
	CardBody,
	Table,
	TableHead,
	TableHeader,
	TableBody,
	TableRow,
	TableCell,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ConfirmDialog,
	EmptyState,
	SkeletonTable,
	CustomSelect,
	SearchInput,
} from "../../../layout";
// Assuming the form component is for assignment, not premise
import { useDispatch, useSelector } from "react-redux";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateCourseCoordinatorAssignMutation,
	useDeleteCourseCoordinatorAssignMutation,
	useGetAllCourseTypesQuery,
	useGetAllStaffQuery,
	useGetBatchCycleQuery,
	useGetCourseCoordinatorAssignQuery,
	useGetCoursesQuery,
	useGetPremisesQuery,
	useUpdateCourseCoordinatorAssignMutation,
} from "../../../../store";
import { useModal } from "../../../../providers";
// import { useGetAllStaffQuery, useGetCourseOfferingsQuery, useGetAssignmentsQuery, useCreateAssignmentMutation, useUpdateAssignmentMutation, useDeleteAssignmentMutation } from "../../../store"; // RTK Query hooks placeholder
import { ErrorFallback } from "../.././../layout/errorBoundary";
import { CourseCoordinatorAssignForm } from "./CourseCoordinatorAssignForm";
import { selectUserRole } from "../../../../store/selectors";
import { useFilteredMenu } from "../../../../hooks";

const CourseCoordinatorAssignment = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { filteredMenu = [] } = useFilteredMenu();
	const canAccessCourseCoordinatorAssignment = filteredMenu.includes("/staff-managment/course-coordinator-assign") && userRole === "ADMIN";

	// State for CRUD operations and Modals
	const { showModal, setShowModal } = useModal();
	const [editingAssignment, setEditingAssignment] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		assignment: null,
	});

	// =========================================================================
	// 1. RTK QUERY HOOKS (PLACEHOLDERS)
	// =========================================================================

	const selectBatchCycleOptions = (result) => {
		if (result.data) {
			// Map the API data
			const mappedOptions = result.data.map((batchCycle) => ({
				label: batchCycle.name,
				value: batchCycle.id,
			}));

			// Prepend the default option to the mapped array
			return [
				{
					value: "",
					label: "Select batch cycle",
				},
				...mappedOptions,
			];
		}

		// If no data is returned (e.g., initial load), still return the default option
		return [
			{
				value: "",
				label: "Select batch cycle",
			},
		];
	};
	const { data: batchCycleOptions, isLoading: isLoadingBatchCycles } = useGetBatchCycleQuery(undefined, {
		selectFromResult: ({ data }) => selectBatchCycleOptions({ data }),
	});
	const { data: premises, isLoading: isLoadingPremises } = useGetPremisesQuery();
	const locationOptions = [
		{
			value: "",
			label: "Select location",
		},
		...(premises || []).map((premise) => ({
			value: premise.id,
			label: premise.name,
		})),
	];
	const { data: courseTypes, isLoading: isLoadingCourseTypes } = useGetAllCourseTypesQuery();
	const courseTypeOptions = [
		{
			value: "",
			label: "Select course type",
		},
		...(courseTypes || []).map((courseType) => ({
			value: courseType.id,
			label: courseType.name,
		})),
	];
	// CALL 1: Fetch all coordinators from User Service
	const selectCoordinator = (result) => {
		if (result.data) {
			return result.data.filter((staff) => staff.staffRole === "COURSE_COORDINATOR");
		}
		return [];
	};
	const {
		data: allCoordinators,
		isLoading: isLoadingAllCoordinators,
		isError: isErrorAllCoordinators,
		error: allCoordinatorsError,
	} = useGetAllStaffQuery(undefined, {
		selectFromResult: ({ data }) => selectCoordinator({ data }),
	});

	const { data: courses, isLoading: isLoadingCourses } = useGetCoursesQuery();
	const courseListForSelection = useMemo(() => {
		if (!filters.batchCycleId || !filters.courseTypeId || !filters.premiseId || !courses) return null;
		const batchCycleCourses = courses[filters.courseTypeId]?.[filters.batchCycleId] || [];
		return batchCycleCourses.filter((course) => course.premiseId === filters.premiseId);
	}, [filters.batchCycleId, filters.courseTypeId, courses, filters.premiseId]);

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
	// CALL 3: Fetch all existing assignments from Academic Service
	const {
		data: courseCoordinatorAssign,
		isLoading: isLoadingCourseCoordinatorAssign,
		isError: isErrorCourseCoordinatorAssign,
		error: courseCoordinatorAssignError,
	} = useGetCourseCoordinatorAssignQuery();
	// =========================================================================
	// 2. DATA PROCESSING AND FILTERS
	// =========================================================================
	const [filters, setFilters] = useState({
		batchCycleId: "",
		courseTypeId: "",
		courseCode: "",
		premiseId: "",
		courseStatus: "", // Maps to courseOffering.courseStatus
		assignmentStatus: "ALL", // NEW: UNASSIGNED, ASSIGNED, ALL // courseCoordinatorAssign.status
	});

	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const coordinatorMap = useMemo(() => {
		if (!allCoordinators) return {};
		return allCoordinators.reduce((acc, staff) => {
			acc[staff.staffId] = staff;
			return acc;
		}, {});
	}, [allCoordinators]);

	const assignmentMap = useMemo(() => {
		if (!courseCoordinatorAssign) return {};
		return courseCoordinatorAssign.reduce((acc, assignment) => {
			const key = `${assignment.courseCode}-${assignment.premiseId}`;
			acc[key] = assignment;
			return acc;
		}, {});
	}, [courseCoordinatorAssign]);

	const mergedData = useMemo(() => {
		if (!courseListForSelection || courseListForSelection.length === 0) return [];

		return courseListForSelection.map((course) => {
			const courseCode = course.courseCode;
			const premiseId = course.premiseId;
			const key = `${courseCode}-${premiseId}`;

			const assignment = assignmentMap[key];

			let isAssigned = false;
			let assignedStaffName = null;
			let assignmentId = null;

			if (assignment) {
				isAssigned = true;
				assignmentId = assignment.assignmentId;
				const coordinator = coordinatorMap[assignment.staffId];

				if (coordinator) {
					assignedStaffName = `${coordinator.firstName} ${coordinator.lastName}`;
				} else {
					assignedStaffName = "Coordinator Data Missing";
				}
			}
			return {
				courseCode: course.courseCode,
				courseName: course.courseName,
				premiseId: course.premiseId,
				premiseName: course.premiseName,
				courseStatus: course.courseStatus,
				isAssigned,
				assignedStaffName,
				assignmentId,
				assignmentStatus: assignment?.courseAssignmentStatus || "UNASSIGNED",
				staffId: assignment?.staffId,
			};
		});
	}, [courseListForSelection, assignmentMap, coordinatorMap]);

	const filteredData = useMemo(() => {
		if (!mergedData) return [];

		let currentData = mergedData;

		if (filters.assignmentStatus !== "ALL") {
			const isAssignedFilter = filters.assignmentStatus === "ASSIGNED";
			currentData = currentData.filter((assignment) => assignment.isAssigned === isAssignedFilter);
		}
		if (filters.courseCode) {
			currentData = currentData.filter((assignment) => assignment.courseCode === filters.courseCode);
		}
		if (filters.premiseId) {
			currentData = currentData.filter((assignment) => assignment.premiseId === filters.premiseId);
		}
		return currentData;
	}, [mergedData, filters]);

	// Options for CustomSelect filters

	const assignmentStatusOptions = [
		{ value: "ALL", label: "Assignment Status (All)" },
		{ value: "ASSIGNED", label: "Assigned" },
		{ value: "UNASSIGNED", label: "Unassigned" },
	];

	// ------------------CRUD Actions--------------------
	const [createAssignment, { isLoading: creating, isError: isCreatingError, isSuccess: created }] = useCreateCourseCoordinatorAssignMutation();
	const [updateAssignment, { isLoading: updating, isError: isUpdatingError, isSuccess: updated }] = useUpdateCourseCoordinatorAssignMutation();
	const [deleteAssignment, { isLoading: deleting, isError: isDeletingError, isSuccess: deleted }] = useDeleteCourseCoordinatorAssignMutation();
	// =========================================================================
	// 3. UI/EFFECTS/HANDLERS
	// =========================================================================
	useEffect(() => {
		if (created) {
			// placeholder
			console.log("Assignment created successfully");
		}
		if (updated) {
			// placeholder
			console.log("Assignment updated successfully");
		}
		if (deleted) {
			// placeholder
			console.log("Assignment deleted successfully");
		}
		if (isCreatingError) {
			// placeholder
			console.error("Failed to create assignment");
		}
		if (isUpdatingError) {
			// placeholder
			console.error("Failed to update assignment");
		}
		if (isDeletingError) {
			// placeholder
			console.error("Failed to delete assignment");
		}
	}, [created, updated, deleted, isCreatingError, isUpdatingError, isDeletingError]);

	useEffect(() => {
		if (!canAccessCourseCoordinatorAssignment) {
			return;
		}
		dispatch(
			setHeaderInfo({
				title: "Course Coordinator Assignment",
				subtitle: "Manage course assign to coordinators.",
			})
		);
		dispatch(
			setBreadcrumbs([
				{ title: "Home", path: "/dashboard", icon: "home" },
				{ title: "Staff Management", icon: "house-plus" },
				{
					title: "Course Coordinator Assignment",
					path: "/staff-management/course-assign",
					icon: "house-plug",
				},
			])
		);
	}, [dispatch, canAccessCourseCoordinatorAssignment]);

	// Placeholder handlers for assignment CRUD
	const handleAssignCoordinator = async (data) => {
		try {
			await createAssignment(data).unwrap();
			setShowModal(false);
			setEditingAssignment(null);
		} catch (error) {
			return;
		}
	};

	const handleUpdateAssignment = async (data) => {
		try {
			await updateAssignment(data).unwrap();
			setShowModal(false);
			setEditingAssignment(null);
		} catch (error) {
			return;
		}
	};

	const handleDeleteAssignment = async () => {
		try {
			await deleteAssignment(deleteModal.assignment.assignmentId).unwrap();
			setDeleteModal({ open: false, assignment: null });
		} catch (error) {
			return;
		}
	};

	const handleOpenAssignModal = (offering) => {
		// Set the course offering data to be used in the AssignmentForm
		setEditingAssignment(offering);
		setShowModal(true);
	};

	// Combined loading state
	const isLoading =
		isLoadingCourseTypes ||
		isLoadingBatchCycles ||
		isLoadingPremises ||
		isLoadingCourses ||
		isLoadingCourseCoordinatorAssign;
	
	if (isErrorCourseCoordinatorAssign) {
		return <ErrorFallback errorMessage={`Failed to load course coordinator assignment = ${courseCoordinatorAssignError}`} />
	}

	return (
		<>
			<div className='grid grid-cols-6 gap-4 mb-4'>
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
					value={filters.premiseId}
					options={locationOptions}
					onChange={(e) => handleFilterChange("premiseId", e.target.value)}
					isLoading={isLoadingPremises}
					disabled={!filters.batchCycleId}
				/>
				<CustomSelect
					value={filters.courseCode}
					options={courseOptions}
					onChange={(e) => handleFilterChange("courseCode", e.target.value)}
					isLoading={isLoadingCourses}
					disabled={!filters.courseTypeId && !filters.batchCycleId}
				/>
				<CustomSelect
					value={filters.assignmentStatus}
					options={assignmentStatusOptions}
					onChange={(e) => handleFilterChange("assignmentStatus", e.target.value)}
				/>
				{/* Placeholder for Search on Staff Name */}
				<SearchInput placeholder='Search Staff Name...' className='col-span-2' />
			</div>
			<Card className={"h-[510px]"}>
				<CardBody>
					{isLoading ? (
						<SkeletonTable />
					) : mergedData.length === 0 ? (
						<EmptyState
							icon={<List className='w-12 h-12' />}
							title='No Course Offerings Found'
							description='There are no course offerings available to assign a coordinator.'
						/>
					) : (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-[5%] rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-[20%]'>Course Name</TableHeader>
										<TableHeader className='w-[15%]'>Location</TableHeader>
										<TableHeader className='w-[15%]'>Course Status</TableHeader>
										<TableHeader className='w-[25%]'>Assigned Coordinator</TableHeader>
										<TableHeader className='text-center rounded-tr-2xl w-[20%]'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='h-[440px] rounded-b-2xl overflow-y-auto scrollbar-none'>
								<Table>
									<TableBody>
										{filteredData.map((item, index) => (
											<TableRow key={item.courseCode + item.premiseId}>
												<TableCell className='font-medium text-center w-[5%]'>{index + 1}</TableCell>
												<TableCell className='w-[20%]'>{item.courseName}</TableCell>
												<TableCell className='w-[15%]'>{item.premiseName}</TableCell>
												<TableCell className='w-[15%]'>
													<span
														className={`px-2 py-1 text-xs rounded-full ${
															item.courseStatus === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
														}`}>
														{item.courseStatus}
													</span>
												</TableCell>
												<TableCell className='w-[25%] font-medium'>
													{item.isAssigned ? (
														item.assignedStaffName
													) : (
														<span className='text-gray-500 italic'>Unassigned</span>
													)}
												</TableCell>
												<TableCell className='w-[20%]'>
													<div className='flex items-center justify-center space-x-2'>
														{item.isAssigned ? (
															<>
																<Button
																	variant='ghost'
																	className='cursor-pointer dark:hover:text-yellow-400'
																	size='sm'
																	onClick={() => handleOpenAssignModal(item)}>
																	<Edit size={16} title='Reassign Coordinator' />
																</Button>
																<Button
																	variant='ghost'
																	size='sm'
																	className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
																	onClick={() =>
																		setDeleteModal({
																			open: true,
																			assignment: item,
																		})
																	}>
																	<Trash2 size={16} title='Unassign Coordinator' />
																</Button>
															</>
														) : (
															<Button
																variant='default'
																size='sm'
																className='text-sm flex items-center space-x-1'
																onClick={() => handleOpenAssignModal(item)}>
																<UserPlus size={16} />
																<span>Assign</span>
															</Button>
														)}
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</>
					)}
				</CardBody>
			</Card>

			{/* Modal for Assign/Reassign */}
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setEditingAssignment(null);
				}}
				size='lg'>
				<ModalHeader
					title={editingAssignment?.isAssigned ? "Reassign Coordinator" : "Assign Coordinator"}
					subtitle={`Course: ${editingAssignment?.courseName} at ${editingAssignment?.premiseName}`}
					onClose={() => {
						setShowModal(false);
						setEditingAssignment(null);
					}}
				/>
				<ModalBody>
					{/* Placeholder for Assignment Form */}
					<div className='p-4'>
						<CourseCoordinatorAssignForm
							offering={editingAssignment}
							coordinators={allCoordinators}
							onSubmit={editingAssignment?.isAssigned ? handleUpdateAssignment : handleAssignCoordinator}
							onCancel={() => {
								setShowModal(false);
								setEditingAssignment(null);
							}}
							isLoading={creating || updating}
						/>
					</div>
				</ModalBody>
			</Modal>

			{/* Confirmation Dialog for Unassign (Delete) */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, assignment: null })}
				onConfirm={handleDeleteAssignment}
				title='Unassign Coordinator'
				message={`Are you sure you want to unassign "${deleteModal.assignment?.assignedStaffName}" from the course "${deleteModal.assignment?.courseName}" at "${deleteModal.assignment?.premiseName}"?`}
				confirmText='Unassign'
				type='danger'
				isLoading={deleting}
			/>
		</>
	);
};

export default CourseCoordinatorAssignment;

// Placeholder for a functional AssignmentForm component that would be in a separate file
