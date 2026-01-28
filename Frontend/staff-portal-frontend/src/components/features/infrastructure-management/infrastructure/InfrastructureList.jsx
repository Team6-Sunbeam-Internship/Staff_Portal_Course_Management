// /*eslint-disable*/
// import { useState, useEffect } from "react";
// import { Plus, Trash2, Edit, List, ShieldX } from "lucide-react";
// // --- COMMON COMPONENTS ---
// import {
// 	Card,
// 	CardBody,
// 	Table,
// 	TableHead,
// 	TableHeader,
// 	TableBody,
// 	TableRow,
// 	TableCell,
// 	Button,
// 	Modal,
// 	ModalHeader,
// 	ModalBody,
// 	ConfirmDialog,
// 	EmptyState,
// 	SkeletonTable,
// } from "../../../layout";
// import { InfrastructureForm } from "./InfrastructureForm";
// import { useDispatch, useSelector } from "react-redux";
// import {
// 	setBreadcrumbs,
// 	setHeaderInfo,
// 	useCreateInfrastructureMutation,
// 	useDeleteInfrastructureMutation,
// 	useGetAllInfrastructureQuery,
// 	useUpdateInfrastructureMutation,
// } from "../../../../store";
// import { useModal } from "../../../../providers/providerHook/useModal";
// import { selectUserRole } from "../../../../store/selectors";
// import { useFilteredMenu } from "../../../../hooks";
// import { ErrorFallback } from "../../../layout/errorBoundary";
// const InfrastructureList = () => {
// 	const dispatch = useDispatch();
// 	const userRole = useSelector(selectUserRole);
// 	const { pathSet } = useFilteredMenu();
// 	const canAccessInfrastructureList = pathSet.has("/infrastructure-management/infrastructure/infrastructure") && userRole === "ADMIN";

// 	//----------RTK QUERY HOOKS----------
// 	const { data: infrastructures, isLoading, isError, isFetching, error } = useGetAllInfrastructureQuery();
// 	const [createInfrastructure, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] =
// 		useCreateInfrastructureMutation();
// 	const [updateInfrastructure, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] =
// 		useUpdateInfrastructureMutation();
// 	const [deleteInfrastructureTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
// 		useDeleteInfrastructureMutation();

// 	const { showModal, setShowModal } = useModal();
// 	const [editingInfrastructure, setEditingInfrastructure] = useState(null);
// 	const [deleteModal, setDeleteModal] = useState({
// 		open: false,
// 		infrastructure: null,
// 	});

// 	useEffect(() => {
// 		// --- Create Notifications ---
// 		if (created) {
// 			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Batch Cycle created successfully!' }));
// 			console.log("Notification: Batch Cycle created successfully!");
// 		}
// 		if (createError) {
// 			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to create Batch Cycle.' }));
// 			console.error("Failed to create batch cycle:", createErrorDetails);
// 		}

// 		// --- Update Notifications ---
// 		if (updated) {
// 			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Batch Cycle updated successfully!' }));
// 			console.log("Notification: Batch Cycle updated successfully!");
// 		}
// 		if (updateError) {
// 			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to update Batch Cycle.' }));
// 			console.error("Failed to update batch cycle:", updateErrorDetails);
// 		}

// 		// --- Delete Notifications ---
// 		if (deleted) {
// 			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Batch Cycle deleted successfully!' }));
// 			console.log("Notification: Batch Cycle deleted successfully!");
// 		}
// 		if (deleteError) {
// 			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to delete Batch Cycle. Reverted changes.' }));
// 			console.error("Failed to delete batch cycle:", deleteErrorDetails);
// 		}

// 		// We only listen to the success/error flags, not the data or trigger functions
// 	}, [created, createError, updated, updateError, deleted, deleteError, createErrorDetails, updateErrorDetails, deleteErrorDetails]);

// 	useEffect(() => {
// 		dispatch(
// 			setHeaderInfo({
// 				title: "Infrastructures",
// 				subtitle: "List of all infrastructures",
// 				action: [
// 					{
// 						label: "Add Infrastructure",
// 					},
// 				],
// 			})
// 		);
// 		dispatch(
// 			setBreadcrumbs([
// 				{
// 					title: "Home",
// 					path: "/dashboard",
// 					icon: "home",
// 				},
// 				{
// 					title: "Infrastructure Management",
// 					path: "/infrastructure-management",
// 					icon: "house-plus",
// 				},
// 				{
// 					title: "Infrastructures",
// 					path: "/infrastructure-management/infrastructures",
// 					icon: "landmark",
// 				},
// 			])
// 		);
// 	}, [dispatch]);

