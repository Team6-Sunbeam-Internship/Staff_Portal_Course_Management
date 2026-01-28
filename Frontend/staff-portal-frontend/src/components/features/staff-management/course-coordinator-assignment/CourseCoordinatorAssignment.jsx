import { Edit, List, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
// Assuming the form component is for assignment, not premise
import { useDispatch, useSelector } from "react-redux";
import { useFilteredMenu } from "../../../../hooks";
import { useModal } from "../../../../providers";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateCourseCoordinatorAssignMutation,
	useDeleteCourseCoordinatorAssignMutation,
	useGetAllCourseCoordinatorAssignQuery,
	useGetAllCourseTypesQuery,
	useGetBatchCycleQuery,
	useGetCoursesQuery,
	useGetPremisesQuery,
	useUpdateCourseCoordinatorAssignMutation,
} from "../../../../store";
import { selectUserRole } from "../../../../store/selectors";
import { selectCourseCoordinators } from "../../../../store/selectors/userSelectors";
import { notify } from "../../../../utils/Notify";
import { ModalForm } from "../../../layout/modals/ModalForm";
import { ErrorFallback } from "../.././../layout/errorBoundary";
import { CourseCoordinatorAssignForm } from "./CourseCoordinatorAssignForm";

const DEFAULT_BATCH_CYCLE_OPTION = {
	value: "", // Value should be empty string for the selector's default/unselected state
	label: "Select batch cycle",
};

const selectBatchCycleOptions = (result) => {
	console.log("Batch Cycles:", result.data);
	if (result.data && Array.isArray(result.data)) {
		// Map the API data
		const mappedOptions = result.data.map((batchCycle) => ({
			label: batchCycle.title,
			value: batchCycle.id,
		}));

		// Prepend the default option to the mapped array
		return [DEFAULT_BATCH_CYCLE_OPTION, ...mappedOptions];
	}

	// If no data is returned (e.g., initial load) or data is invalid, still return the default option
	return [DEFAULT_BATCH_CYCLE_OPTION];
};

