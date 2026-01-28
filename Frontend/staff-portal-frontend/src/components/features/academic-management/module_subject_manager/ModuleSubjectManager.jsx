/* eslint-disable*/
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateModuleMutation,
	useCreateSubjectMutation,
	useDeleteModuleMutation,
	useDeleteSubjectMutation,
	useGetAllCourseTypesQuery,
	useGetBatchCycleQuery,
	useGetCourseHierarchyQuery,
	useGetCoursesQuery,
	useUpdateModuleMutation,
	useUpdateSubjectMutation,
} from "../../../../store";

import { CustomSelect, EmptyState } from "../../../layout";
import { useModal } from "../../../../providers/providerHook";
import { ShieldX } from "lucide-react";
import { selectUserRole } from "../../../../store/selectors";
import { useFilteredMenu } from "../../../../hooks";
import { ErrorFallback } from "../../../layout/errorBoundary";
import ModuleForm from "./ModuleForm";
import SubjectForm from "./SubjectForm";
import ModuleTable from "./ModuleTable";
import SubjectTable from "./SubjectTable";
import { notify } from "../../../../utils/Notify";
import { ModalForm } from "../../../layout/modals/ModalForm";

const ModuleSubjectManager = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const initialCourse = location.state?.course;
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessModuleSubjectManager = pathSet.has("/academic-management/modules-subjects") && userRole === "ADMIN";

	// filters
	const [filters, setFilters] = useState({
		courseTypeId: "",
		batchCycleId: "",
		courseCode: initialCourse?.courseCode || "",
		status: "",
	});
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	//--------------------RTK QUERY HOOKS--------------------
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

	// Course Hierarchy
	const {
		data: courseHierarchy = {
			modules: [],
			subjects: [],
		},
		isLoading: isLoadingCourseHierarchy,
		isError: isErrorCourseHierarchy,
		error: errorCourseHierarchy,
	} = useGetCourseHierarchyQuery(filters.courseCode, {
		skip: !filters.batchCycleId || !filters.courseCode,
	});
	console.log("Course Hierarchy:", courseHierarchy);
	// Modules
	const [createModule, { isSuccess: createdModule, isLoading: creatingModule, isError: isErrorCreateModule, error: errorCreateModule }] =
		useCreateModuleMutation();
	const [updateModule, { isSuccess: updatedModule, isLoading: updatingModule, isError: isErrorUpdateModule, error: errorUpdateModule }] =
		useUpdateModuleMutation();
	const [deleteModuleTrigger, { isSuccess: deletedModule, isLoading: deletingModule, isError: isErrorDeleteModule, error: errorDeleteModule }] =
		useDeleteModuleMutation();
	// Subjects
	const [createSubject, { isSuccess: createdSubject, isLoading: creatingSubject, isError: isErrorCreateSubject, error: errorCreateSubject }] =
		useCreateSubjectMutation();
	const [updateSubject, { isSuccess: updatedSubject, isLoading: updatingSubject, isError: isErrorUpdateSubject, error: errorUpdateSubject }] =
		useUpdateSubjectMutation();
	const [deleteSubjectTrigger, { isSuccess: deletedSubject, isLoading: deletingSubject, isError: isErrorDeleteSubject, error: errorDeleteSubject }] =
		useDeleteSubjectMutation();

	const formRef = useRef(null);
	const { openModal, closeModal, showModal } = useModal();
	const [editingModule, setEditingModule] = useState(null);
	const [editingSubject, setEditingSubject] = useState(null);
	const [deleteModuleModal, setDeleteModuleModal] = useState({
		open: false,
		module: null,
	});
	const [deleteSubjectModal, setDeleteSubjectModal] = useState({
		open: false,
		subject: null,
	});

	useEffect(() => {
		if (createdModule) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Module created successfully!' }));
			console.log("Notification: Module created successfully!");
		}
		if (isErrorCreateModule) {
			// show toast
			console.log(errorCreateModule);
		}
		if (updatedModule) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Module updated successfully!' }));
			console.log("Notification: Module updated successfully!");
		}
		if (isErrorUpdateModule) {
			// show toast
			console.log(errorUpdateModule);
		}
		if (deletedModule) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Module deleted successfully!' }));
			console.log("Notification: Module deleted successfully!");
		}
		if (isErrorDeleteModule) {
			// show toast
			console.log(errorDeleteModule);
		}
		if (createdSubject) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Subject created successfully!' }));
			console.log("Notification: Subject created successfully!");
		}
		if (isErrorUpdateModule) {
			// show toast
			console.log(errorUpdateModule);
		}
		if (isErrorDeleteModule) {
			// show toast
			console.log(errorDeleteModule);
		}
		if (isErrorCreateSubject) {
			// show toast
			console.log(errorCreateSubject);
		}
		if (isErrorUpdateSubject) {
			// show toast
			console.log(errorUpdateSubject);
		}
		if (isErrorDeleteSubject) {
			// show toast
			console.log(errorDeleteSubject);
		}
	}, [
		createdModule,
		updatedModule,
		deletedModule,
		createdSubject,
		updatedSubject,
		deletedSubject,
		isErrorCreateModule,
		isErrorUpdateModule,
		isErrorDeleteModule,
		isErrorCreateSubject,
		isErrorUpdateSubject,
		isErrorDeleteSubject,
		errorCreateModule,
		errorUpdateModule,
		errorDeleteModule,
		errorCreateSubject,
		errorUpdateSubject,
		errorDeleteSubject,
	]);

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Module Subject Manager",
				subtitle: "List of all module and its subjects in the institution",
				action: [
					{
						label: "import",
						entity: "Module",
						mode: "IMPORT",
					},
					{
						label: "Add Module",
						entity: "Module",
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
					title: "Modules-Subjects",
					path: "/academic-management/modules",
					icon: "book-open",
				},
			])
		);
	}, [dispatch]);

	useEffect(() => {
		if (!showModal.open) return;

		if (showModal.entity === "Module") {
			setEditingModule(showModal.mode === "EDIT" ? showModal.payload : null);
		}

		if (showModal.entity === "Subject") {
			setEditingSubject(showModal.mode === "EDIT" ? showModal.payload : null);
		}
	}, [showModal]);

	const [selectedModuleId, setSelectedModuleId] = useState(null);
	const [selectedModuleTitle, setSelectedModuleTitle] = useState("");
	const fetchSubjects = useMemo(() => {
		const allSubjects = courseHierarchy?.subjects || [];
		if (!selectedModuleId) return [];
		return allSubjects.filter((subject) => subject.moduleId === selectedModuleId);
	}, [courseHierarchy?.subjects, selectedModuleId]);

	if (!canAccessModuleSubjectManager) {
		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
	}

	//--------------------Module CRUD--------------------
	const handleSubmitModule = async (data) => {
		const { id, payload, courseCode } = data;
		try {
			if (id) {
				await updateModule({ id, payload, courseCode }).unwrap();
				notify.success(`Module ${editingModule.title} updated successfully!`);
			} else {
				await createModule({ payload, courseCode }).unwrap();
				notify.success(`Module ${payload.moduleCode} created successfully!`);
			}
		} catch (error) {
			notify.error(error?.data?.message || "Failed to save module.");
			if (formRef.current) {
				formRef.current.reset();
			}
		}
		closeModal();
		setEditingModule(null);
	};
	const handleDeleteModule = async () => {
		const idToDelete = deleteModuleModal.module.id;
		console.log("Module Id to delete:", idToDelete);
		if (!idToDelete) return;
		try {
			await deleteModuleTrigger({ courseCode: filters.courseCode, id: idToDelete }).unwrap();
			setDeleteModuleModal({ open: false, module: null });
			notify.success(`Module ${deleteModuleModal.module.title || deleteModuleModal.module.moduleName} deleted successfully!`);
		} catch (error) {}
		closeModal();
	};

	//--------------------Subject CRUD--------------------
	const handleSubmitSubject = async (data) => {
		const { id, payload, moduleId, courseCode } = data;
		console.log("Form Data:", data);
		try {
			if (id) {
				await updateSubject({ id, payload, moduleId, courseCode }).unwrap();
				notify.success(`Subject ${editingSubject.title} updated successfully!`);
			} else {
				await createSubject({ payload, moduleId, courseCode }).unwrap();
				notify.success(`Subject ${payload.subjectCode} created successfully!`);
			}
		} catch (error) {
			console.log(error);
			notify.error(error?.data?.message || "Failed to save subject.");
			if (formRef.current) {
				formRef.current.reset();
			}
		}
		closeModal();
		setEditingSubject(null);
	};
	const handleDeleteSubject = async () => {
		const idToDelete = deleteSubjectModal.subject.id;
		console.log("Subject Id to delete:", idToDelete);
		if (!idToDelete) return;
		try {
			await deleteSubjectTrigger({ courseCode: filters.courseCode, id: idToDelete }).unwrap();
			notify.success(`Subject ${deleteSubjectModal.subject.title} deleted successfully!`);
			setDeleteSubjectModal({ open: false, subject: null });
		} catch (error) {
			notify.error(error?.data?.message || "Failed to delete subject.");
		}
	};
	const handleOpenEditModule = (module) => {
		openModal("Module", "EDIT", module);
	};
	const handleOpenEditSubject = (subject) => {
		openModal("Subject", "EDIT", subject);
	};

	if (isErrorCourseHierarchy) {
		return <ErrorFallback errorMessage={`Failed to fetch course hierarchy = ${errorCourseHierarchy.message}`} />;
	}
	return (
		<>
			<div className='mt-2 mb-2 grid grid-cols-4 gap-4 sm:grid-cols-3 lg:grid-cols-4'>
				<CustomSelect
					value={filters.courseTypeId}
					label='Course Type'
					options={courseTypeOptions}
					onChange={(e) => handleFilterChange("courseTypeId", e.target.value)}
					// isLoading={isLoadingCourseTypes}
				/>
				<CustomSelect
					value={filters.batchCycleId}
					label='Batch Cycle'
					options={batchCycleOptions}
					onChange={(e) => handleFilterChange("batchCycleId", e.target.value)}
					// isLoading={isLoadingBatchCycles}
					disabled={!filters.courseTypeId}
				/>
				<CustomSelect
					value={filters.courseCode}
					label='Course'
					options={courseOptions}
					onChange={(e) => handleFilterChange("courseCode", e.target.value)}
					// isLoading={isLoadingCourses}
					disabled={!filters.courseTypeId && !filters.batchCycleId}
				/>
			</div>
			<div className='grid grid-cols-2 gap-2'>
				<ModuleTable
					isLoadingCourseHierarchy={isLoadingCourseHierarchy}
					courseHierarchy={courseHierarchy}
					handleOpenEditModal={handleOpenEditModule}
					creatingModule={creatingModule}
					updatingModule={updatingModule}
					deletingModule={deletingModule}
					setSelectedModuleId={setSelectedModuleId}
					setSelectedModuleTitle={setSelectedModuleTitle}
					editingModule={editingModule}
					setEditingModule={setEditingModule}
					filters={filters}
					handleSubmitModule={handleSubmitModule}
					deleteModal={deleteModuleModal}
					setDeleteModal={setDeleteModuleModal}
					handleDeleteModule={handleDeleteModule}
				/>

				<SubjectTable
					isLoadingCourseHierarchy={isLoadingCourseHierarchy}
					fetchSubjects={fetchSubjects}
					handleOpenEditModal={handleOpenEditSubject}
					creatingSubject={creatingSubject}
					updatingSubject={updatingSubject}
					deletingSubject={deletingSubject}
					deleteModal={deleteSubjectModal}
					setDeleteModal={setDeleteSubjectModal}
					setEditingSubject={setEditingSubject}
					editingSubject={editingSubject}
					handleSubmitSubject={handleSubmitSubject}
					handleDeleteSubject={handleDeleteSubject}
					filters={filters}
					selectedModuleId={selectedModuleId}
					selectedModuleTitle={selectedModuleTitle}
				/>
			</div>
			<ModalForm
				isOpen={showModal.open && showModal.entity === "Module"}
				onClose={closeModal}
				title={showModal.mode === "EDIT" ? "Edit Module" : "Create Module"}
				description={showModal.mode === "EDIT" ? "Updating the existing module details" : "Add a new module"}
				formRef={formRef}
				loading={creatingModule || updatingModule}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<ModuleForm
							ref={modalFormRef}
							module={editingModule}
							onSubmit={handleSubmitModule}
							isLoading={creatingModule || updatingModule}
							batchCycleId={filters.batchCycleId}
							courseCode={filters.courseCode}
						/>
					);
				}}
			</ModalForm>
			<ModalForm
				isOpen={showModal.open && showModal.entity === "Subject"}
				onClose={closeModal}
				title={showModal.mode === "EDIT" ? "Edit Subject" : "Create Subject"}
				description={showModal.mode === "EDIT" ? "Updating the existing subject details" : "Add a new subject for the module"}
				formRef={formRef}
				loading={creatingSubject || updatingSubject}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<SubjectForm
							ref={modalFormRef}
							subject={editingSubject}
							batchCycleId={filters.batchCycleId}
							courseCode={filters.courseCode}
							moduleId={selectedModuleId}
							onSubmit={handleSubmitSubject}
						/>
					);
				}}
			</ModalForm>
		</>
	);
};

export default ModuleSubjectManager;
