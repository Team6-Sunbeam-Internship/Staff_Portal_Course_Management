// /*eslint-disable */
// import { useState, useEffect } from "react";
// import { Trash2, Edit, List, ShieldX, Plus, X } from "lucide-react";
// const getStatusClasses = (status) => {
// 	switch (status) {
// 		case "active":
// 			return "bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-900 dark:text-green-400 dark:ring-green-800/20";
// 		case "planned":
// 			return "bg-yellow-100 text-yellow-700 ring-yellow-600/20 dark:bg-cyan-900 dark:text-cyan-400 dark:ring-cyan-800/20";
// 		case "completed":
// 			return "bg-blue-100 text-blue-700 ring-blue-600/20 dark:bg-sky-900 dark:text-sky-400 dark:ring-sky-800/20";
// 		case "inactive":
// 		default:
// 			return "bg-gray-100 text-gray-700 ring-gray-600/20 dark:bg-pink-950 dark:text-pink-500 dark:ring-rose-800/20";
// 	}
// };
// // Helper function to format dates
// const formatDate = (isoString) => {
// 	if (!isoString) return "N/A";
// 	const date = new Date(isoString);
// 	return date.toLocaleDateString("en-US", {
// 		year: "numeric",
// 		month: "short",
// 		day: "numeric",
// 	});
// };

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
// 	Badge,
// 	Button,
// 	Modal,
// 	ModalHeader,
// 	ModalBody,
// 	ConfirmDialog,
// 	EmptyState,
// 	SkeletonTable,
// 	ModalFooter,
// } from "../../../layout";
// import { BatchCycleForm } from "./BatchCycleForm";
// import { useDispatch, useSelector } from "react-redux";
// import { setBreadcrumbs, setHeaderInfo } from "../../../../store";
// import { useModal } from "../../../../providers/providerHook/useModal";
// import { selectUserRole } from "../../../../store/selectors";
// import { useFilteredMenu } from "../../../../hooks";
// import {
// 	useCreateBatchCycleMutation,
// 	useDeleteBatchCycleMutation,
// 	useGetBatchCycleQuery,
// 	useUpdateBatchCycleMutation,
// } from "../../../../store/api/infrastructure-premise-batchcycle-mgmtApi/batchCycleMgmtApi";
// import { ErrorFallback } from "../../../layout/errorBoundary";

// const BatchCycleList = () => {
// 	const dispatch = useDispatch();
// 	// get logged in user role
// 	const userRole = useSelector(selectUserRole);
// 	const { filteredMenu } = useFilteredMenu();
// 	const canAccessBatchCycleList = pathSet.has("/infrastructure-management/batch-cycles") && userRole === "ADMIN";

// 	//----------RTK QUERY HOOKS----------
// 	const { data: batchCycles = [], isLoading, isError, isFetching, error } = useGetBatchCycleQuery();
// 	const [createBatchCycle, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] =
// 		useCreateBatchCycleMutation();
// 	const [updateBatchCycle, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] =
// 		useUpdateBatchCycleMutation();
// 	const [deleteBatchCycleTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
// 		useDeleteBatchCycleMutation();

// 	const { showModal, setShowModal } = useModal();
// 	const [editingBatchCycle, setEditingBatchCycle] = useState(null);
// 	const [deleteModal, setDeleteModal] = useState({
// 		open: false,
// 		batchCycle: null,
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

// 	const cantAccessBatchCycleList = () => {
// 		return <ErrorFallback icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
// 	};

// 	useEffect(() => {
// 		dispatch(
// 			setHeaderInfo({
// 				title: "Batch Cycles",
// 				subtitle: "List of all batch cycles",
// 				action: [{ label: "Add Batch Cycle" }],
// 			})
// 		);
// 		dispatch(
// 			setBreadcrumbs([
// 				{ title: "Home", path: "/dashboard", icon: "home" },
// 				{ title: "Infrastructure Management", icon: "house-plus" },
// 				{ title: "Batch Cycles", path: "/infrastructure-management/batch-cycles", icon: "refresh-ccw-dot" },
// 			])
// 		);
// 	}, [dispatch]);

