/* eslint-disable */
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2, Edit, List, User, Users, ListRestartIcon } from "lucide-react";
import {
	Card,
	CardBody,
	Table,
	TableHead,
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
	TableHeader,
} from "../../../layout";
import { CustomSelect, SearchInput } from "../../../layout";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateCourseMutation,
	useDeleteCourseMutation,
	useGetAllCourseTypesQuery,
	useGetBatchCycleQuery,
	useGetPaginatedCoursesQuery,
	useGetPremisesQuery,
	useUpdateCourseMutation,
} from "../../../../store";
import { useModal } from "../../../../providers/providerHook";
import { useDebounce, useFilteredMenu } from "../../../../hooks";
import { CourseForm } from "./CourseForm";
import { ErrorFallback } from "../../../layout/errorBoundary";
import { selectUserRole } from "../../../../store/selectors";

const PAGE_SIZE = 72;
const PREFETCH_OFFSET = 6;

const CourseList = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userRole = useSelector(selectUserRole);
	const { filteredMenu = [] } = useFilteredMenu();
	const canAccessCourseList = filteredMenu.includes("/academic-management/courses") && userRole === "ADMIN";

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

	//----------RTK QUERY HOOKS----------
	// pre requisites
	const { data: batchCycles, isLoading: isLoadingBatchCycles } = useGetBatchCycleQuery();
	const { data: premises, isLoading: isLoadingPremises } = useGetPremisesQuery();
	const { data: courseTypes, isLoading: isLoadingCourseTypes } = useGetAllCourseTypesQuery();

	const isLoadingPreReqs = !isLoadingBatchCycles && !isLoadingPremises && !isLoadingCourseTypes;
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
		data: paginatedCourses,  // -> courseCode, courseName, courseTypeId, courseTypeName, premiseId, premiseName, batchCycleId, batchCycleName, studentCount, courseGroupCount, status 
		isFetching,
		isLoading,
		isError,
		error,
	} = useGetPaginatedCoursesQuery(queryParams, {
		skip: !canAccessCourseList || !isLoadingPreReqs,
		refetchOnMountOrArgChange: true,
	});
	const [createCourse, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] = useCreateCourseMutation();
	const [updateCourse, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] = useUpdateCourseMutation();
	const [deleteCourseTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
		useDeleteCourseMutation();

	const courses = paginatedCourses?.content || [];
	const hasMore = paginatedCourses ? courses.length < paginatedCourses.totalElements : true;

	const { showModal, setShowModal } = useModal();
	const [editingCourse, setEditingCourse] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		course: null,
	});

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Courses List",
				subtitle: "View and manage all academic courses in the system",
				action: [{ label: "Add Course" }],
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
	const handleCreateCourse = useCallback(
		async (formData) => {
			try {
				await createCourse({ ...formData, currentFilters: filters }).unwrap();
				setShowModal(false);
				setEditingCourse(null);
			} catch (error) {
				return;
			}
		},
		[createCourse]
	);

	const handleUpdateCourse = useCallback(
		async (updateCourse) => {
			try {
				await updateCourse({ id: updateCourse.id, ...updateCourse, currentFilters: filters }).unwrap();
				setShowModal(false);
				setEditingCourse(null);
			} catch (error) {
				return;
			}
		},
		[updateCourse]
	);

	const handleDeleteCourse = useCallback(async () => {
		const idToDelete = deleteModal.course?.id;
		if (!idToDelete) return;
		try {
			await deleteCourseTrigger({ id: idToDelete, currentFilters: filters }).unwrap();
			setDeleteModal({ open: false, course: null });
		} catch (error) {}
	}, [deleteModal.course?.id, deleteCourseTrigger]);

	const handleOpenEditModal = (course) => {
		setEditingCourse(course);
		setShowModal(true);
	};

	//----TABLE CONFIGURATION-----
	// Options for Custom Dropdowns
	const batchCycleOptions = [{ value: "", label: "All Batch Cycles" }, ...batchCycles.map((c) => ({ value: c.id, label: c.title }))];
	const courseTypeOptions = [{ value: "", label: "All Course Types" }, ...courseTypes.map((c) => ({ value: c.id, label: c.title }))];
	const premiseOptions = [{ value: "", label: "All Premises" }, ...premises.map((c) => ({ value: c.id, label: c.title }))];
	const statusOptions = [
		{ value: "", label: "All Statuses" },
		{ value: "active", label: "Active" },
		{ value: "inactive", label: "Inactive" },
		{ value: "planned", label: "Planned" },
		{ value: "completed", label: "Completed" },
	];

	if (isError) {
		return <ErrorFallback errorMessage={`Failed to fetch courses: ${error.message}`} />;
	}

	const handleCourseClick = (course) => {
		navigate("/academic-management/modules", { state: { course } });
	};
	const handleResetFilters = () => {
		setFilters({ batchCycleId: "", premiseId: "", courseTypeId: "", status: "" });
	};
	return (
		<>
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
				{/* Batch Cycle Filter */}
				<CustomSelect
					value={filters.batchCycleId}
					onChange={(e) => handleFilterChange("batchCycleId", e.target.value)}
					options={batchCycleOptions}
				/>
				<CustomSelect value={filters.premiseId} onChange={(e) => handleFilterChange("premiseId", e.target.value)} options={premiseOptions} />

				{/* Course Type Filter */}
				<CustomSelect
					value={filters.courseTypeId}
					onChange={(e) => handleFilterChange("courseTypeId", e.target.value)}
					options={courseTypeOptions}
					placeholder={initialCourseType ? `Filtered by ${initialCourseType.title}` : "All Course Types"}
				/>

				{/* Status Filter */}
				<CustomSelect value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} options={statusOptions} />

				{/* Search Input */}
				<SearchInput
					placeholder='By Title or Code...'
					value={filters.searchTerm}
					onChange={(value) => handleFilterChange("searchTerm", value)}
				/>
				<Button onClick={handleResetFilters}>
					<ListRestartIcon className='w-12 h-12' />
				</Button>
			</div>
			<Card className={"h-[500px]"}>
				<CardBody>
					{isLoading || isLoadingPreReqs ? (
						<SkeletonTable />
					) : courses.length === 0 ? (
						<EmptyState
							icon={<List className='w-12 h-12' />}
							title='No Course Found'
							description='Try adjusting your filters or search terms or Add a new course.'
						/>
					) : (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-[80px] rounded-tl-2xl '>S.No</TableHeader>
										<TableHeader className='w-1/6'>Title</TableHeader>
										<TableHeader className='w-1/6'>Batch Cycle</TableHeader>
										<TableHeader className='w-1/6'>Location</TableHeader>
										<TableHeader className='w-1/6'>Course Type</TableHeader>
										<TableHeader className='w-1/10'>
											<User className='w-12 h-12' />
											Students
										</TableHeader>
										<TableHeader className='w-1/10'>
											<Users className='w-12 h-12' />
											Groups
										</TableHeader>
										<TableHeader className='text-center rounded-tr-2xl w-[120px]'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='h-[430px] rounded-b-2xl overflow-y-auto scrollbar-none'>
								<Table>
									<TableBody>
										{courses.map((course, index) => {
											// Trigger the fetch 6 items before the last item of the full page.
											const isPrefetchTrigger = index === courses.length - PREFETCH_OFFSET - 1;
											return (
												<TableRow key={course.id} ref={hasMore && isPrefetchTrigger ? lastCourseElementRef : null}>
													<TableCell className='w-[80px]'>{index + 1}</TableCell>
													<TableCell
														className=' text-center w-1/6 cursor-pointer hover:scale-105 transition-all duration-200'
														handleClick={() => handleCourseClick(course)}>
														{course.courseName}
													</TableCell>
													<TableCell className=' text-center w-1/6'>
														{course.batchCycleName || course.batchCycleId || "N/A"}
													</TableCell>
													<TableCell className='w-1/6'>{course.premiseName || course.premiseId || "N/A"}</TableCell>
													<TableCell className='w-1/6'>{course.courseTypeName || course.courseTypeId || "N/A"}</TableCell>
													<TableCell className='w-1/10'>{course.studentCount || "#"}</TableCell>
													<TableCell className='w-1/10'>{course.groupCount || "#"}</TableCell>
													<TableCell className='w-[120px]'>
														<div className='flex items-center justify-center space-x-2'>
															<Button
																variant='ghost'
																className='cursor-pointer dark:hover:text-yellow-400'
																size='sm'
																onClick={() => handleOpenEditModal(course)}
																aria-label='Edit course'
																disabled={creating || deleting}>
																<Edit size={16} />
															</Button>
															<Button
																variant='ghost'
																size='sm'
																className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
																onClick={() =>
																	setDeleteModal({
																		open: true,
																		course,
																	})
																}
																disabled={creating || updating}>
																<Trash2 size={16} />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						</>
					)}
				</CardBody>
			</Card>

			{/* Modal for Create/Edit */}
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setEditingCourse(null);
				}}
				size='lg'>
				<ModalHeader
					title={editingCourse ? "Edit Course" : "Create New Course"}
					subtitle={editingCourse ? "Update course details." : "Add a new course to the system."}
					onClose={() => {
						setShowModal(false);
						setEditingCourse(null);
					}}
				/>
				<ModalBody>
					<CourseForm
						course={editingCourse}
						batchCycles={batchCycleOptions}
						courseTypes={courseTypeOptions}
						premises={premiseOptions}
						onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}
						onCancel={() => {
							setShowModal(false);
							setEditingCourse(null);
						}}
						isLoading={creating || updating}
					/>
				</ModalBody>
			</Modal>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, course: null })}
				onConfirm={() => handleDeleteCourse()}
				title='Delete Course'
				message={`Are you sure you want to delete "${deleteModal.course?.courseName}" course? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};

export default CourseList;
