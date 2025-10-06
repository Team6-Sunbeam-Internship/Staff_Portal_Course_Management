import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, List } from "lucide-react";

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
import { useDispatch } from "react-redux";

import {
	setBreadcrumbs,
	setHeaderInfo,
	useGetMenuItemsQuery,
} from "../../../../store";
import { useModal } from "../../../../providers/providerHook/useModal";
import { ErrorFallback } from "../../../layout/errorBoundary";
import { PremiseForm } from "../../infrastructure-management";

const MenuManagement = () => {
	const [creating, setCreating] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const { showModal, setShowModal } = useModal();
	const [editingMenuItems, setEditingMenuItems] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		menu: null,
	});
	const {
		data: menuItems,
		isLoading: isLoadingMenuItems,
		isError: isErrorMenuItems,
		error: menuItemsError,
	} = useGetMenuItemsQuery();
	const dispatch = useDispatch();
	useEffect(() => {
		console.log("MenuItems:", menuItems);
		dispatch(
			setHeaderInfo({
				title: "Menu Items",
				subtitle: "List of menu items in the application",
				action: [
					{
						label: "Add Menu Item",
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
					title: "System Administration",
					icon: "house-plus",
				},
				{
					title: "Menu Management",
					path: "/system-administration/menu-items",
					icon: "house-plug",
				},
			])
		);
	}, [dispatch]);

	if (isErrorMenuItems) {
		return <ErrorFallback errorMessage={menuItemsError.message} />;
	}
	const handleCreateMenuItem = async (newMenuItem) => {
		setCreating(true);
	};

	const handleUpdateMenuItem = async (updatedMenuItem) => {
		setUpdating(true);
	};

	const handleDeleteMenuItem = async () => {
		setDeleting(true);
	};

	const handleOpenEditModal = (Premise) => {
		setEditingMenuItems(Premise);
		setShowModal(true);
	};

	return (
		<>
			<Card className={"h-[574px]"}>
				<CardBody>
					{isLoadingMenuItems ? (
						<SkeletonTable />
					) : menuItems.length === 0 ? (
						<EmptyState
							icon={<List className='w-12 h-12' />}
							title='No Menu Items Found'
							description='There are no menu item in the system. Get started by adding a new one.'
							action={
								<Button onClick={() => setShowModal(true)}>
									<Plus className='h-4 w-4 mr-2' />
									Create Menu Item
								</Button>
							}
						/>
					) : (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-[100px] rounded-tl-2xl'>
											S.No
										</TableHeader>
										<TableHeader className='w-1/6'>
											Title
										</TableHeader>
										<TableHeader className='w-1/4'>
											Description
										</TableHeader>
										<TableHeader className='w-1/3'>
											Path
										</TableHeader>
										<TableHeader className='text-center rounded-tr-lg w-[120px]'>
											Actions
										</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='h-[500px] rounded-b-2xl overflow-y-auto scrollbar-none'>
								<Table>
									<TableBody>
										{menuItems.map((menuItem, index) => (
											<TableRow key={menuItem.id}>
												<TableCell className='font-medium w-[100px]'>
													{index + 1}
												</TableCell>
												<TableCell className='font-medium text-center w-1/6'>
													{menuItem.title}
												</TableCell>
												<TableCell className='font-medium text-center w-1/4'>
													{menuItem.description}
												</TableCell>
												<TableCell className='w-1/3'>
													{menuItem.path || "#"}
												</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='ghost'
															className='cursor-pointer dark:hover:text-yellow-400'
															size='sm'
															onClick={() =>
																handleOpenEditModal(
																	menuItem
																)
															}
														>
															<Edit size={16} />
														</Button>
														<Button
															variant='ghost'
															size='sm'
															className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
															onClick={() =>
																setDeleteModal({
																	open: true,
																	menuItem,
																})
															}
														>
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
					setEditingMenuItems(null);
				}}
				size='lg'
			>
				<ModalHeader
					title={
						editingMenuItems
							? "Edit Batch Cycle"
							: "Create Batch Cycle"
					}
					subtitle={
						editingMenuItems
							? "Update batch cycle details."
							: "Add a new batch cycle to the system."
					}
					onClose={() => {
						setShowModal(false);
						setEditingMenuItems(null);
					}}
				/>
				<ModalBody>
					<PremiseForm
						premise={editingMenuItems}
						onSubmit={
							editingMenuItems
								? handleUpdateMenuItem
								: handleCreateMenuItem
						}
						onCancel={() => {
							setShowModal(false);
							setEditingMenuItems(null);
						}}
						isLoading={creating || updating}
					/>
				</ModalBody>
			</Modal>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, Premise: null })}
				onConfirm={() => handleDeleteMenuItem()}
				title='Delete Menu Item'
				message={`Are you sure you want to delete "${deleteModal.menuItem?.title}"? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};

export default MenuManagement;