// 	const handleCreateBatchCycle = async (formData) => {
// 		try {
// 			await createBatchCycle(formData).unwrap();
// 			setShowModal(false);
// 			setEditingBatchCycle(null);
// 		} catch (error) {
// 			return;
// 		}
// 	};

// 	const handleUpdateBatchCycle = async (updatedBatchCycle) => {
// 		try {
// 			await updateBatchCycle({ id: updatedBatchCycle.id, ...updatedBatchCycle }).unwrap();
// 			setShowModal(false);
// 			setEditingBatchCycle(null);
// 		} catch (error) {}
// 	};

// 	const handleDeleteBatchCycle = async () => {
// 		const idToDelete = deleteModal.batchCycle.id;
// 		if (!idToDelete) return;
// 		try {
// 			await deleteBatchCycleTrigger(idToDelete).unwrap();
// 			setDeleteModal({ open: false, batchCycle: null });
// 		} catch (error) {}
// 	};

// 	const handleOpenEditModal = (batchCycle) => {
// 		setEditingBatchCycle(batchCycle);
// 		setShowModal(true);
// 	};

// 	if (isError) {
// 		return <ErrorFallback errorMessage={`Error: ${error.error}`} />;
// 	}

// 	return (
// 		<>
// 			<Card className={"h-[574px]"}>
// 				<CardBody>
// 					{isLoading ?
// 						<SkeletonTable />
// 					: batchCycles?.length === 0 ?
// 						<EmptyState
// 							icon={<List strokeWidth={2} className='h-12 w-12' />}
// 							title='No Batch Cycles Found'
// 							description='There are no batch cycles in the system. Get started by adding a new one.'
// 						/>
// 					:	<>
// 							<Table>
// 								<TableHead>
// 									<TableRow>
// 										<TableHeader className='w-1/10 rounded-tl-2xl'>S.No</TableHeader>
// 										<TableHeader className='w-1/4'>Title</TableHeader>
// 										<TableHeader className='w-1/6'>Description</TableHeader>
// 										<TableHeader className='w-1/4'>Dates</TableHeader>
// 										<TableHeader className='w-1/6'>Status</TableHeader>
// 										<TableHeader className='w-[120px] rounded-tr-2xl text-center'>Actions</TableHeader>
// 									</TableRow>
// 								</TableHead>
// 							</Table>
// 							<div className='scrollbar-none h-[500px] overflow-y-auto rounded-b-2xl'>
// 								<Table>
// 									<TableBody>
// 										{batchCycles.apiResponse?.map((batchCycle, index) => (
// 											<TableRow key={batchCycle.id}>
// 												<TableCell className='w-1/10'>{index + 1}</TableCell>
// 												<TableCell className='w-1/4 text-center'>{batchCycle.title}</TableCell>
// 												<TableCell className='w-1/6 text-center'>{batchCycle.year}</TableCell>
// 												<TableCell className='w-1/4'>
// 													{formatDate(batchCycle.startDate)} to {formatDate(batchCycle.endDate)}
// 												</TableCell>
// 												<TableCell className='w-1/6'>
// 													<Badge className={getStatusClasses(batchCycle.status)}>{batchCycle.status}</Badge>
// 												</TableCell>
// 												<TableCell className='w-[120px]'>
// 													<div className='flex items-center justify-center space-x-2'>
// 														<Button
// 															variant='ghost'
// 															className='cursor-pointer dark:hover:text-yellow-400'
// 															size='sm'
// 															onClick={() => handleOpenEditModal(batchCycle)}
// 															disabled={creating || deleting}>
// 															<Edit size={16} />
// 														</Button>
// 														<Button
// 															variant='ghost'
// 															size='sm'
// 															className='cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500'
// 															disabled={creating || updating}
// 															onClick={() => setDeleteModal({ open: true, batchCycle })}>
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
// 					}
// 				</CardBody>
// 			</Card>