// 	if (!canAccessInfrastructureList) {
// 		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
// 	}
// 	const handleCreateInfrastructure = async (formData) => {
// 		try {
// 			await createInfrastructure(formData).unwrap();
// 			setShowModal(false);
// 			setEditingInfrastructure(null);
// 		} catch (error) {
// 			return;
// 		}
// 	};

// 	const handleUpdateInfrastructure = async (updatedInfrastructure) => {
// 		try {
// 			await updateInfrastructure({ id: updatedInfrastructure.id, ...updatedInfrastructure }).unwrap();
// 			setShowModal(false);
// 			setEditingInfrastructure(null);
// 		} catch (error) {}
// 	};

// 	const handleDeleteInfrastructure = async () => {
// 		const idToDelete = deleteModal.infrastructure.id;
// 		if (!idToDelete) return;
// 		try {
// 			await deleteInfrastructureTrigger(idToDelete).unwrap();
// 			setDeleteModal({ open: false, infrastructure: null });
// 		} catch (error) {}
// 	};

// 	const handleOpenEditModal = (Infrastructure) => {
// 		setEditingInfrastructure(Infrastructure);
// 		setShowModal(true);
// 	};
// 	if (isError) {
// 		return <ErrorFallback errorMessage={`Error: ${error.error}`} />;
// 	}

// 	return (
// 		<>
// 			<Card className={"h-[574px]"}>
// 				<CardBody>
// 					{isLoading ? (
// 						<SkeletonTable />
// 					) : infrastructures.length === 0 ? (
// 						<EmptyState
// 							icon={<List className='w-12 h-12' />}
// 							title='No Batch Cycles Found'
// 							description='There are no batch cycles in the system. Get started by adding a new one.'
// 							action={
// 								<Button onClick={() => setShowModal(true)}>
// 									<Plus className='h-4 w-4 mr-2' />
// 									Create Batch Cycle
// 								</Button>
// 							}
// 						/>
// 					) : (
// 						<>
// 							<Table>
// 								<TableHead>
// 									<TableRow>
// 										<TableHeader className='w-[5%] rounded-tl-2xl'>S.No</TableHeader>
// 										<TableHeader className='w-[15%]'>Title</TableHeader>
// 										<TableHeader className='w-[10%]'>Type</TableHeader>
// 										<TableHeader className='w-[35%]'>Description</TableHeader>
// 										<TableHeader className='w-[12%]'>Location</TableHeader>
// 										<TableHeader className='w-[8%]'>Capacity</TableHeader>
// 										<TableHeader className='text-center rounded-tr-2xl w-[10%]'>Actions</TableHeader>
// 									</TableRow>
// 								</TableHead>
// 							</Table>
// 							<div className='h-[500px] rounded-b-2xl overflow-y-auto scrollbar-none'>
// 								<Table>
// 									<TableBody>
// 										{infrastructures.map((infrastructure, index) => (
// 											<TableRow key={infrastructure.id}>
// 												<TableCell className='font-medium w-[5%]'>{index + 1}</TableCell>
// 												<TableCell className='font-medium text-center w-[15%]'>{infrastructure.title}</TableCell>
// 												<TableCell className='font-medium text-center w-[10%]'>{infrastructure.type}</TableCell>
// 												<TableCell className='w-[35%]'>{infrastructure.description}</TableCell>
// 												<TableCell className='w-[12%]'>{infrastructure.premiseTitle}</TableCell> {/**Location */}
// 												<TableCell className='w-[8%]'>{infrastructure.capacity}</TableCell>
// 												<TableCell className='w-[10%]'>
// 													<div className='flex items-center justify-center space-x-2'>
// 														<Button
// 															variant='ghost'
// 															className='cursor-pointer rounded-full  dark:hover:text-yellow-400'
// 															size='sm'
// 															onClick={() => handleOpenEditModal(infrastructure)}
// 															disabled={creating || deleting}>
// 															<Edit size={16} />
// 														</Button>
// 														<Button
// 															variant='ghost'
// 															size='sm'
// 															className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
// 															onClick={() =>
// 																setDeleteModal({
// 																	open: true,
// 																	infrastructure,
// 																})
// 															}
// 															disabled={creating || updating}>
// 															<Trash2 size={16} />
// 														</Button>
// 													</div>
// 												</TableCell>
// 											</TableRow>
// 										))}
// 									</TableBody>
// 								</Table>
// 							</div>
// 						</>
// 					)}
// 				</CardBody>
// 			</Card>

