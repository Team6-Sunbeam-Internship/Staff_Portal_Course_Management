/* eslint-disable*/
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateSectionMutation,
	useCreateTopicMutation,
	useDeleteSectionMutation,
	useDeleteTopicMutation,
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

const SectionTopicManager = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const initialCourse = location.state?.course;
	const userRole = useSelector(selectUserRole);
	const { filteredMenu = [] } = useFilteredMenu();
	const canAccessModuleSubjectManager = filteredMenu.includes("/academic-management/section-topic-manager") && userRole === "ADMIN";

	// filters
	const [filters, setFilters] = useState({
		batchCycleId: "",
		courseCode: initialCourse?.courseCode || "",
		moduleCode: "",
		subjectCode: "",
	});
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const selectBatchCycleOptions = (result) => {
		if (result.data) {
			return result.data.map((batchCycle) => ({
				label: batchCycle.name,
				value: batchCycle.id,
			}));
		}
		return [];
	};
	const batchCycleOptions = useGetBatchCycleQuery(undefined, {
		selectFromResult: ({ data }) => selectBatchCycleOptions({ data }),
	});
	const { data: courses, isLoading: isLoadingCourses } = useGetCoursesQuery();
	const courseOptions = useMemo(() => {
		if (!filters.batchCycleId || courses.length === 0) return [];
		// courses is the nested object return from the backend
		// format: [{batchCycle: {courseCode, courseName}}]
		// return [{lable:"", value:"Select the Course"}, {label: courseCode, value: courseName}]
		const courseOptions = [{ value: "", label: "Select the Course" }];
		return courseOptions.push(
			Object.values(courses[filters.batchCycleId]).map((course) => ({ label: course.courseCode, value: course.courseName }))
		);
	}, [courses, filters.batchCycleId]);

	//--------------------RTK QUERY HOOKS--------------------
	//--------------------Course Hierarchy--------------------
	const {
		data: courseHierarchy,
		isLoading: isLoadingCourseHierarchy,
		isError: isErrorCourseHierarchy,
		error: errorCourseHierarchy,
	} = useGetCourseHierarchyQuery(
		{
			courseCode: filters.courseCode,
		},
		{
			skip: !filters.batchCycleId || !filters.courseCode,
		}
	);
	const moduleOptions = useMemo(() => {
		if (!filters.batchCycleId && !filters.courseCode) return [];
		const moduleOptions = [{ value: "", label: "Select the Module" }];
		return moduleOptions.push(Object.values(courseHierarchy.modules).map((module) => ({ label: module.moduleCode, value: module.moduleName })));
	});
	const subjectOptions = useMemo(() => {
		if (!filters.batchCycleId && !filters.courseCode && !filters.moduleCode) return [];
		const subjectOptions = [{ value: "", label: "Select the Subject" }];
		return subjectOptions.push(
			Object.values(courseHierarchy.subjects).map((subject) => ({ label: subject.subjectCode, value: subject.subjectName }))
		);
	});
	//--------------------Sections Api--------------------
	const [createSection, { isSuccess: createdSection, isLoading: creatingSection, isError: isErrorCreateSection, error: errorCreateSection }] =
		useCreateSectionMutation();
	const [updateSection, { isSuccess: updatedSection, isLoading: updatingSection, isError: isErrorUpdateSection, error: errorUpdateSection }] =
		useUpdateSectionMutation();
	const [
		deleteSectionTrigger,
		{ isSuccess: deletedSection, isLoading: deletingSection, isError: isErrorDeleteSection, error: errorDeleteSection },
	] = useDeleteSectionMutation();
	//--------------------Topics Api--------------------
	const [createTopic, { isSuccess: createdTopic, isLoading: creatingTopic, isError: isErrorCreateTopic, error: errorCreateTopic }] =
		useCreateTopicMutation();
	const [updateTopic, { isSuccess: updatedTopic, isLoading: updatingTopic, isError: isErrorUpdateTopic, error: errorUpdateTopic }] =
		useUpdateTopicMutation();
	const [deleteTopicTrigger, { isSuccess: deletedTopic, isLoading: deletingTopic, isError: isErrorDeleteTopic, error: errorDeleteTopic }] =
		useDeleteTopicMutation();

	const { showModal, setShowModal } = useModal();
	const [editingSection, setEditingSection] = useState(null);
	const [editingTopic, setEditingTopic] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		Premise: null,
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
				title: "Module Subject Manager",
				subtitle: "List of all module and its subjects in the institution",
				action: [
					{
						label: "import",
					},
					{
						label: "Add Module",
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
					title: "Modules-Subjects",
					path: "/academic-management/modules",
					icon: "book-open",
				},
			])
		);
	}, [dispatch]);

	const [selectedSectionId, setSelectedSectionId] = useState(null);
	const fetchTopics = useMemo(() => {
		const allTopics = courseHierarchy?.topics || [];
		if (!selectedSectionId) return [];
		return allTopics.filter((topic) => topic.sectionId === selectedSectionId);
	}, [courseHierarchy?.topics, selectedSectionId]);

	if (!canAccessModuleSubjectManager) {
		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
	}

	//--------------------Section CRUD--------------------
	const handleCreateSection = async (formData) => {
		try {
			await createSection(formData).unwrap();
			setShowModal(false);
			setEditingSection(null);
		} catch (error) {
			return;
		}
	};
	const handleUpdateSection = async (updatedSection) => {
		try {
			await updateSection({ id: updatedSection.id, ...updatedSection }).unwrap();
			setShowModal(false);
			setEditingSection(null);
		} catch (error) {}
	};
	const handleDeleteSection = async () => {
		const idToDelete = deleteModal.module.moduleId;
		if (!idToDelete) return;
		try {
			await deleteSectionTrigger(idToDelete).unwrap();
			setDeleteModal({ open: false, module: null });
		} catch (error) {}
	};

	//--------------------Topic CRUD--------------------
	const handleCreateTopic = async (formData) => {
		try {
			await createTopic(formData).unwrap();
			setShowModal(false);
			setEditingTopic(null);
		} catch (error) {
			return;
		}
	};
	const handleUpdateTopic = async (updatedTopic) => {
		try {
			await updateTopic({ id: updatedTopic.id, ...updatedTopic }).unwrap();
			setShowModal(false);
			setEditingTopic(null);
		} catch (error) {}
	};
	const handleDeleteTopic = async () => {
		const idToDelete = deleteModal.subject.subjectId;
		if (!idToDelete) return;
		try {
			await deleteTopicTrigger(idToDelete).unwrap();
			setDeleteModal({ open: false, subject: null });
		} catch (error) {}
	};
	const handleOpenEditModal = (module, subject) => {
		module && setEditingSection(module);
		subject && setEditingTopic(subject);
		setShowModal(true);
	};

	if (isErrorCourseHierarchy) {
		return <ErrorFallback errorMessage={`Failed to fetch course hierarchy = ${errorCourseHierarchy.message}`} />;
	}

	return (
		<>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
				<CustomSelect
					value={filters.batchCycleId}
					onChange={(e) => handleFilterChange("batchCycleId", e.target.value)}
					options={batchCycleOptions}
				/>
				<CustomSelect value={filters.courseCode} onChange={(e) => handleFilterChange("courseCode", e.target.value)} options={courseOptions} />
				<CustomSelect value={filters.moduleCode} onChange={(e) => handleFilterChange("moduleCode", e.target.value)} options={moduleOptions} />
				<CustomSelect
					value={filters.subjectCode}
					onChange={(e) => handleFilterChange("subjectCode", e.target.value)}
					options={subjectOptions}
				/>
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<SectionTable
					isLoadingCourseHierarchy={isLoadingCourseHierarchy}
					courseHierarchy={courseHierarchy}
					filters={filters}
					handleOpenEditModal={handleOpenEditModal}
					deleteModal={deleteModal}
					setDeleteModal={setDeleteModal}
					creating={creatingSection}
					updating={updatingSection}
					deleting={deletingSection}
					setSelectedSectionId={setSelectedSectionId}
					editingSection={editingSection}
					setEditingSection={setEditingSection}
					handleCreateSection={handleCreateSection}
					handleUpdateSection={handleUpdateSection}
					handleDeleteSection={handleDeleteSection}
				/>

				<TopicTable
					isLoadingCourseHierarchy={isLoadingCourseHierarchy}
					filters={filters}
					fetchTopics={fetchTopics}
					handleOpenEditModal={handleOpenEditModal}
					deleteModal={deleteModal}
					setDeleteModal={setDeleteModal}
					creating={creatingTopic}
					updating={updatingTopic}
					deleting={deletingTopic}
					editingTopic={editingTopic}
					setEditingTopic={setEditingTopic}
					handleCreateTopic={handleCreateTopic}
					handleUpdateTopic={handleUpdateTopic}
					handleDeleteTopic={handleDeleteTopic}
				/>
			</div>
		</>
	);
};

export default SectionTopicManager;
