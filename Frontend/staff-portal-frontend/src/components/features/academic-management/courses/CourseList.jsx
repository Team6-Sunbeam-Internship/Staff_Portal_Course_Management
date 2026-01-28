/* eslint-disable */
import { Edit, List, RotateCcw, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useDebounce, useFilteredMenu } from "../../../../hooks";
import { useModal } from "../../../../providers/providerHook";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateCourseMutation,
	useDeleteCourseMutation,
	useGetAllCourseTypesQuery,
	useGetBatchCycleQuery,
	useGetPaginatedCoursesQuery,
	useGetPremisesQuery,
	useGetPreservedCommandsQuery,
	useUpdateCourseMutation,
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
	Input,
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
import ResumeModal from "../../../layout/modals/ResumeModal";
import { CourseForm } from "./CourseForm";

const PAGE_SIZE = 72;
const PREFETCH_OFFSET = 6;

const CourseList = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessCourseList = pathSet.has("/academic-management/courses") && userRole === "ADMIN";

	// State for filters and pagination
	const initialCourseType = location.state?.courseType;
	const [page, setPage] = useState(0);
	const [filters, setFilters] = useState({
		batchCycleId: "",
		courseTypeId: initialCourseType?.id || "",
		premiseId: "",
		status: "",
		searchTerm: "",
	});
	const resumePending = sessionStorage.getItem("resumePending") === "true";
	const { data: preservedCommands = [] } = useGetPreservedCommandsQuery(undefined, { skip: !resumePending });

	//----------RTK QUERY HOOKS----------
	// pre requisites
	const { data: batchCycles, isLoading: isLoadingBatchCycles } = useGetBatchCycleQuery();
	const { data: premises, isLoading: isLoadingPremises } = useGetPremisesQuery();
	const { data: courseTypes, isLoading: isLoadingCourseTypes } = useGetAllCourseTypesQuery();

	const isLoadingPreReqs = isLoadingBatchCycles && isLoadingPremises && isLoadingCourseTypes;
	const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

	const queryParams = {
		search: debouncedSearchTerm,
		courseTypeId: filters.courseTypeId,
		batchCycleId: filters.batchCycleId,
		premiseId: filters.premiseId,
		size: PAGE_SIZE,
		page,
	};
	const {
		data: paginatedCourses, // -> courseCode, courseName, courseTypeId, courseTypeName, premiseId, premiseName, batchCycleId, batchCycleName, studentCount, courseGroupCount, status
		isFetching,
		isLoading,
		isError,
		error,
	} = useGetPaginatedCoursesQuery(queryParams, {
		skip: !canAccessCourseList || isLoadingPreReqs,
		refetchOnMountOrArgChange: true,
	});
	console.log("paginatedCourses: ", paginatedCourses);

	const [createCourse, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] = useCreateCourseMutation();
	const [updateCourse, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] = useUpdateCourseMutation();
	const [deleteCourseTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
		useDeleteCourseMutation();

	const courses = paginatedCourses?.content || [];
	const hasMore = paginatedCourses ? courses.length < paginatedCourses.totalElements : true;
	console.log("Filters: ", filters);
	const tableData = useMemo(() => {
		if (!courses?.length) return [];
		return courses.filter((course) => {
			if (filters.status && course.courseStatus !== filters.status) return false;
			if (filters.batchCycleId && course.batchCycleId !== filters.batchCycleId) return false;
			if (filters.courseTypeId && course.courseTypeId !== filters.courseTypeId) return false;
			if (filters.premiseId && course.premiseId !== filters.premiseId) return false;

			return true;
		});
	}, [courses, filters]);

	console.log("tableData: ", tableData);
	const formRef = useRef(null);
	const { showModal, closeModal, openModal } = useModal();
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		course: null,
	});
	const [resumeModal, setResumeModal] = useState({
		open: false,
		resumeData: null,
	});
	useEffect(() => {
		if (!resumePending) return;
		if (!preservedCommands || preservedCommands.length === 0) return;

		setResumeModal({
			open: true,
			resumeData: preservedCommands,
		});

		// clean up flag AFTER consuming
		sessionStorage.removeItem("resumePending");
	}, [resumePending, preservedCommands]);

	const handleResumeConfirm = (command) => {
		// Navigate back to CourseTypeList (already here)
		// Open modal + hydrate form

		if (command.commandName === "CREATE_COURSE") {
			openModal();
		}

		if (command.commandName === "UPDATE_COURSE") {
			openModal();
		}

		setResumeModal({ open: false, resumeData: null });
	};

	const handleResumeDiscard = () => {
		setResumeModal({ open: false, resumeData: null });
	};
	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Courses List",
				subtitle: "View and manage all academic courses in the system",
				action: [{ label: "Add Course", entity: "Course", mode: "CREATE" }],
			})
		);
		const selectedCourseType = courseTypes.find((courseType) => courseType.id === filters.courseTypeId);

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
					title: selectedCourseType ? `${selectedCourseType.title} Courses` : "Courses",
					path: "/academic-management/courses",
					icon: "book-open",
				},
			])
		);
	}, [dispatch, courseTypes, filters.courseTypeId]);

	// --- Initial Load and Filter/Search Change Handler ---
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
		setPage(0);
	};

	// const observer = useRef();
	const lastCourseElementRef = useRef(null);

	// --- Infinite Scroll Intersection Observer Setup ---
	const observerCallback = useCallback(
		(entries) => {
			const target = entries[0];
			// Trigger fetch if the last element is visible AND we are not currently loading AND there might be more data
			if (target.isIntersecting && !isFetching && hasMore) {
				// Automatically fetch the next page when the last element comes into view
				setPage((prevPage) => prevPage + 1);
			}
		},
		[isFetching, hasMore]
	);

	useEffect(() => {
		if (isLoading || isFetching) return;

		const observer = new IntersectionObserver(observerCallback, {
			threshold: 1.0,
			root: null,
			rootMargin: "0px 0px -200px 0px",
		});

		if (lastCourseElementRef.current) {
			observer.observe(lastCourseElementRef.current);
		}

		return () => {
			if (lastCourseElementRef.current) {
				observer.unobserve(lastCourseElementRef.current);
			}
			// Disconnect observer instance on cleanup
			// observer.disconnect();
		};
	}, [observerCallback, courses.length]);

	useEffect(() => {
		// --- Create Notifications ---
		if (created) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'course created successfully!' }));
			console.log("Notification: Course created successfully!");
		}
		if (createError) {
			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to create course.' }));
			console.error("Failed to create Course:", createErrorDetails);
		}

		// --- Update Notifications ---
		if (updated) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'course updated successfully!' }));
			console.log("Notification: Courseupdated successfully!");
		}
		if (updateError) {
			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to update course.' }));
			console.error("Failed to update Course:", updateErrorDetails);
		}

		// --- Delete Notifications ---
		if (deleted) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'course deleted successfully!' }));
			console.log("Notification: Course deleted successfully!");
		}
		if (deleteError) {
			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to delete course. Reverted changes.' }));
			console.error("Failed to delete Course:", deleteErrorDetails);
		}

		// We only listen to the success/error flags, not the data or trigger functions
	}, [created, createError, updated, updateError, deleted, deleteError, createErrorDetails, updateErrorDetails, deleteErrorDetails]);

	// --- CRUD Handlers ---
	const handleSubmit = async ({ id, payload }) => {
		console.log("Form Data:", payload);
		try {
			if (id) {
				await updateCourse({ id, payload, currentFilters: filters }).unwrap();
				notify.success(`Course ${showModal.payload.title} updated successfully!`);
			} else {
				await createCourse({ payload, currentFilters: filters }).unwrap();
				notify.success(`Course ${payload.title} created successfully!`);
			}
		} catch (error) {
			notify.error(error?.data?.message || "Failed to save course.");
			if (formRef.current) {
				formRef.current.reset();
			}
		}
		closeModal();
	};

	const handleDeleteCourse = useCallback(async () => {
		const idToDelete = deleteModal.course?.id;
		if (!idToDelete) return;
		try {
			await deleteCourseTrigger({ id: idToDelete, currentFilters: filters }).unwrap();
			notify.success(`Course ${deleteModal.course.title} deleted successfully!`);
			setDeleteModal({ open: false, course: null });
		} catch (error) {}
	}, [deleteModal.course?.id, deleteCourseTrigger]);

	const handleOpenEditModal = (course) => {
		openModal("Course", "UPDATE", course);
	};

	//----TABLE CONFIGURATION-----
	// Options for Custom Dropdowns
	const batchCycleOptions = [{ value: "", label: "Select Batch Cycle" }, ...batchCycles?.map((c) => ({ value: c.id, label: c.title }))];
	const courseTypeOptions = [{ value: "", label: "Select Course Type" }, ...courseTypes?.map((c) => ({ value: c.id, label: c.title }))];
	const premiseOptions = [{ value: "", label: "Select Premise" }, ...premises?.map((c) => ({ value: c.id, label: c.title }))];
	const statusOptions = [
		{ value: "", label: "Select Status" },
		{ value: "ACTIVE", label: "Active" },
		{ value: "INACTIVE", label: "Inactive" },
		{ value: "planned", label: "Planned" },
		{ value: "completed", label: "Completed" },
	];

	if (isError) {
		return <ErrorFallback errorMessage={`Failed to fetch courses: ${error}`} />;
	}

	const handleCourseClick = (course) => {
		navigate("/academic-management/modules-subjects", { state: { course } });
	};
	const handleResetFilters = () => {
		setFilters({ batchCycleId: "", premiseId: "", courseTypeId: "", status: "" });
	};
	return (
		<>
			<div className='mt-2 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6'>
				{/* Batch Cycle Filter */}
				<CustomSelect
					label='Batch Cycle'
					value={filters.batchCycleId}
					onChange={(e) => handleFilterChange("batchCycleId", e.target.value)}
					options={batchCycleOptions}
				/>
				<CustomSelect
					label='Premise'
					value={filters.premiseId}
					onChange={(e) => handleFilterChange("premiseId", e.target.value)}
					options={premiseOptions}
				/>

				{/* Course Type Filter */}
				<CustomSelect
					label='Course Type'
					value={filters.courseTypeId}
					onChange={(e) => handleFilterChange("courseTypeId", e.target.value)}
					options={courseTypeOptions}
					placeholder={initialCourseType ? `Filtered by ${initialCourseType.title}` : "All Course Types"}
				/>

				{/* Status Filter */}
				<CustomSelect label='Status' value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} options={statusOptions} />

				{/* Search Input */}
				<Input
					placeholder=''
					icon={Search}
					label={"Search"}
					value={filters.searchTerm}
					onChange={(value) => handleFilterChange("searchTerm", value)}
				/>
				<button
					title='reset filters'
					className='flex h-11 w-11 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out active:scale-90'
					onClick={handleResetFilters}>
					<RotateCcw className='text-amber-500' size={24} />
				</button>
			</div>
			<Card className={"h-[528px]"}>
				<CardBody>
					{isLoading || isLoadingPreReqs ?
						<SkeletonTable />
					: tableData?.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title='No Course Found'
							description='Try adjusting your filters or search terms or Add a new course.'
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-[80px] rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-1/6'>Title</TableHeader>
										<TableHeader className='w-1/6'>Batch Cycle</TableHeader>
										<TableHeader className='w-1/6'>Location</TableHeader>
										<TableHeader className='w-1/6'>Course Type</TableHeader>
										<TableHeader className='w-1/10'>Students</TableHeader>
										<TableHeader className='w-1/10'>Groups</TableHeader>
										<TableHeader className='w-[120px] rounded-tr-2xl text-center'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[450px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{tableData?.map((course, index) => {
											// Trigger the fetch 6 items before the last item of the full page.
											const isPrefetchTrigger = index === courses.length - PREFETCH_OFFSET - 1;
											return (
												<TableRow key={course.id} ref={hasMore && isPrefetchTrigger ? lastCourseElementRef : null}>
													<TableCell className='w-[80px]'>{index + 1}</TableCell>
													<TableCell
														className='w-1/6 cursor-pointer text-center transition-all duration-200 hover:scale-105'
														handleClick={() => handleCourseClick(course)}>
														{course.title}
													</TableCell>
													<TableCell className='w-1/6 text-center'>{course.batchCycleName || course.batchCycleId || "N/A"}</TableCell>
													<TableCell className='w-1/6'>{course.premiseName || course.premiseId || "N/A"}</TableCell>
													<TableCell className='w-1/6'>{course.courseTypeName || course.courseTypeId || "N/A"}</TableCell>
													<TableCell className='w-1/10'>{course.studentCount || "#"}</TableCell>
													<TableCell className='w-1/10'>{course.courseGroupCount || course.groupCount}</TableCell>
													<TableCell className='w-[120px]'>
														<div className='flex items-center justify-center space-x-2'>
															<Button
																variant='gradientAmber'
																icon={Edit}
																className='h-8 w-8 rounded-lg'
																size='sm'
																onClick={() => handleOpenEditModal(course)}
																aria-label='Edit course'
																disabled={creating || deleting}></Button>
															<Button
																variant='gradientRose'
																icon={Trash2}
																size='sm'
																className='h-8 w-8 rounded-lg'
																onClick={() =>
																	setDeleteModal({
																		open: true,
																		course,
																	})
																}
																disabled={creating || updating}></Button>
														</div>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						</>
					}
				</CardBody>
			</Card>

			{/* Modal for Create/Edit */}
			<ModalForm
				isOpen={showModal.open && showModal.entity === "Course"}
				onClose={closeModal}
				title={showModal.payload ? "Edit Course" : "Create Course"}
				description={showModal.payload ? "Updating Course Details" : "Add a new course in the institution"}
				formRef={formRef}
				loading={creating || updating}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<CourseForm
							ref={modalFormRef}
							course={showModal.payload}
							batchCycles={batchCycles}
							courseTypes={courseTypes}
							premises={premises}
							onSubmit={handleSubmit}
							isLoading={creating || updating}
						/>
					);
				}}
			</ModalForm>
			<ResumeModal isOpen={resumeModal.open} commands={resumeModal.resumeData} onResume={handleResumeConfirm} onDiscard={handleResumeDiscard} />

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, course: null })}
				onConfirm={() => handleDeleteCourse()}
				title='Delete Course'
				message={`Are you sure you want to delete "${deleteModal.course?.title}" course? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};
export default CourseList;
