// /*eslint-disable*/
// import { useState, useEffect, useRef } from "react";
// import { Trash2, Edit, List, ShieldX } from "lucide-react";
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
// import { PremiseForm } from "../premise";
// import { useDispatch, useSelector } from "react-redux";
// import {
// 	setBreadcrumbs,
// 	setHeaderInfo,
// 	useCreatePremiseMutation,
// 	useDeletePremiseMutation,
// 	useGetPremisesQuery,
// 	useUpdatePremiseMutation,
// } from "../../../../store";
// import { useModal } from "../../../../providers/providerHook/useModal";
// import { selectUserRole } from "../../../../store/selectors";
// import { useFilteredMenu } from "../../../../hooks";
// import { ErrorFallback } from "../../../layout/errorBoundary";

// const PremisesList = () => {
// 	const dispatch = useDispatch();
// 	const userRole = useSelector(selectUserRole);
// 	const { pathSet } = useFilteredMenu();
// 	const canAccessPremiseList = pathSet.has("/infrastructure-management/batch-cycles") && userRole === "ADMIN";
// 	//----------RTK QUERY HOOKS----------
// 	const { data: premises = [], isLoading, isError, isFetching, error } = useGetPremisesQuery();
// 	const [createPremise, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] = useCreatePremiseMutation();
// 	const [updatePremise, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] = useUpdatePremiseMutation();
// 	const [deletePremiseTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
// 		useDeletePremiseMutation();

// 	const formRef = useRef(null);
// 	const { showModal, setShowModal } = useModal();
// 	const [editingPremise, setEditingPremise] = useState(null);
// 	const [deleteModal, setDeleteModal] = useState({
// 		open: false,
// 		premise: null,
// 	});
// 	useEffect(() => {
// 		// --- Create Notifications ---
// 		if (created) {
// 			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Premise created successfully!' }));
// 			console.log("Notification: Premise created successfully!");
// 		}
// 		if (createError) {
// 			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to create Premise.' }));
// 			console.error("Failed to create Premise:", createErrorDetails);
// 		}

// 		// --- Update Notifications ---
// 		if (updated) {
// 			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Premise updated successfully!' }));
// 			console.log("Notification: Premise updated successfully!");
// 		}
// 		if (updateError) {
// 			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to update Premise.' }));
// 			console.error("Failed to update Premise:", updateErrorDetails);
// 		}

// 		// --- Delete Notifications ---
// 		if (deleted) {
// 			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Premise deleted successfully!' }));
// 			console.log("Notification: Premise deleted successfully!");
// 		}
// 		if (deleteError) {
// 			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to delete Premise. Reverted changes.' }));
// 			console.error("Failed to delete Premise:", deleteErrorDetails);
// 		}

// 		// We only listen to the success/error flags, not the data or trigger functions
// 	}, [created, createError, updated, updateError, deleted, deleteError, createErrorDetails, updateErrorDetails, deleteErrorDetails]);

// 	useEffect(() => {
// 		dispatch(
// 			setHeaderInfo({
// 				title: "Premises",
// 				subtitle: "List of all premises",
// 				action: [
// 					{
// 						label: "Add Premise",
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
// 					icon: "house-plus",
// 				},
// 				{
// 					title: "Premises",
// 					path: "/infrastructure-management/premises",
// 					icon: "house-plug",
// 				},
// 			])
// 		);
// 	}, [dispatch]);

// 	if (!canAccessPremiseList) {
// 		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
// 	}
// 	const handleCreatePremise = async (formData) => {
// 		try {
// 			await createPremise(formData).unwrap();
// 			setShowModal(false);
// 			setEditingPremise(null);
// 		} catch (error) {
// 			return;
// 		}
// 	};

// 	const handleUpdatePremise = async (updatedPremise) => {
// 		try {
// 			await updatePremise({ id: updatedPremise.id, ...updatedPremise }).unwrap();
// 			setShowModal(false);
// 			setEditingPremise(null);
// 		} catch (error) {}
// 	};

// 	const handleDeletePremise = async () => {
// 		const idToDelete = deleteModal.Premise.id;
// 		if (!idToDelete) return;
// 		try {
// 			await deletePremiseTrigger(idToDelete).unwrap();
// 			setDeleteModal({ open: false, Premise: null });
// 		} catch (error) {}
// 	};

