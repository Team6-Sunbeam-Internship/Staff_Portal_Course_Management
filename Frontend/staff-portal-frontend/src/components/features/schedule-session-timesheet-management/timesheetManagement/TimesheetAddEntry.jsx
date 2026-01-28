import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// --- Service-Specific RTK Query Imports ---
// Adjusted path/api name based on functionality
import { useFilteredMenu } from "../../../../hooks";
import {
	setBreadcrumbs, // Assumed to provide { course_code, locationId, batchCycleId, ... }
} from "../../../../store";
import { useGetModuleRouterCoursehierarchyQuery, useSubmitTimesheetMutation } from "../../../../store/api/timesheet-mgmtApi";
import { selectUserRole } from "../../../../store/selectors";
import { notify } from "../../../../utils/Notify";
import {
	Badge,
	Button,
	Card,
	CardBody,
	CardHeader,
	CustomSelect,
	FormField,
	Grid,
	GridItem,
	Input,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	VStack,
} from "../../../layout";

// Helper to calculate duration in hours as a decimal (e.g., 1.5 for 1 hour 30 mins)
const getDurationHoursDecimal = (startTime, endTime) => {
	if (!startTime || !endTime) return 0;
	try {
		const start = new Date(`2000-01-01T${startTime}`);
		const end = new Date(`2000-01-01T${endTime}`);
		const diffMs = end - start;
		if (diffMs <= 0) return 0;
		return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
	} catch (e) {
		console.error("Error calculating duration: ", e);
		return 0;
	}
};