// 			{/* Modal for Create/Edit */}
// 			<Modal
// 				isOpen={showModal}
// 				onClose={() => {
// 					setShowModal(false);
// 					setEditingInfrastructure(null);
// 				}}
// 				size='lg'>
// 				<ModalHeader
// 					title={editingInfrastructure ? "Edit Infrastructure" : "Create Infrastructure"}
// 					subtitle={editingInfrastructure ? "Update infrastructure details." : "Add a new infrastructure to the system."}
// 					onClose={() => {
// 						setShowModal(false);
// 						setEditingInfrastructure(null);
// 					}}
// 				/>
// 				<ModalBody>
// 					<InfrastructureForm
// 						infrastructure={editingInfrastructure}
// 						onSubmit={editingInfrastructure ? handleUpdateInfrastructure : handleCreateInfrastructure}
// 						onCancel={() => {
// 							setShowModal(false);
// 							setEditingInfrastructure(null);
// 						}}
// 						isLoading={creating || updating}
// 					/>
// 				</ModalBody>
// 			</Modal>

// 			{/* Confirmation Dialog */}
// 			<ConfirmDialog
// 				isOpen={deleteModal.open}
// 				onClose={() => setDeleteModal({ open: false, Infrastructure: null })}
// 				onConfirm={() => handleDeleteInfrastructure()}
// 				title='Delete Batch Cycle'
// 				message={`Are you sure you want to delete "${deleteModal.infrastructure?.title}"? This action cannot be undone.`}
// 				confirmText='Delete'
// 				type='danger'
// 			/>
// 		</>
// 	);
// };

// export default InfrastructureList;

