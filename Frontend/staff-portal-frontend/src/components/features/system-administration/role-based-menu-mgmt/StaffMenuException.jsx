import { List, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// --- COMMON COMPONENTS ---
import { useDispatch, useSelector } from "react-redux";
import {
	Badge,
	Button,
	Card,
	CardBody,
	ConfirmDialog,
	CustomSelect,
	EmptyState,
	SkeletonTable,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../../../layout";

import { useFilteredMenu } from "../../../../hooks";
import { useModal } from "../../../../providers/providerHook/useModal";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateUpdateStaffMenuAccessMutation,
	useDeleteStaffMenuAccessMutation,
	useGetAllMenuItemsQuery,
	useGetAllRoleBasedMenuQuery,
	useGetAllStaffAccessMenuQuery,
	useGetAllStaffQuery,
} from "../../../../store";
import { selectUserRole } from "../../../../store/selectors";
import { ErrorFallback } from "../../../layout/errorBoundary";
import { ModalForm } from "../../../layout/modals/ModalForm";
import { StaffMenuAccessExceptionForm } from "./StaffMenuAccessExceptionForm";

const StaffMenuException = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessStaffMenuException = pathSet.has("/system-administration/menus") && userRole === "ADMIN";

	const formRef = useRef(null);
	const { showModal, openModal, closeModal } = useModal();
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		staffMenuAccessException: null,
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
		data: staffMenuAccessExceptions = [],
		isLoading: isLoadingStaffMenuAccessExceptions,
		isError: isErrorStaffMenuAccessExceptions,
		error: staffMenuAccessExceptionsError,
	} = useGetAllStaffAccessMenuQuery();
	// Get all staff
	const { data: allStaff, isLoading: isLoadingAllStaff, isError: isErrorAllStaff, error: allStaffError } = useGetAllStaffQuery();
	const {
		data: roleBasedMenuItems,
		isLoading: isLoadingRoleBasedMenuItems,
		isError: isErrorRoleBasedMenuItems,
		error: roleBasedMenuItemsError,
	} = useGetAllRoleBasedMenuQuery();
	const { data: menuItems, isLoading: isLoadingMenuItems, isError: isErrorMenuItems, error: menuItemsError } = useGetAllMenuItemsQuery();
	const [createUpdateStaffMenuAccess, { isLoading: isCreating }] = useCreateUpdateStaffMenuAccessMutation();
	const [deleteStaffMenuAccess, { isLoading: isDeleting }] = useDeleteStaffMenuAccessMutation();

	const isLoading = isLoadingStaffMenuAccessExceptions || isLoadingAllStaff || isLoadingMenuItems;
	const isError = isErrorStaffMenuAccessExceptions || isErrorAllStaff || isErrorMenuItems;

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Staff Menu Exceptions",
				subtitle: "List of staff menu exceptions in the application",
				action: [{
					label: "Add Staff Exception",
					entity: "STAFF_MENU_EXCEPTION",
					mode: "CREATE",
				}],
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
		return <ErrorFallback errorMessage={staffMenuAccessExceptionsError?.message} />;
	}
	const handleCreateStaffMenuAccessException = async (staffMenuAccessException) => {
		try {
			await createUpdateStaffMenuAccess(staffMenuAccessException).unwrap();
			closeModal();
		} catch (error) {}
	};

	const handleDeleteStaffMenuAccessException = async () => {
		const idToDelete = deleteModal.staffMenuAccessException.id;
		if (!idToDelete) return;
		try {
			await deleteStaffMenuAccess(idToDelete).unwrap();
			setDeleteModal({ open: false, staffMenuAccessException: null });
		} catch (error) {}
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
		staffOptions.push(...allStaff.map((staff) => ({ value: staff.staffId, label: staff.firstName + " " + staff.lastName })));
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
		return <ErrorFallback errorMessage={staffMenuAccessExceptionsError.message} />;
	}
	return (
		<>
			<div className='mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div className='grid flex-1 grid-cols-1 gap-4 md:grid-cols-4'>
					<CustomSelect value={filters.role} onChange={(e) => handleFilterChange("role", e.target.value)} options={roleOptions} />
					<CustomSelect value={filters.staff} onChange={(e) => handleFilterChange("staff", e.target.value)} options={staffOptions} />
					<CustomSelect value={filters.menuItem} onChange={(e) => handleFilterChange("menuItem", e.target.value)} options={menuOptions} />
					<CustomSelect
						value={filters.exceptionType}
						onChange={(e) => handleFilterChange("exceptionType", e.target.value)}
						options={exceptionTypeOptions}
					/>
				</div>
			</div>
			<Card className={"h-[574px]"}>
				<CardBody>
					{isLoading ?
						<SkeletonTable />
					: staffMenuAccessExceptions?.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title='No Staff Menu Exceptions'
							description='There are no staff menu exceptions. Get started by adding a new one.'
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-[100px] rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-1/6'>Name</TableHeader>
										<TableHeader className='w-1/4'>Menu Item</TableHeader>
										<TableHeader className='w-1/3'>Role</TableHeader>
										<TableHeader className='w-1/3'>Access</TableHeader>
										<TableHeader className='w-[120px] rounded-tr-lg text-center'>Action</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[500px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{staffMenuAccessExceptions?.map((staffMenuAccessException, index) => (
											<TableRow key={staffMenuAccessException.id}>
												<TableCell className='w-[100px] font-medium'>{index + 1}</TableCell>
												<TableCell className='w-1/6 text-center font-medium'>
													{staffMenuAccessException.firstName + " " + staffMenuAccessException.lastName}
												</TableCell>
												<TableCell className='w-1/4 text-center font-medium'>{staffMenuAccessException.menuItemTitle}</TableCell>
												<TableCell className='w-1/4 text-center font-medium'>{staffMenuAccessException.staffRoleName}</TableCell>
												<TableCell className='w-1/3'>
													<Badge className={getStatusClasses(staffMenuAccessException.status)}>{staffMenuAccessException.status}</Badge>
												</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='ghost'
															size='sm'
															className='cursor-pointer text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500'
															onClick={() =>
																setDeleteModal({
																	open: true,
																	staffMenuAccessException,
																})
															}>
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
					}
				</CardBody>
			</Card>

			{/* Modal for Create/Edit */}
			<ModalForm
				isOpen={showModal.open && showModal.entity === "STAFF_MENU_EXCEPTION"}
				onClose={closeModal}
				title={"Create or Update Staff Menu Access Exceptions"}
				description='Select a staff member and apply menu access exceptions.'
				loading={isCreating}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<StaffMenuAccessExceptionForm
							ref={modalFormRef}
							allStaff={allStaff}
							allRoleBasedMenuItems={roleBasedMenuItems}
							allStaffMenuAccessExceptions={staffMenuAccessExceptions}
							onSubmit={handleCreateStaffMenuAccessException}
							isLoading={isCreating}
						/>
					);
				}}
			</ModalForm>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, staffMenuAccessException: null })}
				onConfirm={() => handleDeleteStaffMenuAccessException()}
				title='Delete Staff Menu Exception'
				message={`Are you sure you want to delete the exception for "${deleteModal.staffMenuAccessException?.firstName || "Staff"}"? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};

export default StaffMenuException;