// 			{/* Modal for Create/Edit */}
// 			<Modal
// 				isOpen={showModal}
// 				onClose={() => {
// 					setShowModal(false);
// 					setEditingBatchCycle(null);
// 				}}
// 				size='lg'>
// 				<ModalHeader
// 					title={editingBatchCycle ? "Edit Batch Cycle" : "Create Batch Cycle"}
// 					description={editingBatchCycle ? "Update batch cycle details." : "Add a new batch cycle to the system."}
// 					onClose={() => {
// 						setShowModal(false);
// 						setEditingBatchCycle(null);
// 					}}
// 				/>
// 				<ModalBody>
// 					<BatchCycleForm
// 						batchCycle={editingBatchCycle}
// 						onSubmit={editingBatchCycle ? handleUpdateBatchCycle : handleCreateBatchCycle}
// 						onCancel={() => {
// 							setShowModal(false);
// 							setEditingBatchCycle(null);
// 						}}
// 						isLoading={creating || updating}
// 					/>
// 				</ModalBody>
// 				<ModalFooter>
// 					<Button
// 						type='button'
// 						variant='gradientRose'
// 						icon={X}

// 						onClick={() => {
// 							setShowModal(false);
// 							setEditingBatchCycle(null);
// 						}}
// 						disabled={isLoading}>
// 						Cancel
// 					</Button>
// 					<Button icon={Plus} variant='gradientEmerald' type='submit' disabled={isLoading}>
// 						{isLoading ? "Saving..." : "Save"}
// 					</Button>
// 				</ModalFooter>
// 			</Modal>

// 			{/* Confirmation Dialog */}
// 			<ConfirmDialog
// 				isOpen={deleteModal.open}
// 				onClose={() => setDeleteModal({ open: false, batchCycle: null })}
// 				onConfirm={() => handleDeleteBatchCycle()}
// 				title='Delete Batch Cycle'
// 				message={`Are you sure you want to delete "${deleteModal.batchCycle?.title}"? This action cannot be undone.`}
// 				confirmText='Delete'
// 				// loading={deleting}
// 				type='danger'
// 			/>
// 		</>
// 	);
// };

// export default BatchCycleList;

