/* eslint-disable*/
import { useEffect, useMemo, useState } from "react";
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

import {
	Button,
	Card,
	CardBody,
	ConfirmDialog,
	CustomSelect,
	EmptyState,
	Modal,
	ModalBody,
	ModalHeader,
	SkeletonTable,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../layout";
import { useModal } from "../../../../providers/providerHook";
import { Edit, List, Trash2 } from "lucide-react";
import { selectUserRole } from "../../../../store/selectors";
import { useFilteredMenu } from "../../../../hooks";
import { ErrorFallback } from "../../../layout/errorBoundary";
import ModuleForm from "./ModuleForm";
import SubjectForm from "./SubjectForm";

const ModuleSubjectManager = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	const initialCourse = location.state?.course;
	const userRole = useSelector(selectUserRole);
	const { filteredMenu = [] } = useFilteredMenu();
	const canAccessModuleSubjectManager = filteredMenu.includes("/academic-management/module-subject-manager") && userRole === "ADMIN";

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
		if (result.data) {
			// Map the API data
			const mappedOptions = result.data.map((batchCycle) => ({
				label: batchCycle.title,
				value: batchCycle.id,
			}));

			// Prepend the default option to the mapped array
			return [DEFAULT_BATCH_CYCLE_OPTION, ...mappedOptions];
		}

		// If no data is returned (e.g., initial load), still return the default option
		return [DEFAULT_BATCH_CYCLE_OPTION];
	};
	const batchCycleOptions = useGetBatchCycleQuery(undefined, {
		selectFromResult: ({ data }) => selectBatchCycleOptions({ data }),
	});

	const { data: courseTypes, isLoading: isLoadingCourseTypes } = useGetAllCourseTypesQuery();
	const courseTypeOptions = useMemo(() => {
		// Return default if data is not available
		if (!courseTypes || courseTypes.length === 0) {
			return [{ value: "", label: "Select the Course Type" }];
		}

		const mappedTypes = courseTypes.map((courseType) => ({
			label: courseType.title,
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
				value: course.id,
			})),
		];
	}, [courseListForSelection]);

	// Course Hierarchy
	const {
		data: courseHierarchy,
		isLoading: isLoadingCourseHierarchy,
		isError: isErrorCourseHierarchy,
		error: errorCourseHierarchy,
	} = useGetCourseHierarchyQuery(filters.courseCode, {
		skip: !filters.batchCycleId || !filters.courseCode,
	});
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
	const [
		deleteSubjectTrigger,
		{ isSuccess: deletedSubject, isLoading: deletingSubject, isError: isErrorDeleteSubject, error: errorDeleteSubject },
	] = useDeleteSubjectMutation();

	const { showModal, setShowModal } = useModal();
	const [editingModule, setEditingModule] = useState(null);
	const [editingSubject, setEditingSubject] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		Premise: null,
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

	const [selectedModuleId, setSelectedModuleId] = useState(null);
	const fetchSubjects = useMemo(() => {
		const allSubjects = courseHierarchy?.subjects || [];
		if (!selectedModuleId) return [];
		return allSubjects.filter((subject) => subject.moduleId === selectedModuleId);
	}, [courseHierarchy?.subjects, selectedModuleId]);

	if (!canAccessModuleSubjectManager) {
		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
	}

	const statusOptions = [
		{ value: "", label: "All Statuses" },
		{ value: "active", label: "Active" },
		{ value: "inactive", label: "Inactive" },
		{ value: "planned", label: "Planned" },
		{ value: "completed", label: "Completed" },
	];

	//--------------------Module CRUD--------------------
	const handleCreateModule = async (formData) => {
		try {
			await createModule({
				courseCode: formData.courseCode,
				newModule: {
					moduleCode: formData.moduleCode,
					moduleName: formData.moduleName,
					theoryHours: formData.theoryHours,
					practicalHours: formData.practicalHours,
				},
			}).unwrap();
			setShowModal(false);
			setEditingModule(null);
		} catch (error) {
			return;
		}
	};
	const handleUpdateModule = async (updatedModule) => {
		try {
			await updateModule({
				courseCode: updateModule.courseCode,
				moduleId: updatedModule.id,
				updateModule: {
					moduleCode: updatedModule.moduleCode,
					moduleName: updatedModule.moduleName,
					theoryHours: updatedModule.theoryHours,
					practicalHours: updatedModule.practicalHours,
				},
			}).unwrap();
			setShowModal(false);
			setEditingModule(null);
		} catch (error) {}
	};
	const handleDeleteModule = async () => {
		const idToDelete = deleteModal.module.id;
		if (!idToDelete) return;
		try {
			await deleteModuleTrigger({ courseCode: filters.courseCode, moduleId: idToDelete }).unwrap();
			setDeleteModal({ open: false, module: null });
		} catch (error) {}
	};

	//--------------------Subject CRUD--------------------
	const handleCreateSubject = async (formData) => {
		try {
			await createSubject(formData).unwrap();
			setShowModal(false);
			setEditingSubject(null);
		} catch (error) {
			return;
		}
	};
	const handleUpdateSubject = async (updatedSubject) => {
		try {
			await updateSubject({ id: updatedSubject.id, ...updatedSubject }).unwrap();
			setShowModal(false);
			setEditingSubject(null);
		} catch (error) {}
	};
	const handleDeleteSubject = async () => {
		const idToDelete = deleteModal.subject.subjectId;
		if (!idToDelete) return;
		try {
			await deleteSubjectTrigger({ courseCode: filters.courseCode, moduleId: idToDelete }).unwrap();
			setDeleteModal({ open: false, subject: null });
		} catch (error) {}
	};
	const handleOpenEditModal = (module, subject) => {
		module && setEditingModule(module);
		subject && setEditingSubject(subject);
		setShowModal(true);
	};

	if (isErrorCourseHierarchy) {
		return <ErrorFallback errorMessage={`Failed to fetch course hierarchy = ${errorCourseHierarchy.message}`} />;
	}
	return (
		<>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
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
				<CustomSelect value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} options={statusOptions} />
			</div>
			<div className='grid grid-cols-2 gap-4'>
				<Card className='h-[520px]'>
					<CardBody>
						{isLoadingCourseHierarchy ? (
							<SkeletonTable />
						) : courseHierarchy.length === 0 ? (
							<EmptyState
								icon={<List className='w-12 h-12' />}
								title={`No Modules found`}
								description='Please select the batch cycle and course to view the modules.'
							/>
						) : (
							<>
								<Table>
									<TableHead>
										<TableRow>
											<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
											<TableHeader className='w-1/3'>Title</TableHeader>
											<TableHeader className='w-1/8'>Theory Hours</TableHeader>
											<TableHeader className='w-1/8'>Practical Hours</TableHeader>
											<TableHeader className='text-center w-[120px]'>Actions</TableHeader>
											<TableHeader className='text-center rounded-tr-lg w-[150px]'>View Subject(s)</TableHeader>
										</TableRow>
									</TableHead>
								</Table>
								<div className='rounded-b-2xl overflow-y-auto scrollbar-none'>
									<Table>
										<TableBody>
											{courseHierarchy.modules.map((module, index) => (
												<TableRow key={module.id}>
													<TableCell className='w-1/12 rounded-tl-2xl'>{index + 1}</TableCell>
													<TableCell className='w-1/3'>{module.title}</TableCell>
													<TableCell className='w-1/8'>{module.theoryHours}</TableCell>
													<TableCell className='w-1/8'>{module.practicalHours}</TableCell>
													<TableCell className='w-[120px]'>
														<div className='flex items-center justify-center space-x-2'>
															<Button
																variant='ghost'
																className='cursor-pointer dark:hover:text-yellow-400'
																size='sm'
																onClick={() => handleOpenEditModal(module)}
																disabled={creatingModule || deletingModule}>
																<Edit size={16} />
															</Button>
															<Button
																variant='ghost'
																size='sm'
																className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
																onClick={() =>
																	setDeleteModal({
																		open: true,
																		module,
																	})
																}
																disabled={creatingModule || updatingModule}>
																<Trash2 size={16} />
															</Button>
														</div>
													</TableCell>
													<TableCell className='w-[150px]' handleModuleClick={() => setSelectedModuleId(module.id)}>
														[View Subject(s)]
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
				<Modal
					isOpen={showModal}
					onClose={() => {
						setShowModal(false);
						setEditingModule(null);
					}}
					size='lg'>
					<ModalHeader
						title={editingModule ? "Edit Module" : "Create New Module"}
						subtitle={editingModule ? "Update Module details." : "Add a new module to the course."}
						onClose={() => {
							setShowModal(false);
							setEditingModule(null);
						}}
					/>
					<ModalBody>
						<ModuleForm
							module={editingModule}
							batchCycleId={filters.batchCycleId}
							courseCode={filters.courseCode}
							onSubmit={editingModule ? handleUpdateModule : handleCreateModule}
							onCancel={() => {
								setShowModal(false);
								setEditingModule(null);
							}}
							isLoading={creatingModule || updatingModule}
						/>
					</ModalBody>
				</Modal>

				{/* Confirmation Dialog */}
				<ConfirmDialog
					isOpen={deleteModal.open}
					onClose={() => setDeleteModal({ open: false, module: null })}
					onConfirm={() => handleDeleteModule()}
					title='Delete Module'
					message={`Are you sure you want to delete "${deleteModal.module?.title}"? This action cannot be undone.`}
					confirmText='Delete'
					type='danger'
				/>

				<Card className='h-[520px]'>
					<CardBody>
						{isLoadingCourseHierarchy ? (
							<SkeletonTable />
						) : fetchSubjects.length === 0 ? (
							<EmptyState
								icon={<List className='w-12 h-12' />}
								title={`No Subjects found`}
								description='There are no subject in the system. Get started by adding a new one or importing from a file or select the module.'
							/>
						) : (
							<>
								<Table>
									<TableHead>
										<TableRow>
											<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
											<TableHeader className='w-1/2'>Title</TableHeader>
											<TableHeader className='w-1/8'>Theory Hours</TableHeader>
											<TableHeader className='w-1/8'>Practical Hours</TableHeader>
											<TableHeader className='text-center rounded-tr-lg w-[120px]'>Actions</TableHeader>
										</TableRow>
									</TableHead>
								</Table>
								<div className='rounded-b-2xl overflow-y-auto scrollbar-none'>
									<Table>
										<TableBody>
											{fetchSubjects.map((subject, index) => (
												<TableRow key={subject.id}>
													<TableCell className='w-1/12 rounded-tl-2xl'>{index + 1}</TableCell>
													<TableCell className='w-1/2'>{subject.title}</TableCell>
													<TableCell className='w-1/8'>{subject.theoryHours}</TableCell>
													<TableCell className='w-1/8'>{subject.practicalHours}</TableCell>
													<TableCell className='w-[120px]'>
														<div className='flex items-center justify-center space-x-2'>
															<Button
																variant='ghost'
																className='cursor-pointer dark:hover:text-yellow-400'
																size='sm'
																onClick={() => handleOpenEditModal(subject)}
																disabled={creatingSubject || deletingSubject}>
																<Edit size={16} />
															</Button>
															<Button
																variant='ghost'
																size='sm'
																className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
																onClick={() =>
																	setDeleteModal({
																		open: true,
																		subject,
																	})
																}
																disabled={creatingSubject || updatingSubject}>
																<Trash2 size={16} />
															</Button>
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
				<Modal
					isOpen={showModal}
					onClose={() => {
						setShowModal(false);
						setEditingSubject(null);
					}}
					size='lg'>
					<ModalHeader
						title={editingSubject ? "Edit Subject" : "Create New Subject"}
						subtitle={editingSubject ? "Update subject details." : "Add a new subject to the module."}
						onClose={() => {
							setShowModal(false);
							setEditingSubject(null);
						}}
					/>
					<ModalBody>
						<SubjectForm
							subject={editingSubject}
							batchCycleId={filters.batchCycleId}
							courseCode={filters.courseCode}
							moduleId={selectedModuleId}
							onSubmit={editingSubject ? handleUpdateSubject : handleCreateSubject}
							onCancel={() => {
								setShowModal(false);
								setEditingSubject(null);
							}}
							isLoading={creatingSubject || updatingSubject}
						/>
					</ModalBody>
				</Modal>

				{/* Confirmation Dialog */}
				<ConfirmDialog
					isOpen={deleteModal.open}
					onClose={() => setDeleteModal({ open: false, Subject: null })}
					onConfirm={() => handleDeleteSubject()}
					title='Delete Subject'
					message={`Are you sure you want to delete "${deleteModal.subject?.title}"? This action cannot be undone.`}
					confirmText='Delete'
					type='danger'
				/>
			</div>
		</>
	);
};

export default ModuleSubjectManager;
