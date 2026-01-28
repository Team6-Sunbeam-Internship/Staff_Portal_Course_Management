import { Edit, List, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import { useFilteredMenu } from "../../../../hooks/index.js";
import { useModal } from "../../../../providers/providerHook/useModal";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateMenuItemMutation,
	useDeleteMenuItemMutation,
	useGetAllMenuItemsQuery,
	useUpdateMenuItemMutation,
} from "../../../../store";
import { selectUserRole } from "../../../../store/selectors/index.js";
import { notify } from "../../../../utils/Notify";
import { ErrorFallback } from "../../../layout/errorBoundary";
import { ModalForm } from "../../../layout/modals/ModalForm";
import { MenuForm } from "./MenuForm.jsx";

const MenuManagement = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessMenuManagement = pathSet.has("/system-administration/menus") && userRole === "ADMIN";
	//------------------------------RTK QUERY HOOKS------------------------------
	const { data: menuItems = [], isLoading: isLoadingMenuItems, isError: isErrorMenuItems, error: menuItemsError } = useGetAllMenuItemsQuery();

	const [create, { isLoading: creating, isError: isCreatingError, error: creatingError }] = useCreateMenuItemMutation();
	const [update, { isLoading: updating, isError: isUpdatingError, error: updatingError }] = useUpdateMenuItemMutation();
	const [deleteMenuItemTrigger, { isLoading: deleting, isError: isDeletingError, error: deletingError }] = useDeleteMenuItemMutation();
	console.log("Menu Items: ", menuItems);
	const parentKeyOptions = useMemo(
		() => [
			{
				value: "",
				label: "Root/Top Level Menu Item (No Parent)",
			},
			...menuItems.map((menuItem) => ({
				value: menuItem.fullPathKey,
				label: `${menuItem.title} (${menuItem.fullPathKey})`,
			})),
		],
		[menuItems]
	);

	const formRef = useRef(null);
	const { showModal, openModal, closeModal } = useModal();
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		menuItem: null,
	});

	useEffect(() => {
		if (creating) {
			console.log("Notification: Menu Item created successfully!");
		}
		if (isCreatingError) {
			console.log("Notification: Failed to create Menu Item.");
		}
		if (updating) {
			console.log("Notification: Menu Item updated successfully!");
		}
		if (isUpdatingError) {
			console.log("Notification: Failed to update Menu Item.");
		}
		if (deleting) {
			console.log("Notification: Menu Item deleted successfully!");
		}
		if (isDeletingError) {
			console.log("Notification: Failed to delete Menu Item.");
		}
		if (creatingError) {
			console.log("Notification: Failed to create Menu Item.");
		}
		if (updatingError) {
			console.log("Notification: Failed to update Menu Item.");
		}
		if (deletingError) {
			console.log("Notification: Failed to delete Menu Item.");
		}
	}, [creating, isCreatingError, updating, isUpdatingError, deleting, isDeletingError, creatingError, updatingError, deletingError]);

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Menu Items",
				subtitle: "List of menu items in the application",
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

	if (!canAccessMenuManagement) {
		return <ErrorFallback errorMessage='You are not allowed to view this component.' />;
	}
	if (isErrorMenuItems) {
		return <EmptyState icon={<ShieldX size={50} />} title='Access Denied' description='You do not have permission to access this page.' />;
	}
	const handleSubmit = async (data) => {
		const { id, payload } = data;
		try {
			if (showModal.mode === "EDIT") {
				await update({ id, ...payload }).unwrap();
				notify.success(`Menu Item "${payload.title}" updated successfully!`);
			} else {
				await create(payload).unwrap();
				notify.success(`Menu Item "${payload.title}" created successfully!`);
			}
			closeModal();
		} catch (error) {
			notify.error(error?.data?.message || "Failed to save menu item.");
		}
	};

	const handleDeleteMenuItem = async () => {
		const idToDelete = deleteModal.menuItem.id;
		if (!idToDelete) return;
		try {
			await deleteMenuItemTrigger(idToDelete).unwrap();
			setDeleteModal({ open: false, menuItem: null });
			notify.success(`Menu Item "${deleteModal.menuItem.title}" deleted successfully!`);
		} catch (err) {
			notify.error(err?.data?.message || "Failed to delete menu item.");
		}
	};

	const handleOpenEditModal = (menuItem) => {
		openModal("MENU_ITEM", "EDIT", menuItem);
	};

	return (
		<>
			<Card className={"h-[574px]"}>
				<CardBody>
					{isLoadingMenuItems ?
						<SkeletonTable />
					: menuItems?.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title='No Menu Items Found'
							description='There are no menu item in the system. Get started by adding a new one.'
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-[100px] rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-1/6'>Title</TableHeader>
										<TableHeader className='w-1/4'>Description</TableHeader>
										<TableHeader className='w-1/3'>Path</TableHeader>
										<TableHeader className='w-[120px] rounded-tr-lg text-center'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[500px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{menuItems?.map((menuItem, index) => (
											<TableRow key={menuItem.id}>
												<TableCell className='w-[100px] font-medium'>{index + 1}</TableCell>
												<TableCell className='w-1/6 text-center font-medium'>{menuItem.title}</TableCell>
												<TableCell className='w-1/4 text-center font-medium'>{menuItem.description}</TableCell>
												<TableCell className='w-1/3'>{menuItem.path || "#"}</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='gradientAmber'
															icon={Edit}
															className='h-6 w-6 rounded-lg'
															size='sm'
															onClick={() => handleOpenEditModal(menuItem)}
														/>
														<Button
															variant='gradientRose'
															icon={Trash2}
															size='sm'
															className='h-6 w-6 rounded-lg'
															onClick={() =>
																setDeleteModal({
																	open: true,
																	menuItem,
																})
															}></Button>
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
				isOpen={showModal.open && showModal.entity === "MENU_ITEM"}
				onClose={closeModal}
				title={showModal.mode === "EDIT" ? "Edit Menu Item" : "Create Menu Item"}
				description={showModal.mode === "EDIT" ? "Update menu item details" : "Add a new menu item to the system"}
				loading={creating || updating}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<MenuForm
							ref={modalFormRef}
							menuItem={showModal.payload}
							availableParentKeys={parentKeyOptions}
							onSubmit={handleSubmit}
							isLoading={creating || updating}
						/>
					);
				}}
			</ModalForm>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, menuItem: null })}
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