const CourseCoordinatorAssignment = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessCourseCoordinatorAssignment = pathSet.has("/staff-management/coordinator-assignment") && userRole === "ADMIN";

	// State for CRUD operations and Modals
	const formRef = useRef(null);
	const { showModal, openModal, closeModal } = useModal();
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		assignment: null,
	});
	const [filters, setFilters] = useState({
		batchCycleId: "",
		courseTypeId: "",
		courseCode: "",
		premiseId: "",
		assignmentStatus: "ALL", // NEW: UNASSIGNED, ASSIGNED, ALL // courseCoordinatorAssign.status
	});
	// =========================================================================
	// 1. RTK QUERY HOOKS
	// =========================================================================

	const { data: batchCycleOptions } = useGetBatchCycleQuery(undefined, {
		selectFromResult: (result) => ({
			...result,
			data: selectBatchCycleOptions(result),
		}),
	});
	// Fetch premise data for the location field
	const { data: premises = [] } = useGetPremisesQuery();

	const locationOptions = [
		{ value: "", label: "Select Premise" },
		...premises.map((premise) => ({
			value: premise.id,
			label: premise.title,
		})),
	];

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
	// CALL 1: Fetch all coordinators from User Service
	const allCoordinators = useSelector(selectCourseCoordinators);
	console.log("All Coordinators:", allCoordinators);
	const { data: courses, isLoading: isLoadingCourses } = useGetCoursesQuery();
	console.log("Courses:", courses);
	const courseListForSelection = useMemo(() => {
		if (!filters.batchCycleId || !filters.courseTypeId || !courses) return null;
		return courses[filters.courseTypeId]?.[filters.batchCycleId] || [];
	}, [filters.batchCycleId, filters.courseTypeId, courses]);
	console.log("CourseListSelection:", courseListForSelection);
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
				value: course.courseCode,
			})),
		];
	}, [courseListForSelection]);
	// CALL 3: Fetch all existing assignments from Academic Service
	const {
		data: courseCoordinatorAssign,
		isLoading: isLoadingCourseCoordinatorAssign,
		isError: isErrorCourseCoordinatorAssign,
		error: courseCoordinatorAssignError,
	} = useGetAllCourseCoordinatorAssignQuery();
	// =========================================================================
	// 2. DATA PROCESSING AND FILTERS
	// =========================================================================

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
				batchCycleId: course.batchCycleId,
				batchCycleName: course.batchCycleName,
				isAssigned,
				assignedStaffName,
				assignmentId,
				assignmentStatus: assignment?.courseCoordinatorAssignStatus || "UNASSIGNED",
				staffId: assignment?.staffId,
			};
		});
	}, [courseListForSelection, assignmentMap, coordinatorMap]);

	const filteredData = useMemo(() => {
		if (!mergedData) return [];

		let currentData = mergedData;

		if (filters.assignmentStatus !== "ALL") {
			const isAssignedFilter = filters.assignmentStatus === "ASSIGNED";
			currentData = currentData.filter((assignment) => {
				const isAssigned = assignment?.assignmentStatus === "ASSIGNED";
				return isAssigned === isAssignedFilter;
			});
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
	const handleSubmit = async (data) => {
		const { id, payload } = data;
		try {
			if (id) {
				await updateAssignment({ id, payload }).unwrap();
				notify.success(`Coordinator reassigned successfully!`);
			} else {
				await createAssignment(payload).unwrap();
				notify.success(`Coordinator assigned successfully!`);
			}
		} catch (error) {
			notify.error(`Failed to assign coordinator!`);
			if (formRef.current) {
				formRef.current.reset();
			}
		}
		closeModal();
	};

	const handleDeleteAssignment = async () => {
		try {
			await deleteAssignment(deleteModal.assignment.assignmentId).unwrap();
			notify.success(`Coordinator unassigned successfully for !`);
		} catch (error) {
			return;
		}
		setDeleteModal({ open: false, assignment: null });
	};

	const handleOpenAssignModal = (offering) => {
		// Set the course offering data to be used in the AssignmentForm
		openModal("Coordinator_Assignment", "EDIT", offering);
	};

	// Combined loading state
	const isLoading = isLoadingCourseTypes || isLoadingCourses || isLoadingCourseCoordinatorAssign;

	if (isErrorCourseCoordinatorAssign) {
		return <ErrorFallback errorMessage={`Failed to load course coordinator assignment = ${courseCoordinatorAssignError}`} />;
	}

	return (
		<>
			<div className='mt-2 mb-4 grid grid-cols-6 gap-4'>
				<CustomSelect
					label={"Course Type"}
					value={filters.courseTypeId}
					options={courseTypeOptions}
					onChange={(e) => handleFilterChange("courseTypeId", e.target.value)}
					isLoading={isLoadingCourseTypes}
				/>
				<CustomSelect
					value={filters.batchCycleId}
					label={"Batch Cycle"}
					options={batchCycleOptions}
					onChange={(e) => handleFilterChange("batchCycleId", e.target.value)}
					// isLoading={isLoadingBatchCycles}
					disabled={!filters.courseTypeId}
				/>
				<CustomSelect
					value={filters.premiseId}
					label={"Location"}
					options={locationOptions}
					onChange={(e) => handleFilterChange("premiseId", e.target.value)}
					// isLoading={isLoadingPremises}
					disabled={!filters.batchCycleId}
				/>
				<CustomSelect
					value={filters.courseCode}
					label={"Course"}
					options={courseOptions}
					onChange={(e) => handleFilterChange("courseCode", e.target.value)}
					isLoading={isLoadingCourses}
					disabled={!filters.courseTypeId && !filters.batchCycleId}
				/>
				<CustomSelect
					value={filters.assignmentStatus}
					label={"Assign Status"}
					options={assignmentStatusOptions}
					onChange={(e) => handleFilterChange("assignmentStatus", e.target.value)}
				/>
			</div>
			<Card className={"h-[510px]"}>
				<CardBody>
					{isLoading ?
						<SkeletonTable />
					: mergedData.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title='No Course Offerings Found'
							description='There are no course offerings available to assign a coordinator.'
						/>
					: filteredData.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title='No Matching Records Found'
							description='No records match your selected filters. Please adjust your filters.'
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-[5%] rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-[20%]'>Course Name</TableHeader>
										<TableHeader className='w-[15%]'>Location</TableHeader>

										<TableHeader className='w-[25%]'>Assigned Coordinator</TableHeader>
										<TableHeader className='w-[20%] rounded-tr-2xl text-center'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[440px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{filteredData.map((item, index) => (
											<TableRow key={item.courseCode + item.premiseId}>
												<TableCell className='w-[5%] text-center font-medium'>{index + 1}</TableCell>
												<TableCell className='w-[20%]'>{item.courseName}</TableCell>
												<TableCell className='w-[15%]'>{item.premiseName}</TableCell>
												<TableCell className='w-[25%] font-medium italic'>
													{item.isAssigned ? item.assignedStaffName : <span className='text-gray-500'>Unassigned</span>}
												</TableCell>
												<TableCell className='w-[20%]'>
													<div className='flex items-center justify-center space-x-2'>
														{item.isAssigned ?
															<>
																<Button
																	variant='gradientAmber'
																	icon={Edit}
																	className='h-6 w-6 rounded-xl'
																	onClick={() => handleOpenAssignModal(item)}></Button>
																<Button
																	variant='gradientRose'
																	icon={Trash2}
																	className='h-6 w-6 rounded-xl'
																	onClick={() =>
																		setDeleteModal({
																			open: true,
																			assignment: item,
																		})
																	}></Button>
															</>
														:	<Button
																variant='ghost'
																icon={Plus}
																className='flex items-center space-x-1 text-sm'
																onClick={() => handleOpenAssignModal(item)}>
																<span>Assign</span>
															</Button>
														}
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</>
					}
				</CardBody>
			</Card>

			{/* Modal for Assign/Reassign */}
			<ModalForm
				saveButtonName={"Assign"}
				isOpen={showModal.open && showModal.entity === "Coordinator_Assignment"}
				onClose={closeModal}
				title={showModal.payload?.isAssigned ? "Reassign Coordinator" : "Assign Coordinator"}
				description={`Course: ${showModal.payload?.courseName} at ${showModal.payload?.premiseName}`}
				formRef={formRef}
				loading={creating || updating}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<CourseCoordinatorAssignForm
							ref={modalFormRef}
							offering={showModal.payload}
							coordinators={allCoordinators}
							onSubmit={handleSubmit}
							isLoading={creating || updating}
						/>
					);
				}}
			</ModalForm>

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
