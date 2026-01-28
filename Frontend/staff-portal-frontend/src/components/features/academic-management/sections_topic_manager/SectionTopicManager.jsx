/* eslint-disable*/
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateSectionMutation,
	useCreateTopicMutation,
	useDeleteSectionMutation,
	useDeleteTopicMutation,
	useGetAllCourseTypesQuery,
	useGetBatchCycleQuery,
	useGetCourseHierarchyQuery,
	useGetCoursesQuery,
	useUpdateSectionMutation,
	useUpdateTopicMutation,
} from "../../../../store";

import { CustomSelect, EmptyState } from "../../../layout";
import { useModal } from "../../../../providers/providerHook";
import { selectUserRole } from "../../../../store/selectors";
import { useFilteredMenu } from "../../../../hooks";
import { ErrorFallback } from "../../../layout/errorBoundary";
import { SectionTable } from "./SectionTable";
import { TopicTable } from "./TopicTable";
import { RotateCcw, ShieldX } from "lucide-react";
import { ModalForm } from "../../../layout/modals/ModalForm";
import { SectionForm } from "./SectionForm";
import { TopicForm } from "./TopicForm";
import { notify } from "../../../../utils/Notify";

const SectionTopicManager = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const initialSubject = location.state?.subject;
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessModuleSubjectManager = pathSet.has("/academic-management/sections-topics") && userRole === "ADMIN";

	// filters
	const [filters, setFilters] = useState({
		courseTypeId: "",
		batchCycleId: "",
		courseCode: "",
		moduleId: "",
		subjectId: initialSubject?.subjectId || "",
	});
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

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
	const { data: batchCycleOptions } = useGetBatchCycleQuery(undefined, {
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

	//--------------------Course Hierarchy--------------------
	const {
		data: courseHierarchy = {
			modules: [],
			subjects: [],
			sections: [],
			topics: [],
		},
		isLoading: isLoadingCourseHierarchy,
		isError: isErrorCourseHierarchy,
		error: errorCourseHierarchy,
	} = useGetCourseHierarchyQuery(filters.courseCode, {
		skip: !filters.batchCycleId || !filters.courseCode,
	});
	console.log("Course Hierarchy: ", courseHierarchy);
	const moduleOptions = useMemo(() => {
		if (isLoadingCourseHierarchy) return [];
		if (!filters.batchCycleId || !filters.courseCode) {
			return [{ value: "", label: "Select the Module" }];
		}

		return [
			{ value: "", label: "Select the Module" },
			...courseHierarchy?.modules.map((module) => ({
				label: module.title,
				value: module.id,
			})),
		];
	}, [isLoadingCourseHierarchy, filters.batchCycleId, filters.courseCode, courseHierarchy.modules]);

	const subjectOptions = useMemo(() => {
		if (isLoadingCourseHierarchy) return [];
		if (!filters.moduleId) {
			return [{ value: "", label: "Select the Subject" }];
		}

		return [
			{ value: "", label: "Select the Subject" },
			...courseHierarchy.subjects
				.filter((s) => s.moduleId === filters.moduleId)
				.map((subject) => ({
					label: subject.title,
					value: subject.id,
				})),
		];
	}, [isLoadingCourseHierarchy, filters.moduleId, courseHierarchy.subjects]);

	const selectedSections = useMemo(() => {
		if (!filters.subjectId || !courseHierarchy?.sections) return [];

		return courseHierarchy.sections.filter((section) => section.subjectId === filters.subjectId);
	}, [filters.subjectId, courseHierarchy.sections]);

	//--------------------Sections Api--------------------
	const [createSection, { isSuccess: createdSection, isLoading: creatingSection, isError: isErrorCreateSection, error: errorCreateSection }] =
		useCreateSectionMutation();
	const [updateSection, { isSuccess: updatedSection, isLoading: updatingSection, isError: isErrorUpdateSection, error: errorUpdateSection }] =
		useUpdateSectionMutation();
	const [deleteSectionTrigger, { isSuccess: deletedSection, isLoading: deletingSection, isError: isErrorDeleteSection, error: errorDeleteSection }] =
		useDeleteSectionMutation();
	//--------------------Topics Api--------------------
	const [createTopic, { isSuccess: createdTopic, isLoading: creatingTopic, isError: isErrorCreateTopic, error: errorCreateTopic }] =
		useCreateTopicMutation();
	const [updateTopic, { isSuccess: updatedTopic, isLoading: updatingTopic, isError: isErrorUpdateTopic, error: errorUpdateTopic }] =
		useUpdateTopicMutation();
	const [deleteTopicTrigger, { isSuccess: deletedTopic, isLoading: deletingTopic, isError: isErrorDeleteTopic, error: errorDeleteTopic }] =
		useDeleteTopicMutation();

	const formRef = useRef(null);
	const { openModal, closeModal, showModal } = useModal();
	const [editingSection, setEditingSection] = useState(null);
	const [editingTopic, setEditingTopic] = useState(null);
	const [deleteSectionModal, setDeleteSectionModal] = useState({
		open: false,
		section: null,
	});
	const [deleteTopicModal, setDeleteTopicModal] = useState({
		open: false,
		topic: null,
	});

	useEffect(() => {
		if (createdSection) {
			// Placeholder: creatingSection(showNotification({ type: 'success', message: 'Module created successfully!' }));
			console.log("Notification: Module created successfully!");
		}
		if (isErrorCreateSection) {
			// show toast
			console.log(errorCreateSection);
		}
		if (updatedSection) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Module updated successfully!' }));
			console.log("Notification: Module updated successfully!");
		}
		if (isErrorUpdateSection) {
			// show toast
			console.log(errorUpdateSection);
		}
		if (deletedSection) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Module deleted successfully!' }));
			console.log("Notification: Module deleted successfully!");
		}
		if (isErrorDeleteSection) {
			// show toast
			console.log(errorDeleteSection);
		}
		if (createdTopic) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Subject created successfully!' }));
			console.log("Notification: Subject created successfully!");
		}
		if (isErrorUpdateSection) {
			// show toast
			console.log(errorUpdateSection);
		}
		if (isErrorDeleteSection) {
			// show toast
			console.log(errorDeleteSection);
		}
		if (isErrorCreateTopic) {
			// show toast
			console.log(errorCreateTopic);
		}
		if (isErrorUpdateTopic) {
			// show toast
			console.log(errorUpdateTopic);
		}
		if (isErrorDeleteTopic) {
			// show toast
			console.log(errorDeleteTopic);
		}
	}, [
		createdSection,
		updatedSection,
		creatingSection,
		createdTopic,
		updatedTopic,
		deletedTopic,
		isErrorCreateSection,
		isErrorUpdateSection,
		isErrorDeleteSection,
		isErrorCreateTopic,
		isErrorUpdateTopic,
		isErrorDeleteTopic,
		errorCreateSection,
		errorUpdateSection,
		errorDeleteSection,
		errorCreateTopic,
		errorUpdateTopic,
		errorDeleteTopic,
	]);

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Section Topic Manager",
				subtitle: "List of all sections and its topics in the institution",
				action: [
					{
						label: "import",
						entity: "Section",
						mode: "IMPORT",
					},
					{
						label: "Add Section",
						entity: "Section",
						mode: "CREATE",
					},
				],
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
					title: "Sections & Topics",
					path: "/academic-management/sections-topics",
					icon: "book-open",
				},
			])
		);
	}, [dispatch]);

	useEffect(() => {
		if (!showModal.open) return;

		if (showModal.entity === "Module") {
			setEditingSection(showModal.mode === "EDIT" ? showModal.payload : null);
		}

		if (showModal.entity === "Subject") {
			setEditingTopic(showModal.mode === "EDIT" ? showModal.payload : null);
		}
	}, [showModal]);

	const [selectedSectionId, setSelectedSectionId] = useState(null);
	const [selectedSectionTitle, setSelectedSectionTitle] = useState("");
	const fetchTopics = useMemo(() => {
		const allTopics = courseHierarchy?.topics || [];
		if (!selectedSectionId) return [];
		return allTopics.filter((topic) => topic.sectionId === selectedSectionId);
	}, [courseHierarchy?.topics, selectedSectionId]);

	if (!canAccessModuleSubjectManager) {
		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
	}

	//--------------------Section CRUD--------------------

	const handleSubmitSection = async (data) => {
		const { id, payload, courseCode, subjectId } = data;
		try {
			if (id) {
				await updateSection({ id, payload, courseCode }).unwrap();
				notify.success(`Section ${payload.sectionName} updated successfully!`);
			} else {
				await createSection({ payload, courseCode, subjectId }).unwrap();
				notify.success(`Section ${payload.sectionName} created successfully!`);
			}
		} catch (error) {
			notify.error(error?.data?.message || "Failed to save section.");
			if (formRef.current) {
				formRef.current.reset();
			}
		}
		closeModal();
		setEditingSection(null);
	};

	const handleDeleteSection = async () => {
		const idToDelete = deleteModal.module.moduleId;
		if (!idToDelete) return;
		try {
			await deleteSectionTrigger(idToDelete).unwrap();
			setDeleteSectionModal({ open: false, module: null });
		} catch (error) {}
	};

	//--------------------Topic CRUD--------------------
	const handleSubmitTopic = async (data) => {
		const { id, payload, courseCode, sectionId } = data;
		try {
			if (id) {
				await updateTopic({ id, payload, courseCode }).unwrap();
				notify.success(`Topic ${editingTopic.title} updated successfully!`);
			} else {
				await createTopic({ payload, courseCode, sectionId }).unwrap();
				notify.success(`Topic ${payload.topicCode} created successfully!`);
			}
		} catch (error) {
			notify.error(error?.data?.message || "Failed to save topic.");
			if (formRef.current) {
				formRef.current.reset();
			}
		}
		closeModal();
		setEditingTopic(null);
	};
	const handleDeleteTopic = async () => {
		const idToDelete = deleteModal.subject.subjectId;
		if (!idToDelete) return;
		try {
			await deleteTopicTrigger(idToDelete).unwrap();
			setDeleteTopicModal({ open: false, subject: null });
		} catch (error) {}
	};
	const handleOpenEditModal = (section, topic) => {
		if (section) openModal("Section", "EDIT", section);
		if (topic) openModal("Topic", "EDIT", topic);
	};

	if (isErrorCourseHierarchy) {
		return <ErrorFallback errorMessage={`Failed to fetch course hierarchy = ${errorCourseHierarchy.message}`} />;
	}

	const handleResetFilters = () => {
		setFilters({ batchCycleId: "", courseTypeId: "", courseCode: "", moduleId: "", subjectId: "" });
	};

	return (
		<>
			<div className='mt-2 mb-2 grid grid-cols-1 gap-4 sm:grid-cols-5 lg:grid-cols-6'>
				<CustomSelect
					label={"Course Type"}
					value={filters.courseTypeId}
					onChange={(e) => handleFilterChange("courseTypeId", e.target.value)}
					options={courseTypeOptions}
				/>
				<CustomSelect
					label={"Batch Cycle"}
					value={filters.batchCycleId}
					onChange={(e) => handleFilterChange("batchCycleId", e.target.value)}
					options={batchCycleOptions}
					disabled={!filters.courseTypeId}
				/>
				<CustomSelect
					label={"Course"}
					value={filters.courseCode}
					onChange={(e) => handleFilterChange("courseCode", e.target.value)}
					options={courseOptions}
					disabled={!filters.courseTypeId || !filters.batchCycleId}
				/>
				<CustomSelect
					label={"Module"}
					value={filters.moduleId}
					onChange={(e) => handleFilterChange("moduleId", e.target.value)}
					options={moduleOptions}
					disabled={!filters.courseTypeId || !filters.batchCycleId || !filters.courseCode}
				/>
				<CustomSelect
					label={"Subject"}
					value={filters.subjectId}
					onChange={(e) => handleFilterChange("subjectId", e.target.value)}
					options={subjectOptions}
					disabled={!filters.courseTypeId || !filters.batchCycleId || !filters.courseCode || !filters.moduleId}
				/>
				<button
					title='reset filters'
					className='flex h-11 w-11 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out active:scale-90'
					onClick={handleResetFilters}>
					<RotateCcw className='text-amber-500' size={24} />
				</button>
			</div>
			<div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
				<SectionTable
					isLoadingCourseHierarchy={isLoadingCourseHierarchy}
					selectedSections={selectedSections}
					filters={filters}
					handleOpenEditModal={handleOpenEditModal}
					deleteModal={deleteSectionModal}
					setDeleteModal={setDeleteSectionModal}
					creating={creatingSection}
					updating={updatingSection}
					deleting={deletingSection}
					setSelectedSectionId={setSelectedSectionId}
					setSelectedSectionTitle={setSelectedSectionTitle}
					editingSection={editingSection}
					setEditingSection={setEditingSection}
					handleSubmitSection={handleSubmitSection}
					handleDeleteSection={handleDeleteSection}
				/>

				<TopicTable
					isLoadingCourseHierarchy={isLoadingCourseHierarchy}
					fetchTopics={fetchTopics}
					handleOpenEditModal={handleOpenEditModal}
					creating={creatingTopic}
					updating={updatingTopic}
					deleting={deletingTopic}
					deleteModal={deleteTopicModal}
					setDeleteModal={setDeleteTopicModal}
					editingTopic={editingTopic}
					setEditingTopic={setEditingTopic}
					handleSubmitTopic={handleSubmitTopic}
					handleDeleteTopic={handleDeleteTopic}
					filters={filters}
					selectedSectionId={selectedSectionId}
					selectedSectionTitle={selectedSectionTitle}
				/>
			</div>
			{/* Section Modal Form */}
			<ModalForm
				isOpen={showModal.open && showModal.entity === "Section"}
				onClose={closeModal}
				title={showModal.mode === "EDIT" ? "Edit Section" : "Create Section"}
				description={showModal.mode === "EDIT" ? "Update the existing section details" : "Add a new section to the system"}
				isLoading={creatingSection || updatingSection}
				formRef={formRef}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<SectionForm
							ref={modalFormRef}
							section={editingSection}
							module={filters.moduleId}
							subject={filters.subjectId}
							onSubmit={handleSubmitSection}
							isLoading={creatingSection || updatingSection}
							batchCycleId={filters.batchCycleId}
							courseCode={filters.courseCode}
						/>
					);
				}}
			</ModalForm>
			{/* Topic Modal Form */}
			<ModalForm
				isOpen={showModal.open && showModal.entity === "Topic"}
				onClose={closeModal}
				title={showModal.mode === "EDIT" ? "Edit Topic" : "Create Topic"}
				description={showModal.mode === "EDIT" ? "Update the existing topic details" : "Add a new topic to the system"}
				isLoading={creatingTopic || updatingTopic}
				formRef={formRef}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<TopicForm
							ref={modalFormRef}
							topic={editingTopic}
							onSubmit={handleSubmitTopic}
							section={selectedSectionId}
							module={filters.moduleId}
							subject={filters.subjectId}
							isLoading={creatingTopic || updatingTopic}
							batchCycleId={filters.batchCycleId}
							courseCode={filters.courseCode}
						/>
					);
				}}
			</ModalForm>
		</>
	);
};

export default SectionTopicManager;