/*eslint-disable*/
import { Edit, List, ShieldX, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
// --- COMMON COMPONENTS ---
import { useDispatch, useSelector } from "react-redux";
import { useFilteredMenu } from "../../../../hooks";
import { useModal } from "../../../../providers/providerHook/useModal";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateInfrastructureMutation,
	useDeleteInfrastructureMutation,
	useGetAllInfrastructureQuery,
	useGetPreservedCommandsQuery,
	useUpdateInfrastructureMutation,
} from "../../../../store";
import { selectUserRole } from "../../../../store/selectors";
import { notify } from "../../../../utils/Notify";
import {
	Button,
	Card,
	CardBody,
	ConfirmDialog,
	EmptyState,
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
import { InfrastructureForm } from "./InfrastructureForm";
const InfrastructureList = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessInfrastructureList = pathSet.has("/infrastructure-management/infrastructure") && userRole === "ADMIN";

	const resumePending = sessionStorage.getItem("resumePending") === "true";
	const { data: preservedCommands = [] } = useGetPreservedCommandsQuery(undefined, { skip: !resumePending });

	//----------RTK QUERY HOOKS----------
	const { data: infrastructures = [], isLoading, isError, isFetching, error } = useGetAllInfrastructureQuery();
	const [createInfrastructure, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] =
		useCreateInfrastructureMutation();
	const [updateInfrastructure, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] =
		useUpdateInfrastructureMutation();
	const [deleteInfrastructureTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
		useDeleteInfrastructureMutation();

	const formRef = useRef(null);
	const { showModal, openModal, closeModal } = useModal();
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		infrastructure: null,
	});
	console.log("Infrastructures:", infrastructures);
	const tableData = useMemo(() => {
		return [...infrastructures];
	}, [infrastructures]);

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
		if (command.commandName === "CREATE_INFRASTRUCTURE") {
			openModal("Infrastructure", "CREATE", command.payload);
		}

		if (command.commandName === "UPDATE_INFRASTRUCTURE") {
			openModal("Infrastructure", "EDIT", command.payload);
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
				title: "Infrastructures",
				subtitle: "List of all infrastructures",
				action: [
					{
						label: "Add Infrastructure",
						entity: "Infrastructure",
						mode: "CREATE"
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
					title: "Infrastructure Management",
					path: "/infrastructure-management",
					icon: "house-plus",
				},
				{
					title: "Infrastructures",
					path: "/infrastructure-management/infrastructures",
					icon: "landmark",
				},
			])
		);
	}, [dispatch]);

	if (!canAccessInfrastructureList) {
		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
	}

	const handleSumbit = async (data) => {
		const { id, payload } = data;
		try {
			if (id) {
				await updateInfrastructure({ id, payload }).unwrap();
				notify.success(`Infrastructure ${payload.title} updated successfully!`);
			} else {
				await createInfrastructure(payload).unwrap();
				notify.success(`Infrastructure ${payload.title} created successfully!`);
			}
		} catch (error) {
			notify.error(error?.data?.message || "Failed to save infrastructure.");
			if (formRef.current) {
				formRef.current.reset();
			}
		}
		closeModal();
	};

	const handleDeleteInfrastructure = async () => {
		const idToDelete = deleteModal.infrastructure.id;
		if (!idToDelete) return;
		try {
			await deleteInfrastructureTrigger(idToDelete).unwrap();
		} catch (error) {}
		setDeleteModal({ open: false, infrastructure: null });
	};

	const handleOpenEditModal = (infrastructure) => {
		openModal("Infrastructure", "EDIT", infrastructure);
	};
	if (isError) {
		return <ErrorFallback errorMessage={`Error: ${error.error}`} />;
	}

	return (
		<>
			<Card className={"h-[574px]"}>
				<CardBody>
					{isLoading ?
						<SkeletonTable />
					: tableData.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title='No Infrastructure Found'
							description='There are no infrastructure in the system. Get started by adding a new one.'
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-[5%] rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-[15%]'>Title</TableHeader>
										<TableHeader className='w-[10%]'>Type</TableHeader>
										<TableHeader className='w-[35%]'>Description</TableHeader>
										<TableHeader className='w-[12%]'>Location</TableHeader>
										<TableHeader className='w-[8%]'>Capacity</TableHeader>
										<TableHeader className='w-[10%] rounded-tr-2xl text-center'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[500px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{tableData.map((infrastructure, index) => (
											<TableRow key={infrastructure.id}>
												<TableCell className='w-[5%] font-medium'>{index + 1}</TableCell>
												<TableCell className='w-[15%] text-center font-medium'>{infrastructure.title}</TableCell>
												<TableCell className='w-[10%] text-center font-medium'>{infrastructure.type}</TableCell>
												<TableCell className='w-[35%]'>{infrastructure.description}</TableCell>
												<TableCell className='w-[12%]'>{infrastructure.premisesTitle}</TableCell> {/**Location */}
												<TableCell className='w-[8%]'>{infrastructure.capacity}</TableCell>
												<TableCell className='w-[10%]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='gradientAmber'
															icon={Edit}
															className='h-8 w-8 rounded-lg'
															size='sm'
															onClick={() => handleOpenEditModal(infrastructure)}
															disabled={creating || deleting}></Button>
														<Button
															variant='gradientRose'
															size='sm'
															icon={Trash2}
															className='h-8 w-8 rounded-lg'
															onClick={() =>
																setDeleteModal({
																	open: true,
																	infrastructure,
																})
															}
															disabled={creating || updating}></Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</>
					}
				</CardBody>
			</Card>

			{/* Modal for Create/Edit */}
			<ModalForm
				isOpen={showModal.open && showModal.entity === "Infrastructure"}
				onClose={closeModal}
				title={showModal.mode === "EDIT" ? "Edit Infrastructure" : "Create Infrastructure"}
				description={showModal.mode === "EDIT" ? "Updating Infrastructure Details" : "Add a new infstructure in the instution"}
				formRef={formRef}
				loading={creating || updating}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<InfrastructureForm ref={modalFormRef} infrastructure={showModal.payload} onSubmit={handleSumbit} isLoading={creating || updating} />
					);
				}}
			</ModalForm>
			<ResumeModal isOpen={resumeModal.open} commands={resumeModal.resumeData} onResume={handleResumeConfirm} onDiscard={handleResumeDiscard} />
			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, Infrastructure: null })}
				onConfirm={() => handleDeleteInfrastructure()}
				title='Delete Batch Cycle'
				message={`Are you sure you want to delete "${deleteModal.infrastructure?.title}"? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};

export default InfrastructureList;