// 	const handleOpenEditModal = (Premise) => {
// 		setEditingPremise(Premise);
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
// 					) : premises.length === 0 ? (
// 						<EmptyState
// 							icon={<List className='w-12 h-12' />}
// 							title='No Premises Found'
// 							description='There are no premises in the system. Get started by adding a new one.'
// 						/>
// 					) : (
// 						<>
// 							<Table>
// 								<TableHead>
// 									<TableRow>
// 										<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
// 										<TableHeader className='w-1/4'>Title</TableHeader>
// 										<TableHeader className='w-1/2'>Address</TableHeader>
// 										<TableHeader className='w-1/4'>Description</TableHeader>
// 										<TableHeader className='w-1/6'>Type</TableHeader>
// 										<TableHeader className='text-center rounded-tr-lg w-[120px]'>Actions</TableHeader>
// 									</TableRow>
// 								</TableHead>
// 							</Table>
// 							<div className='h-[500px] rounded-b-2xl overflow-y-auto scrollbar-none'>
// 								<Table>
// 									<TableBody>
// 										{premises.map((premise, index) => (
// 											<TableRow key={premise.id}>
// 												<TableCell className='font-medium w-1/12'>{index + 1}</TableCell>
// 												<TableCell className='font-medium text-center w-1/4'>{premise.title}</TableCell>
// 												<TableCell className='font-medium text-center w-1/2'>{premise.address}</TableCell>
// 												<TableCell className='w-1/4'>{premise.description}</TableCell>
// 												<TableCell className='w-1/6'>{premise.type}</TableCell>
// 												<TableCell className='w-[120px]'>
// 													<div className='flex items-center justify-center space-x-2'>
// 														<Button
// 															variant='ghost'
// 															className='cursor-pointer dark:hover:text-yellow-400'
// 															size='sm'
// 															onClick={() => handleOpenEditModal(premise)}
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
// 																	premise,
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
// 					setEditingPremise(null);
// 				}}
// 				size='lg'>
// 				<ModalHeader
// 					title={editingPremise ? "Edit Premise" : "Create Premise"}
// 					subtitle={editingPremise ? "Update Premise details." : "Add a new Premise to the system."}
// 					onClose={() => {
// 						setShowModal(false);
// 						setEditingPremise(null);
// 					}}
// 				/>
// 				<ModalBody>
// 					<PremiseForm
// 						premise={editingPremise}
// 						onSubmit={editingPremise ? handleUpdatePremise : handleCreatePremise}
// 						onCancel={() => {
// 							setShowModal(false);
// 							setEditingPremise(null);
// 						}}
// 						isLoading={creating || updating}
// 					/>
// 				</ModalBody>
// 			</Modal>

// 			{/* Confirmation Dialog */}
// 			<ConfirmDialog
// 				isOpen={deleteModal.open}
// 				onClose={() => setDeleteModal({ open: false, premise: null })}
// 				onConfirm={() => handleDeletePremise()}
// 				title='Delete Premise'
// 				message={`Are you sure you want to delete "${deleteModal.premise?.title}"? This action cannot be undone.`}
// 				confirmText='Delete'
// 				type='danger'
// 			/>
// 		</>
// 	);
// };

// export default PremisesList;

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
	useCreatePremiseMutation,
	useDeletePremiseMutation,
	useGetPremisesQuery,
	useGetPreservedCommandsQuery,
	useUpdatePremiseMutation,
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
import { PremiseForm } from "../premise";

