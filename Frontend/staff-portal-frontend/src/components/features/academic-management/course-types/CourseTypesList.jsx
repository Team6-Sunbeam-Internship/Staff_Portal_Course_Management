/*eslint-disable */
import { ArrowRight, BookOpen, Edit, ShieldX, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useFilteredMenu } from "../../../../hooks";
import { useModal } from "../../../../providers/providerHook/useModal";
import { setBreadcrumbs, setHeaderInfo, useGetPreservedCommandsQuery } from "../../../../store";
import {
	useCreateCourseTypeMutation,
	useDeleteCourseTypeMutation,
	useGetAllCourseTypesQuery,
	useUpdateCourseTypeMutation,
} from "../../../../store/api/academic-service-mgmtApi";
import { selectUserRole } from "../../../../store/selectors";
import { notify } from "../../../../utils/Notify";
import { Badge, Button, ConfirmDialog, EmptyState, Grid } from "../../../layout";
import { ErrorFallback } from "../../../layout/errorBoundary";
import { ModalForm } from "../../../layout/modals/ModalForm";
import ResumeModal from "../../../layout/modals/ResumeModal";
import { CourseTypeForm } from "./CourseTypeForm";
const CourseTypeList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessCourseTypeList = pathSet.has("/academic-management/course-types") && userRole === "ADMIN";

	const resumePending = sessionStorage.getItem("resumePending") === "true";
	const { data: preservedCommands = [] } = useGetPreservedCommandsQuery(undefined, { skip: !resumePending });

	//----------RTK QUERY HOOKS----------
	const { data: courseTypes = [], isLoading, isFetching, isError, error } = useGetAllCourseTypesQuery();
	const [createCourseType, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] =
		useCreateCourseTypeMutation();
	const [updateCourseType, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] =
		useUpdateCourseTypeMutation();
	const [deleteCourseTypeTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
		useDeleteCourseTypeMutation();

	const formRef = useRef(null);
	const { showModal, openModal, closeModal } = useModal();
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		courseType: null,
	});

	const cardData = useMemo(() => {
		return [...courseTypes];
	}, [courseTypes]);
	const [resumeModal, setResumeModal] = useState({ open: false, resumeData: null });

	useEffect(() => {
		if (!resumePending) return;
		if (!preservedCommands || preservedCommands.length === 0) return;
		setResumeModal({ open: true, resumeData: preservedCommands });
		sessionStorage.removeItem("resumePending");
	}, [resumePending, preservedCommands]);

	const handleResumeConfirm = (command) => {
		if (command.commandName === "CREATE_COURSE_TYPE") {
			setEditingCourseType(command.payload);
			setShowModal(true);
		}

		if (command.commandName === "UPDATE_COURSE_TYPE") {
			setEditingCourseType(command.payload);
			setShowModal(true);
		}

		setResumeModal({ open: false, resumeData: null });
	};
	const handleResumeDiscard = () => {
		setResumeModal({ open: false, resumeData: null });
	};
	useEffect(() => {
		// --- Create Notifications ---
		if (created) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Batch Cycle created successfully!' }));
			console.log("Notification: Batch Cycle created successfully!");
		}
		if (createError) {
			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to create Batch Cycle.' }));
			console.error("Failed to create batch cycle:", createErrorDetails);
		}

		// --- Update Notifications ---
		if (updated) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Batch Cycle updated successfully!' }));
			console.log("Notification: Batch Cycle updated successfully!");
		}
		if (updateError) {
			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to update Batch Cycle.' }));
			console.error("Failed to update batch cycle:", updateErrorDetails);
		}

		// --- Delete Notifications ---
		if (deleted) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Batch Cycle deleted successfully!' }));
			console.log("Notification: Batch Cycle deleted successfully!");
		}
		if (deleteError) {
			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to delete Batch Cycle. Reverted changes.' }));
			console.error("Failed to delete batch cycle:", deleteErrorDetails);
		}

		// We only listen to the success/error flags, not the data or trigger functions
	}, [created, createError, updated, updateError, deleted, deleteError, createErrorDetails, updateErrorDetails, deleteErrorDetails]);

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Course Types",
				subtitle: "List of all course types in the institution",
				action: [{ label: "Add Course Type" }],
			})
		);
		dispatch(
			setBreadcrumbs([
				{ title: "Home", path: "/dashboard", icon: "home" },
				{ title: "Academic Management", icon: "academic-cap" },
				{ title: "Course Types", path: "/academic-management/course-types", icon: "book-open" },
			])
		);
	}, [dispatch]);

	if (!canAccessCourseTypeList) {
		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
	}

	const handleSubmit = async (data) => {
		const { id, payload } = data;
		try {
			if (id) {
				await updateCourseType({ id, payload }).unwrap();
				notify.success(`Course Type updated successfully!`);
			} else {
				await createCourseType(payload).unwrap();
				notify.success(`Course Type ${payload.title} created successfully!`);
			}
			closeModal();
		} catch (error) {
			notify.error(error?.data?.message || "Failed to save course type.");
			if (formRef.current) {
				formRef.current.reset();
			}
		}
	};

	const handleDeleteCourseType = async () => {
		if (!deleteModal.courseType) return;
		const idToDelete = deleteModal.courseType.id;
		if (!idToDelete) return;
		try {
			await deleteCourseTypeTrigger(idToDelete).unwrap();
			setDeleteModal({ open: false, courseType: null });
		} catch (error) {}
	};

	const handleEditClick = (courseType) => {
		openModal(courseType, "EDIT", courseType);
	};

	const handleDeleteClick = (courseType) => {
		setDeleteModal({ open: true, courseType });
	};

	if (isError) {
		return <ErrorFallback errorMessage={`Error: ${error.error}`} />;
	}
	const handleCourseTypeClick = (courseType) => {
		notify.success(`Navigating to Course List for ${courseType.title}`);
		navigate("/academic-management/courses", { state: { courseType } });
	};

	return (
		<div className='flex flex-col'>
			<div className='flex-grow'>
				{isLoading ?
					<div className='grid animate-pulse grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
						{[...Array(16)].map((_, index) => (
							<div key={index} className='group relative h-52 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 p-10'>
								<div className='mb-4 flex items-center justify-between'>
									<div className='h-6 w-20 rounded-full bg-slate-700'></div>
									<div className='mb-2 flex items-center justify-between space-x-2'>
										<div className='h-6 w-12 rounded-full bg-slate-700'></div>
										<div className='h-6 w-6 rounded-full bg-slate-700'></div>
										<div className='h-6 w-6 rounded-full bg-slate-700'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='h-4 w-3/4 rounded-full bg-slate-700'></div>
									<div className='h-4 rounded-full bg-slate-700'></div>
									<div className='h-4 w-5/6 rounded-full bg-slate-700'></div>
								</div>
								<div className='mt-4 border-t border-slate-700 pt-4'>
									<div className='flex items-center justify-between'>
										<div className='h-4 w-28 rounded-full bg-slate-700'></div>
										<div className='h-4 w-12 rounded-full bg-slate-700'></div>
									</div>
								</div>
							</div>
						))}
					</div>
				: cardData.length === 0 ?
					<EmptyState
						title='No course types found'
						description='Start by adding a new course type to your system.'
						icon={<BookOpen className='h-12 w-12' />}
					/>
				:	<div className=' '>
						<Grid columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>
							{courseTypes.map((courseType) => (
								<motion.div
									key={courseType.id}
									whileHover={{
										y: -8,
										rotateZ: 1.2,
										scale: 1.02,
									}}
									transition={{ type: "spring", stiffness: 220, damping: 20 }}
									className={`group flex h-[245px] flex-col justify-between rounded-[2.5rem] bg-white p-8 dark:bg-zinc-900/40 ${
										courseType.status.toLowerCase() === "active" ? "border-b border-b-emerald-300"
										: courseType.status.toLowerCase() === "inactive" ? "border-b border-b-rose-400"
										: ""
									} relative overflow-hidden transition-all duration-300 hover:border-zinc-200 hover:shadow-2xl dark:hover:border-zinc-800 dark:hover:bg-zinc-900`}>
									<div className='flex items-start justify-between'>
										<motion.div
											animate={{ y: [0, -4, 0] }}
											transition={{ repeat: Infinity, duration: 3, ease: "easeOut" }}
											className='group:hover:bg-zinc-950 dark:group:text-black flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-50 text-zinc-600 transition-all duration-500 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-400 dark:group-hover:bg-amber-500'>
											<BookOpen size={26} />
										</motion.div>
										<div className='flex flex-col items-end gap-3'>
											<Badge status={courseType.status.toLowerCase()}>{courseType.status}</Badge>
											<div className='flex translate-x-4 gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100'>
												<Button icon={Edit} variant='gradientAmber' onClick={() => handleEditClick(courseType)} className='h-8 w-8 rounded-lg' />
												<Button icon={Trash2} variant='gradientRose' onClick={() => handleDeleteClick(courseType)} className='h-8 w-8 rounded-lg' />
											</div>
										</div>
									</div>
									<div className='space-y-2'>
										<h3 className='text-xl font-bold text-zinc-900 transition-colors group-hover:text-amber-600 dark:text-zinc-100 dark:group-hover:text-amber-500'>
											{courseType.title}
										</h3>
										<p className='line-clamp-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400'>{courseType.description}</p>
									</div>
									<div className='flex items-center justify-between border-t border-zinc-50 pt-4 dark:border-zinc-800/50'>
										<span className='text-[10px] font-bold tracking-widest text-zinc-400 uppercase dark:text-zinc-50'>Course Overview</span>
										<motion.div
											onClick={() => handleCourseTypeClick(courseType)}
											whileHover={{ x: 5 }}
											className='flex cursor-pointer items-center gap-1.5 text-sm font-black text-indigo-500 dark:text-amber-500'>
											View <ArrowRight size={16} strokeWidth={3} />
										</motion.div>
									</div>
								</motion.div>
							))}
						</Grid>
					</div>
				}
			</div>
			<ModalForm
				isOpen={showModal.open}
				onClose={closeModal}
				title={showModal.mode === "EDIT" ? "Edit Course Type" : "Create Course Type"}
				description={showModal.mode === "EDIT" ? "Update course type Details" : "Add a new course type in the institution"}
				formRef={formRef}
				loading={creating || updating}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return <CourseTypeForm ref={modalFormRef} courseType={showModal.payload} onSubmit={handleSubmit} isLoading={creating || updating} />;
				}}
			</ModalForm>
			<ResumeModal isOpen={resumeModal.open} commands={resumeModal.resumeData} onResume={handleResumeConfirm} onDiscard={handleResumeDiscard} />

			{/* Delete Confirmation */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, courseType: null })}
				onConfirm={handleDeleteCourseType}
				title='Delete Course Type'
				message={`Are you sure you want to delete "${deleteModal.courseType?.title}"? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</div>
	);
};

export default CourseTypeList;
