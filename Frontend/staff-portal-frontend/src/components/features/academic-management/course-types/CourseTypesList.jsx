/*eslint-disable */
import { useEffect, useState } from "react";
import { Edit, Trash2, BookOpen } from "lucide-react";

import { Button, Card, CardBody, EmptyState, Modal, ModalHeader, ModalBody, Badge, ConfirmDialog, Grid, GridItem } from "../../../layout";
import { CourseTypeForm } from "./CourseTypeForm";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs, setHeaderInfo } from "../../../../store";
import { useModal } from "../../../../providers/providerHook/useModal";
import { useNavigate } from "react-router";
import {
	useCreateCourseTypeMutation,
	useDeleteCourseTypeMutation,
	useGetAllCourseTypesQuery,
	useUpdateCourseTypeMutation,
} from "../../../../store/api/academic-service-mgmtApi";
import { selectUserRole } from "../../../../store/selectors";
import { useFilteredMenu } from "../../../../hooks";
import { ErrorFallback } from "../../../layout/errorBoundary";

const CourseTypeList = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const userRole = useSelector(selectUserRole);
	const { filteredMenu = [] } = useFilteredMenu();
	const canAccessCourseTypeList = filteredMenu.includes("/academic-management/course-types") && userRole === "ADMIN";
	
	//----------RTK QUERY HOOKS----------
	const { data: courseTypes = [], isLoading, isFetching, isError, error } = useGetAllCourseTypesQuery();
	const [createCourseType, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] =
		useCreateCourseTypeMutation();
	const [updateCourseType, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] =
		useUpdateCourseTypeMutation();
	const [deleteCourseTypeTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
		useDeleteCourseTypeMutation();
	const { showModal, setShowModal } = useModal();
	const [editingCourseType, setEditingCourseType] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		courseType: null,
	});

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

	const handleCreateCourseType = async (formData) => {
		try {
			await createCourseType(formData).unwrap();
			setShowModal(false);
			setEditingCourseType(null);
		} catch (error) {
			return;
		}
	};

	const handleUpdateCourseType = async (formData) => {
		try {
			await updateCourseType({ id: updateCourseType.id, ...formData }).unwrap();
			setShowModal(false);
			setEditingCourseType(null);
		}catch (error) {
			return;
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
		setEditingCourseType(courseType);
		setShowModal(true);
	};

	const handleDeleteClick = (courseType) => {
		setDeleteModal({ open: true, courseType });
	};

	const closeModal = () => {
		setShowModal(false);
		setEditingCourseType(null);
	};
	if (isError) {
		return <ErrorFallback errorMessage={`Error: ${error.error}`} />;
	}
	const handleCourseTypeClick = (courseType) => {
		console.log("Navigating to CourseList for:", courseType);
		navigate("/academic-management/courses", { state: { courseType } });
	};

	return (
		<div className=' flex flex-col'>
			<div className='flex-grow'>
				{isLoading ? (
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse'>
						{[...Array(16)].map((_, index) => (
							<div key={index} className='relative group overflow-hidden rounded-2xl h-52 bg-slate-800 border border-slate-700 p-10'>
								<div className='flex items-center justify-between mb-4'>
									<div className='h-6 w-20 bg-slate-700 rounded-full'></div>
									<div className='flex items-center justify-between mb-2 space-x-2'>
										<div className='h-6 w-12 bg-slate-700 rounded-full'></div>
										<div className='h-6 w-6 bg-slate-700 rounded-full'></div>
										<div className='h-6 w-6 bg-slate-700 rounded-full'></div>
									</div>
								</div>
								<div className='space-y-2'>
									<div className='h-4 bg-slate-700 rounded-full w-3/4'></div>
									<div className='h-4 bg-slate-700 rounded-full'></div>
									<div className='h-4 bg-slate-700 rounded-full w-5/6'></div>
								</div>
								<div className='mt-4 pt-4 border-t border-slate-700'>
									<div className='flex items-center justify-between'>
										<div className='h-4 w-28 bg-slate-700 rounded-full'></div>
										<div className='h-4 w-12 bg-slate-700 rounded-full'></div>
									</div>
								</div>
							</div>
						))}
					</div>
				) : courseTypes.length === 0 ? (
					<EmptyState
						title='No course types found'
						subtitle='Start by adding a new course type to your system.'
						icon={<BookOpen className='h-12 w-12' />}
						action={<Button onClick={() => setShowModal(true)}>Add Course Type</Button>}
					/>
				) : (
					<div
						className='flex-grow
					'>
						<Grid columns={{ base: 1, sm: 2, md: 3, lg: 4 }}>
							{courseTypes.map((courseType) => (
								<GridItem
									key={courseType.id}
									className=' relative group rounded-xl transition-all ease-in-out duration-200 hover:scale-105 cursor-pointer'>
									<Card className='h-full dark:bg-gradient-to-br dark:from-neutral-700 dark:to-gray-950 shadow-md shadow-cyan-700  border-none '>
										<CardBody className='flex flex-col h-full justify-between'>
											<div onClick={() => handleCourseTypeClick(courseType)}>
												<div className='flex items-center justify-between space-x-5'>
													<div className='w-12 h-12 bg-blue-100 dark:bg-blue-500/15 rounded-xl flex items-center justify-center'>
														<BookOpen size={24} className='text-blue-600 dark:text-blue-400 dark' />
													</div>
													<div className='flex items-center justify-between mb-2 space-x-2'>
														<Badge
															status={
																courseType.status === "ACTIVE"
																	? "active"
																	: courseType.status === "INACTIVE"
																	? "danger"
																	: "planned"
															}>
															{courseType.status}
														</Badge>
														<div className='flex opacity-0 group-hover:opacity-100 transition-opacity'>
															<Button variant='ghost' size='sm' onClick={() => handleEditClick(courseType)} disabled={creating || deleting}>
																<Edit className='h-4 w-4' />
															</Button>
															<Button variant='danger' size='sm' onClick={() => handleDeleteClick(courseType)} disabled={creating || updating}>
																<Trash2 className='h-4 w-4' />
															</Button>
														</div>
													</div>
												</div>
												<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2'>{courseType.title}</h3>
												<p className='text-gray-600 dark:text-slate-400 text-sm line-clamp-3'>{courseType.description}</p>
											</div>
											<div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
												<div
													className='flex items-center justify-between text-sm'
													onClick={() => handleCourseTypeClick(courseType)}>
													<span className='text-gray-500 dark:bg-gradient-to-r dark:from-slate-800 dark:to-slate-100 bg-clip-text'>
														Click to view courses
													</span>
													<p className='bg-gradient-to-r from-sky-500 to-sky-700 dark:bg-gradient-to-r dark:from-pink-400 dark:to-pink-600 bg-clip-text text-transparent font-medium'>
														View →
													</p>
												</div>
											</div>
										</CardBody>
									</Card>
								</GridItem>
							))}
						</Grid>
					</div>
				)}
			</div>
			{/* Create/Edit Modal */}
			<Modal isOpen={showModal} onClose={closeModal}>
				<ModalHeader
					title={editingCourseType ? "Edit Course Type" : "Create Course Type"}
					subtitle={editingCourseType ? "Update course type details" : "Add a new course type to your system"}
				/>
				<ModalBody>
					<CourseTypeForm
						courseType={editingCourseType}
						onSubmit={editingCourseType ? handleUpdateCourseType : handleCreateCourseType}
						onCancel={closeModal}
						isLoading={creating || updating}
					/>
				</ModalBody>
			</Modal>

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