const PremisesList = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessPremiseList = pathSet.has("/infrastructure-management/batch-cycles") && userRole === "ADMIN";

	const resumePending = sessionStorage.getItem("resumePending") === "true";
	const { data: preservedCommands = [] } = useGetPreservedCommandsQuery(undefined, { skip: !resumePending });

	//----------RTK QUERY HOOKS----------
	const { data: premises = [], isLoading, isError, isFetching, error } = useGetPremisesQuery();
	const [createPremise, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] = useCreatePremiseMutation();
	const [updatePremise, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] = useUpdatePremiseMutation();
	const [deletePremiseTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
		useDeletePremiseMutation();

	const formRef = useRef(null);
	const { showModal, openModal, closeModal } = useModal();
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		premise: null,
	});

	const formatAddress = (address) => {
		if (typeof address === "object" && address !== null) {
			return `${address.line1}, ${address.line2}, ${address.city}, ${address.state}, ${address.country}, ${address.postalCode}`;
		}
		return address; // return as is if already a string
	};
	const tableData = useMemo(() => {
		return premises.map((premise) => {
			return {
				...premise,
				address: formatAddress(premise?.address),
			};
		});
	}, [premises]);
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

		if (command.commandName === "CREATE_PREMISE") {
			openModal("Premise", "CREATE", command.payload);
		}

		if (command.commandName === "UPDATE_PREMISE") {
			openModal("Premise", "EDIT", command.payload);
		}

		setResumeModal({ open: false, resumeData: null });
	};

	const handleResumeDiscard = () => {
		setResumeModal({ open: false, resumeData: null });
	};
	useEffect(() => {
		// --- Create Notifications ---
		if (created) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Premise created successfully!' }));
			console.log("Notification: Premise created successfully!");
		}
		if (createError) {
			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to create Premise.' }));
			console.error("Failed to create Premise:", createErrorDetails);
		}

		// --- Update Notifications ---
		if (updated) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Premise updated successfully!' }));
			console.log("Notification: Premise updated successfully!");
		}
		if (updateError) {
			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to update Premise.' }));
			console.error("Failed to update Premise:", updateErrorDetails);
		}

		// --- Delete Notifications ---
		if (deleted) {
			// Placeholder: dispatch(showNotification({ type: 'success', message: 'Premise deleted successfully!' }));
			console.log("Notification: Premise deleted successfully!");
		}
		if (deleteError) {
			// Placeholder: dispatch(showNotification({ type: 'error', message: 'Failed to delete Premise. Reverted changes.' }));
			console.error("Failed to delete Premise:", deleteErrorDetails);
		}

		// We only listen to the success/error flags, not the data or trigger functions
	}, [created, createError, updated, updateError, deleted, deleteError, createErrorDetails, updateErrorDetails, deleteErrorDetails]);

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Premises",
				subtitle: "List of all premises",
				action: [
					{
						label: "Add Premise",
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
					icon: "house-plus",
				},
				{
					title: "Premises",
					path: "/infrastructure-management/premises",
					icon: "house-plug",
				},
			])
		);
	}, [dispatch]);

	if (!canAccessPremiseList) {
		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
	}

	const handleSubmit = async (data) => {
		const { id, payload } = data;
		try {
			if (id) {
				console.log("Update data:", payload);
				await updatePremise({ id, payload }).unwrap();
				notify.success(`Premise updated successfully!`);
			} else {
				await createPremise(payload).unwrap();
				notify.success(`Premise ${payload.name} created successfully!`);
			}
			closeModal();
		} catch (error) {
			notify.error(error?.data?.message || "Failed to save premise.");
			if (formRef.current) {
				formRef.current.reset();
			}
		}
	};

	const handleDeletePremise = async () => {
		const idToDelete = deleteModal.premise.id;
		if (!idToDelete) return;
		try {
			await deletePremiseTrigger(idToDelete).unwrap();
			setDeleteModal({ open: false, premise: null });
		} catch (error) {}
	};

	const handleOpenEditModal = (premise) => {
		openModal(premise, "EDIT", premise);
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
							title='No Premises Found'
							description='There are no premises in the system. Get started by adding a new one.'
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-1/4'>Title</TableHeader>
										<TableHeader className='w-1/2'>Address</TableHeader>
										<TableHeader className='w-1/4'>Description</TableHeader>
										<TableHeader className='w-1/6'>Type</TableHeader>
										<TableHeader className='w-[120px] rounded-tr-lg text-center'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[500px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{tableData.map((premise, index) => (
											<TableRow key={index}>
												<TableCell className='w-1/12 font-medium'>{index + 1}</TableCell>
												<TableCell className='w-1/4 text-center font-medium'>{premise.title}</TableCell>
												<TableCell className='w-1/2 text-center font-medium'>{premise.address}</TableCell>
												<TableCell className='w-1/4'>{premise.description}</TableCell>
												<TableCell className='w-1/6'>{premise.type}</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='gradientAmber'
															icon={Edit}
															className='h-8 w-8 rounded-lg'
															size='sm'
															onClick={() => handleOpenEditModal(premise)}
															disabled={creating || deleting}></Button>
														<Button
															variant='gradientRose'
															size='sm'
															icon={Trash2}
															className='h-8 w-8 rounded-lg'
															onClick={() =>
																setDeleteModal({
																	open: true,
																	premise,
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
				isOpen={showModal.open}
				onClose={closeModal}
				title={showModal.mode === "EDIT" ? "Edit Premise" : "Create Premise"}
				description={showModal.mode === "EDIT" ? "Update Premise details." : "Add a new Premise to the system."}
				formRef={formRef}
				loading={creating || updating}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return <PremiseForm ref={modalFormRef} premise={showModal.payload} onSubmit={handleSubmit} isLoading={creating || updating} />;
				}}
			</ModalForm>
			<ResumeModal isOpen={resumeModal.open} commands={resumeModal.resumeData} onResume={handleResumeConfirm} onDiscard={handleResumeDiscard} />
			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, premise: null })}
				onConfirm={() => handleDeletePremise()}
				title='Delete Premise'
				message={`Are you sure you want to delete "${deleteModal.premise?.title}"? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};

export default PremisesList;