/*eslint-disable */
import { Edit, List, ShieldX, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useFilteredMenu } from "../../../../hooks";
import { useModal } from "../../../../providers/providerHook/useModal";
import { setBreadcrumbs, setHeaderInfo, useGetPreservedCommandsQuery } from "../../../../store";
import {
	useCreateBatchCycleMutation,
	useDeleteBatchCycleMutation,
	useGetBatchCycleQuery,
	useUpdateBatchCycleMutation,
} from "../../../../store/api/infrastructure-premise-batchcycle-mgmtApi/batchCycleMgmtApi";
import { selectUserRole } from "../../../../store/selectors";
import { notify } from "../../../../utils/Notify";
import {
	Badge,
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
import { BatchCycleForm } from "./BatchCycleForm";

const BatchCycleList = () => {
	const dispatch = useDispatch();
	// get logged in user role
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessBatchCycleList = pathSet.has("/infrastructure-management/batch-cycles") && userRole === "ADMIN";

	const resumePending = sessionStorage.getItem("resumePending") === "true";
	const { data: preservedCommands = [] } = useGetPreservedCommandsQuery(undefined, { skip: !resumePending });

	//----------RTK QUERY HOOKS----------
	const { data: batchCycles = [], isLoading, isError, isFetching, error } = useGetBatchCycleQuery();
	const [createBatchCycle, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] =
		useCreateBatchCycleMutation();
	const [updateBatchCycle, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] =
		useUpdateBatchCycleMutation();
	const [deleteBatchCycleTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] =
		useDeleteBatchCycleMutation();
	const formRef = useRef(null);
	const { showModal, openModal, closeModal } = useModal();
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		batchCycle: null,
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
		if (command.commandName === "CREATE_BATCH_CYCLE") {
			openModal("BatchCycle", "CREATE", command.payload);
		}

		if (command.commandName === "UPDATE_BATCH_CYCLE") {
			openModal("BatchCycle", "EDIT", command.payload);
		}

		setResumeModal({ open: false, resumeData: null });
	};

	const handleResumeDiscard = () => {
		setResumeModal({ open: false, resumeData: null });
	};
	const tableData = useMemo(() => {
		const newData = [...batchCycles];
		newData?.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
		return newData;
	}, [batchCycles]);

	const isSaving = creating || updating;
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
		return <ErrorFallback icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
	};

	useEffect(() => {
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

	const handleSubmit = async (data) => {
		try {
			const { id } = data;
			if (id) {
				console.log("Update data:", data);
				await updateBatchCycle(data).unwrap();
			} else {
				await createBatchCycle(data).unwrap();
			}
			notify.success("Batch Cycle saved successfully!");
			closeModal();
		} catch (error) {
			notify.error(error?.data?.message || "Failed to save batch cycle.");
		}
	};
	const handleDeleteBatchCycle = async () => {
		const idToDelete = deleteModal.batchCycle.id;
		console.log("Id to delete:", idToDelete);
		if (!idToDelete) return;
		try {
			await deleteBatchCycleTrigger(idToDelete).unwrap();
			setDeleteModal({ open: false, batchCycle: null });
		} catch (error) {}
	};

	const handleOpenEditModal = (batchCycle) => {
		openModal(batchCycle, "EDIT", batchCycle);
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
					: tableData?.length === 0 ?
						<EmptyState
							icon={<List strokeWidth={2} className='h-12 w-12' />}
							title='No Batch Cycles Found'
							description='There are no batch cycles in the system. Get started by adding a new one.'
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow isHeader={true}>
										<TableHeader className='w-1/10 rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-1/4'>Title</TableHeader>
										<TableHeader className='w-1/6'>Description</TableHeader>
										<TableHeader className='w-1/4'>Dates</TableHeader>
										<TableHeader className='w-1/6'>Status</TableHeader>
										<TableHeader className='w-[120px] rounded-tr-2xl text-center'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[500px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{tableData.map((batchCycle, index) => (
											<TableRow key={batchCycle.id}>
												<TableCell className='w-1/10'>{index + 1}</TableCell>
												<TableCell className='w-1/4 text-center'>{batchCycle.title}</TableCell>
												<TableCell className='w-1/6 text-center'>{batchCycle.description}</TableCell>
												<TableCell className='w-1/4'>
													{formatDate(batchCycle.startDate)} to {formatDate(batchCycle.endDate)}
												</TableCell>
												<TableCell className='w-1/6'>
													<Badge className={getStatusClasses(batchCycle.status)}>{batchCycle.status}</Badge>
												</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='gradientAmber'
															className='rounded-lg'
															icon={Edit}
															onClick={() => handleOpenEditModal(batchCycle)}
															disabled={creating || deleting}></Button>
														<Button
															variant='gradientRose'
															icon={Trash2}
															className='rounded-lg'
															disabled={creating || updating}
															onClick={() => setDeleteModal({ open: true, batchCycle })}></Button>
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
				title={showModal.mode === "EDIT" ? "Edit Batch Cycle" : "Create Batch Cycle"}
				description={showModal.mode === "EDIT" ? "Update batch cycle details" : "Add a new batch cycle to the system"}
				loading={isSaving}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return <BatchCycleForm ref={modalFormRef} batchCycle={showModal.payload} onSubmit={handleSubmit} isLoading={isSaving} />;
				}}
			</ModalForm>
			<ResumeModal isOpen={resumeModal.open} commands={resumeModal.resumeData} onResume={handleResumeConfirm} onDiscard={handleResumeDiscard} />
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
