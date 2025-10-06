import { useState, useEffect, use } from "react";
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
	CustomSelect,
	Badge,
} from "../../../layout";
import { useDispatch } from "react-redux";

import {
	setBreadcrumbs,
	setHeaderInfo,
	useGetAllStaffAccessMenuQuery,
	useGetAllStaffQuery,
	useGetMenuItemsQuery,
} from "../../../../store";
import { useModal } from "../../../../providers/providerHook/useModal";
import { ErrorFallback } from "../../../layout/errorBoundary";
import { PremiseForm } from "../../infrastructure-management";

const StaffMenuException = () => {
	const [creating, setCreating] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [deleting, setDeleting] = useState(false);
	const { showModal, setShowModal } = useModal();
	const [
		editingStaffMenuAccessException,
		setEditingStaffMenuAccessException,
	] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		menu: null,
	});
	const [filters, setFilters] = useState({
		role: "",
		staff: "",
		menuItem: "",
		exceptionType: "",
	});
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};
	// Get all staff menu access exceptions
	const {
		data: staffMenuAccessExceptions,
		isLoading: isLoadingStaffMenuAccessExceptions,
		isError: isErrorStaffMenuAccessExceptions,
		error: staffMenuAccessExceptionsError,
	} = useGetAllStaffAccessMenuQuery();
	// Get all staff
	const {
		data: allStaff,
		isLoading: isLoadingAllStaff,
		isError: isErrorAllStaff,
		error: allStaffError,
	} = useGetAllStaffQuery();
	const {
		data: menuItems,
		isLoading: isLoadingMenuItems,
		isError: isErrorMenuItems,
		error: menuItemsError,
	} = useGetMenuItemsQuery();
	const isLoading =
		isLoadingStaffMenuAccessExceptions ||
		isLoadingAllStaff ||
		isLoadingMenuItems;
	const isError =
		isErrorStaffMenuAccessExceptions || isErrorAllStaff || isErrorMenuItems;
	const dispatch = useDispatch();
	useEffect(() => {
		console.log("Staff", allStaff);
		console.log("Menu Items", menuItems);
		console.log("Staff Menu Exceptions", staffMenuAccessExceptions);
		dispatch(
			setHeaderInfo({
				title: "Staff Menu Exceptions",
				subtitle: "List of staff menu exceptions in the application",
				action: [
					{
						label: "Add Staff Menu Exceptions",
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
					path: "/system-administration/staff-menu-access",
					icon: "house-plug",
				},
			])
		);
	}, [dispatch]);

	if (isErrorStaffMenuAccessExceptions) {
		return (
			<ErrorFallback
				errorMessage={staffMenuAccessExceptionsError.message}
			/>
		);
	}
	const handleCreateStaffMenuAccessException = async (newMenuItem) => {
		setCreating(true);
	};

	const handleUpdateStaffMenuAccessException = async (updatedMenuItem) => {
		setUpdating(true);
	};

	const handleDeleteStaffMenuAccessException = async () => {
		setDeleting(true);
	};

	const handleOpenEditModal = (Premise) => {
		setEditingStaffMenuAccessException(Premise);
		setShowModal(true);
	};
	const roleOptions = [
		{
			label: "Admin",
			value: "ADMIN",
		},
		{
			label: "Course Coordinator",
			value: "COURSE_COORDINATOR",
		},
		{
			label: "General User",
			value: "GENERAL_USER",
		},
	];

	const staffOptions = [{ value: "", label: "All Staff" }];
	if (allStaff) {
		staffOptions.push(
			...allStaff.map((staff) => ({ value: staff.staffId, label: staff.firstName + " " + staff.lastName }))
		);
	}
	const menuOptions = [{ value: "", label: "All Menu Items" }];
	if (menuItems) {
		menuOptions.push(
			...menuItems.map((menuItem) => ({
				value: menuItem.menuItemId,
				label: menuItem.title,
			}))
		);
	}
	const exceptionTypeOptions = [
		{
			label: "Allow",
			value: "ALLOWED",
		},
		{
			label: "Block",
			value: "BLOCKED",
		},
	];
	const getStatusClasses = (status) => {
		switch (status) {
			case "ALLOWED":
				return "bg-green-100 text-green-700 ring-green-600/20 dark:bg-green-900 dark:text-green-400 dark:ring-green-800/20";
			case "BLOCKED":
				return "bg-red-100 text-red-700 ring-red-600/20 dark:bg-cyan-900 dark:text-cyan-400 dark:ring-cyan-800/20";
			default:
				return "bg-gray-100 text-gray-700 ring-gray-600/20 dark:bg-pink-950 dark:text-pink-500 dark:ring-rose-800/20";
		}
	};
	if (isError) {
		return (
			<ErrorFallback
				errorMessage={staffMenuAccessExceptionsError.message}
			/>
		);
	}
	return (
		<>
			<div className='grid grid-cols-6 gap-4 mb-4'>
				<CustomSelect
					value={filters.role}
					onChange={(e) => handleFilterChange("role", e.target.value)}
					options={roleOptions}
				/>
				<CustomSelect
					value={filters.staff}
					onChange={(e) =>
						handleFilterChange("staff", e.target.value)
					}
					options={staffOptions}
				/>
				<CustomSelect
					value={filters.menuItem}
					onChange={(e) =>
						handleFilterChange("menuItem", e.target.value)
					}
					options={menuOptions}
				/>
				<CustomSelect
					value={filters.exceptionType}
					onChange={(e) =>
						handleFilterChange("exceptionType", e.target.value)
					}
					options={exceptionTypeOptions}
				/>
			</div>
			<Card className={"h-[574px]"}>
				<CardBody>
					{isLoading ? (
						<SkeletonTable />
					) : staffMenuAccessExceptions.length === 0 ? (
						<EmptyState
							icon={<List className='w-12 h-12' />}
							title='No Staff Menu Exceptions'
							description='There are no staff menu exceptions. Get started by adding a new one.'
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
											Name
										</TableHeader>
										<TableHeader className='w-1/4'>
											Menu Item
										</TableHeader>
										<TableHeader className='w-1/3'>
											Role
										</TableHeader>
										<TableHeader className='w-1/3'>
											Exception Type
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
										{staffMenuAccessExceptions.map(
											(
												staffMenuAccessException,
												index
											) => (
												<TableRow
													key={
														staffMenuAccessException.id
													}
												>
													<TableCell className='font-medium w-[100px]'>
														{index + 1}
													</TableCell>
													<TableCell className='font-medium text-center w-1/6'>
														{staffMenuAccessException.firstName +
															" " +
															staffMenuAccessException.lastName}
													</TableCell>
													<TableCell className='font-medium text-center w-1/4'>
														{
															staffMenuAccessException.menuItemTitle
														}
													</TableCell>
													<TableCell className='font-medium text-center w-1/4'>
														{
															staffMenuAccessException.staffRoleName
														}
													</TableCell>
													<TableCell className='w-1/3'>
														<Badge
															className={getStatusClasses(
																staffMenuAccessException.status
															)}
														>
															{
																staffMenuAccessException.status
															}
														</Badge>
													</TableCell>
													<TableCell className='w-[120px]'>
														<div className='flex items-center justify-center space-x-2'>
															<Button
																variant='ghost'
																className='cursor-pointer dark:hover:text-yellow-400'
																size='sm'
																onClick={() =>
																	handleOpenEditModal(
																		staffMenuAccessException
																	)
																}
															>
																<Edit
																	size={16}
																/>
															</Button>
															<Button
																variant='ghost'
																size='sm'
																className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
																onClick={() =>
																	setDeleteModal(
																		{
																			open: true,
																			staffMenuAccessException,
																		}
																	)
																}
															>
																<Trash2
																	size={16}
																/>
															</Button>
														</div>
													</TableCell>
												</TableRow>
											)
										)}
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
					setEditingStaffMenuAccessException(null);
				}}
				size='lg'
			>
				<ModalHeader
					title={
						editingStaffMenuAccessException
							? "Edit Batch Cycle"
							: "Create Batch Cycle"
					}
					subtitle={
						editingStaffMenuAccessException
							? "Update batch cycle details."
							: "Add a new batch cycle to the system."
					}
					onClose={() => {
						setShowModal(false);
						setEditingStaffMenuAccessException(null);
					}}
				/>
				<ModalBody>
					<PremiseForm
						premise={editingStaffMenuAccessException}
						onSubmit={
							editingStaffMenuAccessException
								? handleUpdateStaffMenuAccessException
								: handleCreateStaffMenuAccessException
						}
						onCancel={() => {
							setShowModal(false);
							setEditingStaffMenuAccessException(null);
						}}
						isLoading={creating || updating}
					/>
				</ModalBody>
			</Modal>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, Premise: null })}
				onConfirm={() => handleDeleteStaffMenuAccessException()}
				title='Delete Menu Item'
				message={`Are you sure you want to delete "${deleteModal.menuItem?.title}"? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};

export default StaffMenuException;
