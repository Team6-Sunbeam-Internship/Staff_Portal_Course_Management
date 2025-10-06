/*eslint-disable*/
import { useState, useEffect } from "react";
import { Trash2, Edit, List, ShieldX } from "lucide-react";
// --- COMMON COMPONENTS ---
import {
	Card,
	CardBody,
	Table,
	TableHead,
	TableHeader,
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
} from "../../../layout";
import { PremiseForm } from "../premise";
import { useDispatch, useSelector } from "react-redux";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreatePremiseMutation,
	useDeletePremiseMutation,
	useGetPremisesQuery,
	useUpdatePremiseMutation,
} from "../../../../store";
import { useModal } from "../../../../providers/providerHook/useModal";
import { selectUserRole } from "../../../../store/selectors";
import { useFilteredMenu } from "../../../../hooks";
import { ErrorFallback } from "../../../layout/errorBoundary";

const PremisesList = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { filteredMenu = [] } = useFilteredMenu();
	const canAccessPremiseList = filteredMenu.includes("/infrastructure-management/batch-cycles") && userRole === "ADMIN";
	//----------RTK QUERY HOOKS----------
	const { data: premises = [], isLoading, isError, isFetching, error } = useGetPremisesQuery();
	const [createPremise, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] = useCreatePremiseMutation();
	const [updatePremise, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] = useUpdatePremiseMutation();
	const [deletePremiseTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
		useDeletePremiseMutation();
	
	const { showModal, setShowModal } = useModal();
	const [editingPremise, setEditingPremise] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		premise: null,
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
	const handleCreatePremise = async (formData) => {
		try {
			await createPremise(formData).unwrap();
			setShowModal(false);
			setEditingPremise(null);
		} catch (error) {
			return;
		}
	};

	const handleUpdatePremise = async (updatedPremise) => {
		try {
			await updatePremise({ id: updatedPremise.id, ...updatedPremise }).unwrap();
			setShowModal(false);
			setEditingPremise(null);
		} catch (error) {}
	};

	const handleDeletePremise = async () => {
		const idToDelete = deleteModal.Premise.id;
		if (!idToDelete) return;
		try {
			await deletePremiseTrigger(idToDelete).unwrap();
			setDeleteModal({ open: false, Premise: null });
		} catch (error) {}
	};

	const handleOpenEditModal = (Premise) => {
		setEditingPremise(Premise);
		setShowModal(true);
	};
	if (isError) {
		return <ErrorFallback errorMessage={`Error: ${error.error}`} />;
	}
	return (
		<>
			<Card className={"h-[574px]"}>
				<CardBody>
					{isLoading ? (
						<SkeletonTable />
					) : premises.length === 0 ? (
						<EmptyState
							icon={<List className='w-12 h-12' />}
							title='No Premises Found'
							description='There are no premises in the system. Get started by adding a new one.'
						/>
					) : (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-1/12 rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-1/4'>Title</TableHeader>
										<TableHeader className='w-1/2'>Address</TableHeader>
										<TableHeader className='w-1/4'>Description</TableHeader>
										<TableHeader className='w-1/6'>Type</TableHeader>
										<TableHeader className='text-center rounded-tr-lg w-[120px]'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='h-[500px] rounded-b-2xl overflow-y-auto scrollbar-none'>
								<Table>
									<TableBody>
										{premises.map((premise) => (
											<TableRow key={premise.id}>
												<TableCell className='font-medium w-1/12'>{premise.id}</TableCell>
												<TableCell className='font-medium text-center w-1/4'>{premise.title}</TableCell>
												<TableCell className='font-medium text-center w-1/2'>{premise.address}</TableCell>
												<TableCell className='w-1/4'>{premise.description}</TableCell>
												<TableCell className='w-1/6'>{premise.type}</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='ghost'
															className='cursor-pointer dark:hover:text-yellow-400'
															size='sm'
															onClick={() => handleOpenEditModal(premise)}
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
																	premise,
																})
															}
															disabled={creating || updating}>
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

			{/* Modal for Create/Edit */}
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setEditingPremise(null);
				}}
				size='lg'>
				<ModalHeader
					title={editingPremise ? "Edit Batch Cycle" : "Create Batch Cycle"}
					subtitle={editingPremise ? "Update batch cycle details." : "Add a new batch cycle to the system."}
					onClose={() => {
						setShowModal(false);
						setEditingPremise(null);
					}}
				/>
				<ModalBody>
					<PremiseForm
						premise={editingPremise}
						onSubmit={editingPremise ? handleUpdatePremise : handleCreatePremise}
						onCancel={() => {
							setShowModal(false);
							setEditingPremise(null);
						}}
						isLoading={creating || updating}
					/>
				</ModalBody>
			</Modal>

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
