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
import { useDispatch } from "react-redux";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useAssignModuleRouterMutation,
	useGetAssignCourseQuery,
	useGetEligibleStaffQuery,
	useGetModulesForCoordinatorQuery,
} from "../../../../store";
import { useModal } from "../../../../providers";
// import { useGetAllStaffQuery, useGetCourseOfferingsQuery, useGetAssignmentsQuery, useCreateAssignmentMutation, useUpdateAssignmentMutation, useDeleteAssignmentMutation } from "../../../store"; // RTK Query hooks placeholder
import { ErrorFallback } from "../.././../layout/errorBoundary";
import { CourseCoordinatorAssignForm } from "./CourseCoordinatorAssignForm";

const ModuleRouter = () => {
	const dispatch = useDispatch();

	// RTK Query Hooks
	// before this COURSE_COORDINATOR has to get the assign course, from which it will get the , course name
	// rtk query hook: useGetAssignCourseQuery, param: coordinator staff id(extract from access token)

	const { data: assignCourse, isLoading: loadingAssignCourse, isError: isErrorAssignCourse, error: errorAssignCourse } = useGetAssignCourseQuery();
	const {
		data: initialModules,
		isLoading: loadingModules,
		isError: isErrorModules,
		error: errorModules,
	} = useGetModulesForCoordinatorQuery(
		{
			courseCode: assignCourse?.data?.courseCode,
		},
		{
			skip: !assignCourse?.data?.courseCode,
		}
		);
	
	const { data: eligibleStaff, isLoading: loadingStaff } = useGetEligibleStaffQuery({cs1: 'MULTIPLE', cs2: assignCourse?.data?.courseName});

	const [assignCoordinator, { isLoading: isSaving , isSuccess: assigned}] = useAssignModuleRouterMutation(/**module_id, module_router_id, module_router_name */);

	const { showModal, setShowModal } = useModal();
	const [modules, setLocalModules] = useState([]);
	const [activeModule, setActiveModule] = useState(null); // Module for the Subject modal
	const [savingModuleId, setSavingModuleId] = useState(null);

	// Sync initial data to local state for editing
	useEffect(() => {
		if (initialModules && !loadingModules) {
			setLocalModules(
				initialModules.map((m) => ({
					...m,
					// Add a temporary state to track changes before official save
					tempAssignedStaffId: m.assignedStaffId,
					isModified: false,
				}))
			);
		}
	}, [initialModules, loadingModules]);
	// =========================================================================
	// 3. UI/EFFECTS/HANDLERS
	// =========================================================================

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Course Coordinator Assignment",
				subtitle: "Manage course coordinator course assignments.",
			})
		);
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
					title: "Course Types",
					path: "/academic-management/course-types",
					icon: "book-open",
				},
				{
					title: "Courses",
					path: "/academic-management/courses",
					icon: "book-open",
				},
				{
					title: "Modules-Subjects",
					path: "/academic-management/modules",
					icon: "book-open",
				},
			])
		);
	}, [dispatch]);

	const staffOptions = useMemo(() => {
		const options = eligibleStaff.map((staff) => ({
			value: staff.id,
			label: `${staff.firstName} ${staff.designation}`,
		}));
		// Add an initial unassigned option
		options.unshift({ value: null, lable: "---Select Staff---" });
		return options;
	}, [eligibleStaff]);

	// Handler for inline select change
	const handleAssignmentChange = (moduleId, newStaffId) => {
		setLocalModules((prevModules) =>
			prevModules.map((m) => {
				if (m.moduleId === moduleId) {
					// Convert to integer or null for comparison
					const currentStaffId = m.assignedStaffId;
					const newStaffIdInt = parseInt(newStaffId) || null;

					// Check if the new value is different from the last officially saved value
					const isModified = currentStaffId !== newStaffIdInt;

					return {
						...m,
						tempAssignedStaffId: newStaffIdInt,
						isModified: isModified,
						isSaved: !isModified && m.isSaved, // Mark as unsaved if modified
					};
				}
				return m;
			})
		);
	};

	// Handler for saving the assignment
	const handleSaveAssignment = async (moduleId, staffId) => {
		if (!staffId) {
			// dispatch(
			// 	showNotification({
			// 		type: "warning",
			// 		message:
			// 			"Please select a Module Coordinator before saving.",
			// 	})
			// );
			return;
		}
		setSavingModuleId(moduleId);
		try {
			await assignCoordinator(moduleId, staffId);

			if (assigned) {
				// dispatch(
				// 	showNotification({
				// 		type: "success",
				// 		message: `Module Router assignment saved successfully for Module ID ${moduleId}.`,
				// 	})
				// );

				// Update local state to reflect successful save
				setLocalModules((prevModules) =>
					prevModules.map((m) => {
						if (m.moduleId === moduleId) {
							return {
								...m,
								assignedStaffId: staffId, // Commit the temp ID to the official ID
								tempAssignedStaffId: staffId,
								isModified: false,
								isSaved: true,
							};
						}
						return m;
					})
				);
			} else {
				// dispatch(
				// 	showNotification({
				// 		type: "error",
				// 		message:
				// 			"Failed to save Module Router assignment (Mocked failure).",
				// 	})
				// );
			}
		} catch (error) {
			// dispatch(
			// 	showNotification({
			// 		type: "error",
			// 		message: "An unexpected error occurred during save.",
			// 	})
			// );
		} finally {
			setSavingModuleId(null);
		}
	};

	// Handler for viewing subjects
	const handleViewSubjects = (module) => {
		setActiveModule(module);
		setShowModal(true);
	};

	const isLoading = loadingModules || loadingStaff;
	const isDataReady = !isLoading && modules.length > 0;
	const isModulesEmpty = !isLoading && modules.length === 0;

	return (
		<>
			<Card className={"h-[510px]"}>
				<CardBody>
					{isLoading ? (
						<SkeletonTable />
					) : isModulesEmpty ? (
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
										<TableHeader className='w-[20%]'>Module Title</TableHeader>
										<TableHeader className='w-[15%]'>Theory Hours</TableHeader>
										<TableHeader className='w-[15%]'>Practical Hours</TableHeader>
										<TableHeader className='w-[25%]'>Module Coordinator</TableHeader>
										<TableHeader className='w-[25%]'>Assignment Status</TableHeader>
										<TableHeader className='text-center rounded-tr-2xl w-[20%]'>View Subjects</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							{isDataReady && (
								<div className='h-[440px] rounded-b-2xl overflow-y-auto scrollbar-none'>
									<Table>
										<TableBody>
											{modules.map((module, index) => {
												const isCurrentlySaving = savingModuleId === module.moduleId;
												const isAssigned = module.assignedStaffId !== null;
												return (
													<TableRow key={module.moduleId}>
														<TableCell className='font-medium text-center w-[5%]'>{index + 1}</TableCell>
														<TableCell className='w-[20%]'>{module.moduleTitle}</TableCell>
														<TableCell className='w-[15%]'>{module.theoryHours}</TableCell>
														<TableCell className='w-[15%]'>{module.practicalHours}</TableCell>
														<TableCell className='w-[25%] font-medium'>
															<CustomSelect
																value={module.tempAssignedStaffId}
																options={staffOptions}
																placeholder='Select Module Coordinator'
																onChange={(e) => handleAssignmentChange(module.moduleId, e.target.value)}
																disabled={isCurrentlySaving}
															/>
														</TableCell>
														<TableCell className='w-[20%]'>
															<Button
																size='sm'
																variant={module.isModified ? "primary" : "success"}
																onClick={() => handleSaveAssignment(module.moduleId, module.tempAssignedStaffId)}
																isLoading={isCurrentlySaving}
																disabled={isCurrentlySaving || !module.isModified}
																className='w-[120px]'>
																{module.isSaved && !module.isModified ? (
																	<HStack spacing='xs'>
																		<CheckCircle size={16} /> Saved
																	</HStack>
																) : (
																	<HStack spacing='xs'>
																		<Save size={16} /> Save
																	</HStack>
																)}
															</Button>
														</TableCell>
														<TableCell className='text-center'>
															<Button
																variant='ghost'
																size='sm'
																onClick={() => handleViewSubjects(module)}
																title='View Subjects in this Module'>
																<Eye size={18} className='text-gray-500 hover:text-indigo-600' />
															</Button>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							)}
						</>
					)}
				</CardBody>
			</Card>

			{/* Modal for viewing associated Subjects */}
			<SubjectDetailModal isOpen={showModal} onClose={() => setShowModal(false)} module={activeModule} />
		</>
	);
};

export default ModuleRouter;
