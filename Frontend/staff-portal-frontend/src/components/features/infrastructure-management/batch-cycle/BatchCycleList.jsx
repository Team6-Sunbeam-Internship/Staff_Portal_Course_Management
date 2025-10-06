/*eslint-disable */
import { useState, useEffect } from "react";
import { Trash2, Edit, List, ShieldX } from "lucide-react";
const getStatusClasses = (status) => {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-900 dark:text-green-400 dark:ring-green-800/20";
		case "planned":
			return "bg-yellow-100 text-yellow-700 ring-yellow-600/20 dark:bg-cyan-900 dark:text-cyan-400 dark:ring-cyan-800/20";
		case "completed":
			return "bg-blue-100 text-blue-700 ring-blue-600/20 dark:bg-sky-900 dark:text-sky-400 dark:ring-sky-800/20";
		case "inactive":
		default:
			return "bg-gray-100 text-gray-700 ring-gray-600/20 dark:bg-pink-950 dark:text-pink-500 dark:ring-rose-800/20";
	}
};
// Helper function to format dates
const formatDate = (isoString) => {
	if (!isoString) return "N/A";
	const date = new Date(isoString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

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
	Badge,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ConfirmDialog,
	EmptyState,
	SkeletonTable,
} from "../../../layout";
import { BatchCycleForm } from "./BatchCycleForm";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs, setHeaderInfo } from "../../../../store";
import { useModal } from "../../../../providers/providerHook/useModal";
import { selectUserRole } from "../../../../store/selectors";
import { useFilteredMenu } from "../../../../hooks";
import {
	useCreateBatchCycleMutation,
	useDeleteBatchCycleMutation,
	useGetBatchCycleQuery,
	useUpdateBatchCycleMutation,
} from "../../../../store/api/infrastructure-premise-batchcycle-mgmtApi/batchCycleMgmtApi";
import { ErrorFallback } from "../../../layout/errorBoundary";

const BatchCycleList = () => {
	const dispatch = useDispatch();
	// get logged in user role
	const userRole = useSelector(selectUserRole);
	const { filteredMenu } = useFilteredMenu();
	const canAccessBatchCycleList = filteredMenu.includes("/infrastructure-management/batch-cycles") && userRole === "ADMIN";

	const { data: batchCycles = [], isLoading, isError, isFetching, error } = useGetBatchCycleQuery();
	
	const [createBatchCycle, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] =
		useCreateBatchCycleMutation();
	const [updateBatchCycle, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] =
		useUpdateBatchCycleMutation();
	const [deleteBatchCycleTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
		useDeleteBatchCycleMutation();

	const { showModal, setShowModal } = useModal();
	const [editingBatchCycle, setEditingBatchCycle] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		batchCycle: null,
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

	const cantAccessBatchCycleList = () => {
		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
	};
	useEffect(() => {
		if (!canAccessBatchCycleList) return cantAccessBatchCycleList();
		dispatch(
			setHeaderInfo({
				title: "Batch Cycles",
				subtitle: "List of all batch cycles",
				action: [{ label: "Add Batch Cycle" }],
			})
		);
		dispatch(
			setBreadcrumbs([
				{ title: "Home", path: "/dashboard", icon: "home" },
				{ title: "Infrastructure Management", icon: "house-plus" },
				{ title: "Batch Cycles", path: "/infrastructure-management/batch-cycles", icon: "refresh-ccw-dot" },
			])
		);
	}, [dispatch]);

	const handleCreateBatchCycle = async (formData) => {
		try {
			await createBatchCycle(formData).unwrap();
			setShowModal(false);
			setEditingBatchCycle(null);
		} catch (error) {
			return;
		}
	};

	const handleUpdateBatchCycle = async (updatedBatchCycle) => {
		try {
			await updateBatchCycle({ id: updatedBatchCycle.id, ...updatedBatchCycle }).unwrap();
			setShowModal(false);
			setEditingBatchCycle(null);
		} catch (error) {}
	};

	const handleDeleteBatchCycle = async () => {
		const idToDelete = deleteModal.batchCycle.id;
		if (!idToDelete) return;
		try {
			await deleteBatchCycleTrigger(idToDelete).unwrap();
			setDeleteModal({ open: false, batchCycle: null });
		} catch (error) {}
	};

	const handleOpenEditModal = (batchCycle) => {
		setEditingBatchCycle(batchCycle);
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
					) : batchCycles.length === 0 ? (
						<EmptyState
							icon={<List stroke='2px' className='w-12 h-12' />}
							title='No Batch Cycles Found'
							description='There are no batch cycles in the system. Get started by adding a new one.'
						/>
					) : (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-1/10 rounded-tl-2xl '>S.No</TableHeader>
										<TableHeader className='w-1/4'>Title</TableHeader>
										<TableHeader className='w-1/6'>Year</TableHeader>
										<TableHeader className='w-1/4'>Dates</TableHeader>
										<TableHeader className='w-1/6'>Status</TableHeader>
										<TableHeader className='text-center rounded-tr-2xl w-[120px]'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='h-[500px] rounded-b-2xl overflow-y-auto scrollbar-none'>
								<Table>
									<TableBody>
										{batchCycles.map((batchCycle, index) => (
											<TableRow key={batchCycle.id}>
												<TableCell className=' w-1/10'>{index + 1}</TableCell>
												<TableCell className=' text-center w-1/4'>{batchCycle.title}</TableCell>
												<TableCell className=' text-center w-1/6'>{batchCycle.year}</TableCell>
												<TableCell className='w-1/4'>
													{formatDate(batchCycle.startDate)} to {formatDate(batchCycle.endDate)}
												</TableCell>
												<TableCell className='w-1/6'>
													<Badge className={getStatusClasses(batchCycle.status)}>{batchCycle.status}</Badge>
												</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='ghost'
															className='cursor-pointer dark:hover:text-yellow-400'
															size='sm'
															onClick={() => handleOpenEditModal(batchCycle)}
															disabled={creating || deleting}>
															<Edit size={16} />
														</Button>
														<Button
															variant='ghost'
															size='sm'
															className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
															disabled={creating || updating}
															onClick={() => setDeleteModal({ open: true, batchCycle })}>
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
					setEditingBatchCycle(null);
				}}
				size='lg'>
				<ModalHeader
					title={editingBatchCycle ? "Edit Batch Cycle" : "Create Batch Cycle"}
					subtitle={editingBatchCycle ? "Update batch cycle details." : "Add a new batch cycle to the system."}
					onClose={() => {
						setShowModal(false);
						setEditingBatchCycle(null);
					}}
				/>
				<ModalBody>
					<BatchCycleForm
						batchCycle={editingBatchCycle}
						onSubmit={editingBatchCycle ? handleUpdateBatchCycle : handleCreateBatchCycle}
						onCancel={() => {
							setShowModal(false);
							setEditingBatchCycle(null);
						}}
						isLoading={creating || updating}
					/>
				</ModalBody>
			</Modal>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, batchCycle: null })}
				onConfirm={() => handleDeleteBatchCycle()}
				title='Delete Batch Cycle'
				message={`Are you sure you want to delete "${deleteModal.batchCycle?.title}"? This action cannot be undone.`}
				confirmText='Delete'
				// loading={deleting}
				type='danger'
			/>
		</>
	);
};

export default BatchCycleList;
