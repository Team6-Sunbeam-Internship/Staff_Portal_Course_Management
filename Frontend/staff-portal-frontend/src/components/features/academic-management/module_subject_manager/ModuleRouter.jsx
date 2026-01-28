import { useState, useEffect, useMemo} from "react";
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
	EmptyState,
	SkeletonTable,
	CustomSelect,
	Grid,
	GridItem,
	Badge,
} from "../../../layout";
import { useDispatch, useSelector } from "react-redux";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useAssignModuleRouterMutation,
	useGetAssignCourseAndModulesQuery,
	useGetEligibleStaffQuery,
} from "../../../../store";
import { useModal } from "../../../../providers";
import { useFilteredMenu } from "../../../../hooks";
import { selectUserRole } from "../../../../store/selectors";
import { ErrorFallback } from "../../../layout/errorBoundary";

const ModuleRouter = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);

	const { pathSet } = useFilteredMenu();
	const canAccessModuleRouter = pathSet.has("/academic-management/module-subject-manager") && userRole === "COURSE_COORDINATOR";

	// RTK Query Hooks
	// before this COURSE_COORDINATOR has to get the assign course, from which it will get the , course name
	// rtk query hook: useGetAssignCourseQuery, param: coordinator staff id(extract from access token)

	// list of coursecode, coursename, isCurrent, list<moduleresponsedto>
	const {
		data: assignCourseAndModules = [],
		isLoading: loadingAssignCourseAndModules,
		isError: isErrorAssignCourseAndModules,
		error: errorAssignCourseAndModules,
	} = useGetAssignCourseAndModulesQuery();

	const uniqueCourseNames = useMemo(() => {
		return Array.from(new Set(assignCourseAndModules.map((item) => item.courseName)));
	}, [assignCourseAndModules]);

	// course_coordinator can also become module router
	const {
		data: eligibleStaff,
		isLoading: loadingStaff,
		isError: isErrorStaff,
		error: errorStaff,
	} = useGetEligibleStaffQuery({courseNames:uniqueCourseNames, multiple: true}, { skip: uniqueCourseNames.length === 0 });

	const [assignCoordinator, { isLoading: isSaving, isSuccess: assigned }] =
		useAssignModuleRouterMutation(/**id, module_router_id, module_router_name */);

	const [filters, setFilters] = useState({
		courseCode: "",
	});
	const [modules, setLocalModules] = useState([]);
	const [activeModule, setActiveModule] = useState(null); // Module for the Subject modal
	const { showModal, setShowModal } = useModal();
	const [savingModuleId, setSavingModuleId] = useState(null);

	// Find the currently selected course object from the fetched data
	const currentCourseBatch = useMemo(() => {
		return assignCourseAndModules.find((acm) => acm.courseCode === filters.courseCode);
	}, [assignCourseAndModules, filters.courseCode]);

	// Find the designated "Current" batch cycle from the initial fetch
	const currentEditableCourse = useMemo(() => {
		return assignCourseAndModules.find((acm) => acm.isCurrent);
	}, [assignCourseAndModules]);

	// 1. Initial Load & Filter Selection
	useEffect(() => {
		// Auto select the current batch cycle on load
		if (assignCourseAndModules.length > 0 && filters.courseCode === null && currentEditableCourse) {
			setFilters({ courseCode: currentEditableCourse.courseCode });
		}
	}, [assignCourseAndModules, currentEditableCourse, filters.courseCode]);

	// 2. Sync Modules to Local State based on selection
	useEffect(() => {
		const selectedModules = currentCourseBatch ? currentCourseBatch.assignCourseModuleList : [];

		setLocalModules(
			selectedModules.map((module) => ({
				...module,
				// Map moduleRouterId (UUID) to tempAssignedStaffId for UI
				assignedStaffId: module.moduleRouterId,
				tempAssignedStaffId: module.moduleRouterId,
				isModified: false,
				isSaved: !!module.moduleRouterId,
			}))
		);
	}, [currentCourseBatch]);

	// =========================================================================
	// 3. UI/EFFECTS/HANDLERS
	// =========================================================================

	useEffect(() => {
		if (isErrorAssignCourseAndModules) {
			console.log(errorAssignCourseAndModules);
		}
		if (isErrorStaff) {
			console.log(errorStaff);
		}
		if (isSaving) {
			console.log("Saving...");
		}
	}, [isSaving, isErrorAssignCourseAndModules, isErrorStaff, errorAssignCourseAndModules, errorStaff]);

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

	const courseOptions = useMemo(() => {
		return assignCourseAndModules.map((course) => ({
			value: course.courseCode,
			label: course.courseCode,
		}));
	}, [assignCourseAndModules]);

	const staffOptions = useMemo(() => {
		const options = eligibleStaff.map((staff) => ({
			value: staff.staffId,
			label: `${staff.name} ${staff.courseSpecialization === "multiple" ? "Multiple Specialization" : staff.courseSpecialization}`,
		}));
		// Add an initial unassigned option
		options.unshift({ value: null, lable: "---Select Staff---" });
		return options;
	}, [eligibleStaff]);

	if(!canAccessModuleRouter) {
		return <ErrorFallback errorMessage="You do not have permission to access this page." />;
	}
	
	const isCurrentBatch = currentEditableCourse ? filters.courseCode === currentEditableCourse.courseCode : false;

	const handleFilterChange = (newCourseCode) => {
		const selectedCourse = assignCourseAndModules.find((acm) => acm.courseCode === newCourseCode);
		if (selectedCourse) {
			setFilters({
				courseCode: selectedCourse.courseCode,
			});
		}
	};

	// Handler for inline select change
	const handleAssignmentChange = (moduleId, newStaffId) => {
		if (!isCurrentBatch) return;

		setLocalModules((prevModules) =>
			prevModules.map((m) => {
				if (m.moduleId === moduleId) {
					// Convert to integer or null for comparison
					const currentStaffId = m.assignedStaffId;
					// const newStaffIdInt = parseInt(newStaffId) || null;

					// Check if the new value is different from the last officially saved value
					const isModified = currentStaffId !== newStaffId;

					return {
						...m,
						tempAssignedStaffId: newStaffId,
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
		if (!isCurrentBatch) {
			//dispatch(showNotification({ type: 'error', message: 'Assignment cannot be saved for an old batch cycle.' }));
			return;
		}
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

	const isLoading = loadingAssignCourseAndModules || loadingStaff;
	const isDataReady = !isLoading && filters.courseCode !== null && modules.length > 0;
	const isModulesEmpty = !isLoading && filters.courseCode !== null && modules.length === 0;

	return (
		<>
			<Grid columns={{ base: 1, md: 2, lg: 3 }}>
				<GridItem>
					<CustomSelect
						value={filters.courseCode}
						options={courseOptions}
						placeholder='Select a Course'
						onChange={(e) => handleFilterChange(e.target.value)}
						disabled={loadingAssignCourseAndModules}
					/>
				</GridItem>
				<GridItem>
					{currentCourseBatch && (
						<Badge variant={isCurrentBatch ? "success" : "default"} className='text-base p-2 w-full justify-center'>
							Status: {isCurrentBatch ? "Current-Editable" : "Old Batch-Read Only"}
						</Badge>
					)}
				</GridItem>
			</Grid>

			<Card className={"h-[510px]"}>
				<CardBody>
					{isLoading && filters.courseId && <SkeletonTable rows={5} />}

					{filters.courseId === null && !loadingAssignCourseAndModules && (
						<EmptyState
							title='Select a Course and Batch Cycle'
							description='Please use the filter above to load the modules you wish to assign Coordinators for.'
							icon={<Filter className='w-12 h-12' />}
						/>
					)}

					{isModulesEmpty && currentCourseBatch && (
						<EmptyState
							title='No Modules Found'
							description={`There are no modules defined for the course "${currentCourseBatch.courseName}" in this batch cycle.`}
							icon={<BookOpen className='w-12 h-12' />}
						/>
					)}
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
											const isEditable = isCurrentBatch;
											return (
												<TableRow key={module.moduleId}>
													<TableCell className='font-medium text-center w-[5%]'>{index + 1}</TableCell>
													<TableCell className='w-[20%]'>{module.title}</TableCell>
													<TableCell className='w-[15%]'>{module.theoryHours}</TableCell>
													<TableCell className='w-[15%]'>{module.practicalHours}</TableCell>
													<TableCell className='w-[25%] font-medium'>
														<CustomSelect
															value={module.tempAssignedStaffId}
															options={staffOptions}
															placeholder='Select Module Coordinator'
															onChange={(e) => handleAssignmentChange(module.id, e.target.value)}
															disabled={isCurrentlySaving || !isEditable || loadingStaff}
															className={`${
																isAssigned && !module.isModified
																	? "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/10"
																	: module.isModified
																	? "border-yellow-400 dark:border-yellow-600 bg-yellow-50 dark:bg-yellow-900/10"
																	: "border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/10"
															}`}
														/>
													</TableCell>
													<TableCell className='w-[20%]'>
														<Button
															size='sm'
															variant={module.isModified ? "primary" : "success"}
															onClick={() => handleSaveAssignment(module.id, module.tempAssignedStaffId)}
															isLoading={isCurrentlySaving}
															disabled={
																isCurrentlySaving || !module.isModified || !isEditable || !module.tempAssignedStaffId
															}
															className='w-[120px]'>
															{module.isSaved && !module.isModified ? (
																<HStack spacing='xs' className='justify-center'>
																	<CheckCircle size={16} /> Assigned
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
															title='View detailed subjects'>
															<Eye size={18} className='text-gray-500 hover:text-indigo-600' /> View
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
				</CardBody>
			</Card>

			{/* Modal for viewing associated Subjects */}
			<SubjectDetailModule isOpen={showModal} onClose={() => setShowModal(false)} module={activeModule} />
		</>
	);
};

export default ModuleRouter;