const TimesheetAddEntry = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessTimesheetAddEntry = pathSet.has("/scheduling-session-timesheet-mgmt/timesheet-add-entry") && userRole === "GENERAL_USER";

	const [submitTimesheet, { isLoading: submitting }] = useSubmitTimesheetMutation();

	// courseHierarchy = courseCode, list of modules, list of subjects, list of sections, list of topics -> for this moduleRouter id is need == staff id
	const {
		data: courseHierarchy = [],
		isLoading: courseHierarchyLoading,
		isError: isCourseHierarchyError,
		error: courseHierarchyError,
	} = useGetModuleRouterCoursehierarchyQuery();

	// --- FORM DATA STATE ---
	const [formData, setFormData] = useState({
		date: "",
		startTime: "",
		endTime: "",
		entryType: "",
		extraTopics: "",
		taskAssignment: "",
	});

	// State to store the hierarchy of selected topics
	const [selectedTopicGroups, setSelectedTopicGroups] = useState([]);

	// --- COURSE SELECTION LOGIC STATE ---
	const [selectedCourseCode, setSelectedCourseCode] = useState(null);

	// --- Data Fetching for Course List (Only in Multiple Mode) ---
	const availableCourse = courseHierarchy.courseCode;

	// --- Effect to Initialize Course Selection ---
	useEffect(() => {
		// 1. Specific Designation Mode
		if (!selectedCourseCode) {
			setSelectedCourseCode(availableCourse);
		}
	}, [availableCourse, selectedCourseCode]);

	// --- TOPIC SELECTION MODAL STATE ---
	const [showTopicsModal, setShowTopicsModal] = useState(false);
	const [selectedModuleId, setSelectedModuleId] = useState(null);
	const [selectedSubjectId, setSelectedSubjectId] = useState(null);
	const [selectedSectionId, setSelectedSectionId] = useState(null);
	const [selectedModalTopics, setSelectedModalTopics] = useState([]);

	// --- DERIVED STATES (for Academic Structure Hierarchy) ---

	// ** CALCULATED DURATION **
	const calculatedDuration = useMemo(() => {
		return getDurationHoursDecimal(formData.startTime, formData.endTime);
	}, [formData.startTime, formData.endTime]);

	const availableModules = useMemo(() => {
		return courseHierarchy?.modules || [];
	}, [courseHierarchy]);

	const availableSubjects = useMemo(() => {
		const module = availableModules.find((m) => m.moduleId === selectedModuleId);
		return module?.subjects || [];
	}, [availableModules, selectedModuleId]);

	const availableSections = useMemo(() => {
		const subject = availableSubjects.find((s) => s.subjectId === selectedSubjectId);
		// Note: The original code defined availableSections based on availableSubjects,
		// but for the modal logic, we need ALL sections within the currently selected subject.
		return subject?.sections || [];
	}, [availableSubjects, selectedSubjectId]);

	const availableTopics = useMemo(() => {
		const sectionIdInt = parseInt(selectedSectionId); // Use selectedSectionId for topic list in Modal/Inline
		const section = availableSections.find((s) => s.sectionId === sectionIdInt);
		return section?.topics || [];
	}, [availableSections, selectedSectionId]);

	// CustomSelect Options Mappers
	const courseOptions = useMemo(() => {
		const options = [
			{
				value: "",
				label: courseHierarchyLoading ? "Loading Course..." : "Select Course",
				disabled: true,
			},
			{
				value: availableCourse,
				label: availableCourse,
			},
		];
		return options;
	}, [availableCourse, courseHierarchyLoading]);

	const moduleOptions = useMemo(() => {
		const defaultOption = [
			{
				value: "",
				label: courseHierarchyLoading ? "Loading Modules..." : "Select Module",
				disabled: true,
			},
		];
		const moduleMap = availableModules.map((module) => ({
			value: module.moduleId.toString(),
			label: module.moduleName,
		}));
		return [...defaultOption, ...moduleMap];
	}, [availableModules, courseHierarchyLoading]);

	const subjectOptions = useMemo(() => {
		const defaultLabel = selectedModuleId ? "Select Subject" : "Select a Module first";
		const defaultOption = [{ value: "", label: defaultLabel, disabled: true }];
		const subjectMap = availableSubjects.map((subject) => ({
			value: subject.subjectId.toString(),
			label: subject.subjectName,
		}));
		return [...defaultOption, ...subjectMap];
	}, [availableSubjects, selectedModuleId]);

	// --- HANDLER FUNCTIONS ---

	const updateFormData = (field, value) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	// ** NEW HANDLER: For Course Selection **
	const handleCourseSelect = (code) => {
		// Reset all lower-level selections when a new course is chosen
		setSelectedCourseCode(code);
		setSelectedModuleId(null);
		setSelectedSubjectId(null);
		setSelectedSectionId(null);
		setSelectedTopicGroups([]);
		setSelectedModalTopics([]);
	};

	const handleModuleSelect = (moduleId) => {
		setSelectedModuleId(moduleId);
		setSelectedSubjectId(null);
		setSelectedSectionId(null);
		// Do not reset selectedTopicGroups here, only when Course changes
	};

	const handleSubjectSelect = (subjectId) => {
		setSelectedSubjectId(subjectId);
		setSelectedSectionId(null);
	};

	// Handler specifically for the modal's internal section select (if different from main state)
	const handleModalSectionSelect = (sectionId) => {
		setSelectedSectionId(sectionId);
		// Pre-select topics if this section was already added
		const existingGroup = selectedTopicGroups.find((g) => g.sectionId === parseInt(sectionId));
		setSelectedModalTopics(existingGroup ? existingGroup.topics : []);
	};

	const handleTopicToggle = (topic) => {
		setSelectedModalTopics((prev) => {
			const exists = prev.some((t) => t.id === topic.id);
			if (exists) {
				return prev.filter((t) => t.id !== topic.id);
			} else {
				return [...prev, { id: topic.id, name: topic.name, completed: true }];
			}
		});
	};

	const resetTopicModalState = () => {
		// Only reset the transient modal selection state, not the permanent hierarchy
		setSelectedModalTopics([]);
	};

	const handleAddTopics = () => {
		if (!selectedModuleId || !selectedSubjectId || !selectedSectionId || selectedModalTopics.length === 0) {
			notify.error("Please select module, subject, section, and at least one topic.");
			return;
		}

		const moduleIdInt = parseInt(selectedModuleId);
		const module = availableModules.find((m) => m.moduleId === moduleIdInt);
		const subjectIdInt = parseInt(selectedSubjectId);
		const subject = availableSubjects.find((s) => s.subjectId === subjectIdInt);
		const sectionIdInt = parseInt(selectedSectionId);
		const section = availableSections.find((s) => s.sectionId === sectionIdInt);

		if (!module || !subject || !section) {
			notify.error("Academic structure lookup failed. Please refresh.");
			return;
		}

		const newTopicGroup = {
			// ** CRITICAL ADDITIONS for Multi-Course Support **
			courseCode: selectedCourseCode,

			moduleId: module.moduleId,
			moduleName: module.moduleName,
			subjectId: subject.subjectId,
			subjectName: subject.subjectName,
			sectionId: section.sectionId,
			sectionName: section.sectionName,
			topics: selectedModalTopics.map((t) => ({ ...t, completed: true })),
		};

		// Replace or add the new topic group based on sectionId
		setSelectedTopicGroups((prev) => [...prev.filter((g) => g.sectionId !== newTopicGroup.sectionId), newTopicGroup]);

		// Reset section/topic selection after adding
		setSelectedSectionId(null);
		setSelectedModalTopics([]);

		setShowTopicsModal(false);
	};

	const removeTopicGroup = (sectionId) => {
		setSelectedTopicGroups((prev) => prev.filter((group) => group.sectionId !== sectionId));
	};

	const handleSubmit = async () => {
		if (!selectedCourseCode) {
			notify.error("Please select a Course.");
			return;
		}

		if (selectedTopicGroups.length === 0) {
			notify.error("Please add at least one topic group.");
			return;
		}

		const duration = calculatedDuration; // Use the calculated duration
		if (duration <= 0) {
			notify.error("Start time must be before end time and endTime must be later.");
			return;
		}

		const payload = {
			...formData,
			duration: duration,
			topicGroups: selectedTopicGroups,
			// Pass the course code that was selected/pre-set
			courseCode: selectedCourseCode,
			// created by will be set by the backend using access token
		};

		try {
			await submitTimesheet(payload).unwrap();
			notify.success("Timesheet entry submitted successfully!");
			// Reset form and state after successful submission
			setFormData({
				date: "",
				startTime: "",
				endTime: "",
				entryType: "",
				extraTopics: "",
				taskAssignment: "",
			});
			setSelectedTopicGroups([]);
			setSelectedModuleId(null);
			setSelectedSubjectId(null);
			setSelectedSectionId(null);
		} catch (error) {
			notify.error(`Submission failed: ${error.data?.message || "Unknown error"}`);
		}
	};

	useEffect(() => {
		dispatch(
			setBreadcrumbs([
				{ title: "Home", path: "/dashboard", icon: "home" },
				{
					title: "Scheduling & Sessions",
					path: "/scheduling-sessions",
					icon: "calendar",
				},
				{
					title: "Timesheets",
					path: "/scheduling-sessions/timesheets",
					icon: "clock",
				},
				{
					title: "Add Entry",
					path: "/scheduling-sessions/timesheets/add-entry",
					icon: "plus",
				},
			])
		);
	}, [dispatch]);

	const entryTypeOptions = [
		{ value: "", label: "Select Entry Type" },
		{ value: "THEORY", label: "Theory" },
		{ value: "LAB", label: "Lab" },
		{ value: "ASSIGNMENT", label: "Assignment" }, // <-- Corrected syntax error
	];

	return (
		<VStack spacing='lg' className='p-4 sm:p-6'>
			<Grid templateColumns='repeat(1, 1fr) md:repeat(3, 1fr)' gap='lg' className='w-full'>
				{/* ------------------------------------------- */}
				{/* --- COLUMN 1: Timesheet Entry Details ---   */}
				{/* ------------------------------------------- */}
				<GridItem colSpan={{ base: 1, md: 1 }}>
					<Card>
						{/* <CardHeader title='Session & Entry Details' /> */}
						<CardBody>
							<FormField label='Date'>
								<Input type='date' value={formData.date} onChange={(e) => updateFormData("date", e.target.value)} />
							</FormField>
							<Grid templateColumns='repeat(2, 1fr)' gap='md'>
								<FormField label='Start Time'>
									<Input type='time' value={formData.startTime} onChange={(e) => updateFormData("startTime", e.target.value)} />
								</FormField>
								<FormField label='End Time'>
									<Input type='time' value={formData.endTime} onChange={(e) => updateFormData("endTime", e.target.value)} />
								</FormField>
							</Grid>
							<FormField label='Duration (Hours)'>
								<Input
									readOnly
									value={calculatedDuration > 0 ? calculatedDuration.toFixed(2) : "0.00"}
									title='Calculated automatically from Start/End Time'
									className='cursor-not-allowed bg-gray-100 dark:bg-gray-700'
								/>
							</FormField>
							<FormField label='Entry Type'>
								<CustomSelect
									value={formData.entryType}
									onChange={(e) => updateFormData("entryType", e.target.value)}
									options={entryTypeOptions} // CustomSelect now has options prop
								/>
							</FormField>
						</CardBody>
					</Card>
				</GridItem>

				{/* ---------------------------------------------------- */}
				{/* --- COLUMN 2: Course, Module, Topics Summary ---     */}
				{/* ---------------------------------------------------- */}
				<GridItem colSpan={{ base: 1, md: 1 }}>
					<VStack spacing='lg' className='w-full'>
						{/* SECTION 1: Course & Module */}
						<Card>
							<CardHeader title='Course & Module Selection' />
							<CardBody>
								<FormField label='Course'>
									<CustomSelect
										value={selectedCourseCode || ""}
										onChange={(e) => handleCourseSelect(e.target.value)}
										options={courseOptions}
										disabled={courseHierarchyLoading}
									/>
								</FormField>
								<FormField label='Module'>
									<CustomSelect
										value={selectedModuleId || ""}
										onChange={(e) => handleModuleSelect(e.target.value)}
										options={moduleOptions}
										disabled={!selectedCourseCode || courseHierarchyLoading}
									/>
								</FormField>

								{/* READ-ONLY DISPLAY of Course & Module Name */}
								<div className='mt-2 rounded bg-gray-50 p-2 text-sm dark:bg-gray-700'>
									<p>
										<strong>Course:</strong> {availableCourse}
									</p>
									<p>
										<strong>Module:</strong> {availableModules.find((m) => m.moduleId === parseInt(selectedModuleId))?.moduleName || "N/A"}
									</p>
								</div>
							</CardBody>
						</Card>

						{/* SECTION 2: Topics Summary & Modal Trigger */}
						<Card>
							<CardHeader
								title='Topics Covered'
								actions={
									<Button
										variant='primary'
										onClick={() => {
											if (selectedCourseCode) {
												setShowTopicsModal(true);
												// Reset only transient modal state
												setSelectedModalTopics([]);
											} else {
												notify.warning("Please select a Course first.");
											}
										}}
										size='sm'
										disabled={!selectedCourseCode || courseHierarchyLoading}>
										<Plus className='mr-2 h-4 w-4' />
										Add Topics
									</Button>
								}
							/>
							<CardBody className='p-0'>
								{selectedTopicGroups.length === 0 ?
									<div className='py-4 text-center text-gray-500'>No topics added yet.</div>
								:	<Table>
										<TableHead>
											<TableRow>
												<TableHeader>Subject /Section</TableHeader>
												<TableHeader className='w-16'>Action</TableHeader>
											</TableRow>
										</TableHead>
										<TableBody>
											{selectedTopicGroups.map((group, index) => (
												<TableRow key={index}>
													<TableCell className='py-2'>
														<div className='text-sm font-semibold'>{group.subjectName}</div>
														<div className='mt-1 flex items-center text-xs text-gray-500'>
															<ChevronRight className='mx-1 inline h-3 w-3 text-gray-400' />
															{group.sectionName}
														</div>
														<div className='mt-2 flex flex-wrap gap-1'>
															{group.topics.map((topic) => (
																<Badge key={topic.id} variant='success' size='xs'>
																	{topic.name}
																</Badge>
															))}
														</div>
													</TableCell>
													<TableCell>
														<Button variant='ghost' size='icon' onClick={() => removeTopicGroup(group.sectionId)}>
															<Trash2 className='h-5 w-5 text-red-500' />
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								}
							</CardBody>
						</Card>
					</VStack>
				</GridItem>

				{/* ------------------------------------------------------------------- */}
				{/* --- COLUMN 3: Additional Details & Submission ---                       */}
				{/* ------------------------------------------------------------------- */}
				<GridItem colSpan={{ base: 1, md: 1 }}>
					<Card>
						<CardHeader title='Additional Details & Submission' />
						<CardBody>
							<FormField label='Task/Assignment (if applicable)'>
								<Input
									value={formData.taskAssignment}
									onChange={(e) => updateFormData("taskAssignment", e.target.value)}
									placeholder='e.g., Graded Mid-Term Assignment'
								/>
							</FormField>

							<FormField label='Extra Topics/Notes (Optional)'>
								<Input
									value={formData.extraTopics}
									onChange={(e) => updateFormData("extraTopics", e.target.value)}
									placeholder='Any other points covered'
								/>
							</FormField>

							<Button
								variant='primary'
								className='mt-6 w-full'
								onClick={handleSubmit}
								disabled={
									submitting || selectedTopicGroups.length === 0 || !formData.date || !formData.startTime || !formData.endTime || !selectedCourseCode
								}>
								{submitting ? "Submitting..." : "Submit Timesheet Entry"}
							</Button>
						</CardBody>
					</Card>
				</GridItem>
			</Grid>

			{/* ------------------------------------------------------------------- */}
			{/* --- Topics Selection Modal (Subject/Section/Topic Logic) ---        */}
			{/* ------------------------------------------------------------------- */}
			<Modal
				isOpen={showTopicsModal}
				onClose={() => {
					// Reset selection when closing modal
					resetTopicModalState();
					setShowTopicsModal(false);
				}}
				size='3xl'>
				<ModalHeader
					title='Select Topics'
					subtitle={`Course: ${availableCourse || selectedCourseCode || "N/A"} | Module: ${
						availableModules.find((m) => m.moduleId === parseInt(selectedModuleId))?.moduleName || "Select Module"
					}`}
				/>
				<ModalBody>
					<VStack spacing='lg' className='w-full'>
						{courseHierarchyLoading ?
							<div className='flex h-40 items-center justify-center'>
								<span className='text-gray-500'>Loading Academic Structure...</span>
							</div>
						:	<Grid templateColumns='repeat(1, 1fr) md:repeat(3, 1fr)' gap='lg' className='w-full'>
								{/* COLUMN 1: Subject Dropdown (Dependent on Module selected in main form) */}
								<GridItem colSpan={1}>
									<Card>
										<CardHeader title='Subject Selection' />
										<CardBody className='max-h-80 overflow-y-auto'>
											<FormField label='Subject'>
												<CustomSelect
													value={selectedSubjectId || ""}
													onChange={(e) => handleSubjectSelect(e.target.value)}
													options={subjectOptions}
													disabled={!selectedModuleId}
												/>
											</FormField>
										</CardBody>
									</Card>
								</GridItem>

								{/* COLUMN 2: Section List (Dependent on Subject) */}
								<GridItem colSpan={1}>
									<Card>
										<CardHeader title='Section List' />
										<CardBody className='max-h-80 overflow-y-auto'>
											{availableSections.length > 0 ?
												<VStack spacing='sm'>
													{availableSections.map((section) => (
														<Button
															key={section.sectionId}
															variant={parseInt(selectedSectionId) === section.sectionId ? "default" : "ghost"}
															className='w-full justify-start text-sm'
															onClick={() => handleModalSectionSelect(section.sectionId.toString())}>
															{section.sectionName}
														</Button>
													))}
												</VStack>
											:	<div className='p-3 text-sm text-gray-500'>
													{selectedSubjectId ? "No sections available or Select a subject." : "Select a Subject first."}
												</div>
											}
										</CardBody>
									</Card>
								</GridItem>

								{/* COLUMN 3: Topic List (Dependent on Section) */}
								<GridItem colSpan={1}>
									<Card>
										<CardHeader title='Topic List' />
										<CardBody className='max-h-80 overflow-y-auto'>
											<VStack spacing='sm'>
												{selectedSectionId && availableTopics.length > 0 ?
													availableTopics.map((topic) => (
														<label
															key={topic.id}
															className='flex w-full cursor-pointer items-center space-x-3 rounded p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50'>
															<input
																type='checkbox'
																checked={selectedModalTopics.some((t) => t.id === topic.id)}
																onChange={() => handleTopicToggle(topic)}
																className='rounded text-indigo-600 focus:ring-indigo-500'
															/>
															<span className='text-sm'>{topic.name}</span>
														</label>
													))
												:	<div className='p-3 text-sm text-gray-500'>
														{selectedSectionId ? "No topics available for this section." : "Select a Section to see topics."}
													</div>
												}
											</VStack>
										</CardBody>
									</Card>
								</GridItem>
							</Grid>
						}
					</VStack>
				</ModalBody>
				<ModalFooter>
					<Button
						variant='secondary'
						onClick={() => {
							resetTopicModalState();
							setShowTopicsModal(false);
						}}>
						Cancel
					</Button>
					<Button
						variant='primary'
						onClick={handleAddTopics}
						disabled={selectedModalTopics.length === 0 || !selectedModuleId || !selectedSubjectId || !selectedSectionId}>
						Add Topics
					</Button>
				</ModalFooter>
			</Modal>
		</VStack>
	);
};

export default TimesheetAddEntry;
