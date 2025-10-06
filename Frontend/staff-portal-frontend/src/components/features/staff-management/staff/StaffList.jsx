import { useState, useEffect } from "react";
import { Trash2, Edit, List } from "lucide-react";
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
	SearchInput,
} from "../../../layout";
import { PremiseForm } from "../../infrastructure-management";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs, setHeaderInfo, useCreateStaffMutation, useDeleteStaffMutation, useUpdateStaffMutation } from "../../../../store";
import { useModal } from "../../../../providers";
import { useGetAllStaffQuery } from "../../../../store";
import { ErrorFallback } from "../../../layout/errorBoundary";
import { selectUserRole } from "../../../../store/selectors";
import { useFilteredMenu } from "../../../../hooks";
import { StaffForm } from ".";

const StaffList = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { filteredMenu = [] } = useFilteredMenu();
	const canAccessStaffList = filteredMenu.includes("/staff-management/staff") && userRole === "ADMIN";
	
	const { showModal, setShowModal } = useModal();
	const [editingStaff, setEditingStaff] = useState(null);
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		staff: null,
	});

	

	const { data: allStaff, isLoading: isLoadingAllStaff, isError: isErrorAllStaff, error: allStaffError } = useGetAllStaffQuery();
	const [createStaff, { isSuccess: created, isLoading: creating, isError: createError, error: createErrorDetails }] = useCreateStaffMutation();
	const [updateStaff, { isLoading: updating, isSuccess: updated, isError: updateError, error: updateErrorDetails }] = useUpdateStaffMutation();
	const [deleteStaffTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError, error: deleteErrorDetails }] = useDeleteStaffMutation();
	
	useEffect(() => {
		if (created) {
			console.log("Notification: Staff created successfully!");
		}	
		if (createError) {
			console.log("Notification: Failed to create Staff.");
		}
		if (updated) {
			console.log("Notification: Staff updated successfully!");
		}
		if (updateError) {
			console.log("Notification: Failed to update Staff.");
		}
		if (deleted) {
			console.log("Notification: Staff deleted successfully!");
		}
		if (deleteError) {
			console.log("Notification: Failed to delete Staff.");
		}
	},[created, createError, updated, updateError, deleted, deleteError]);
	
	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Staff",
				subtitle: "List of all staff members.",
				action: [
					{
						label: "Add Staff",
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
					title: "Staff Management",
					icon: "house-plus",
				},
				{
					title: "Staff",
					path: "/staff-management/staff",
					icon: "house-plug",
				},
			])
		);
	}, [dispatch]);

	const handleCreateStaff = async (newStaff) => {
		try {
			await createStaff(newStaff).unwrap();
			setShowModal(false);
			setEditingStaff(null);
		} catch (error) {
			console.error("Error creating staff:", error);
		}
	};

	const handleUpdateStaff = async (updatedStaff) => {
		try {
			await updateStaff(updatedStaff).unwrap();
			setShowModal(false);
			setEditingStaff(null);
		} catch (error) {
			console.error("Error updating staff:", error);
		}
	};

	const handleDeleteStaff = async () => {
		const idToDelete = deleteModal.staff.id;
		if (!idToDelete) return;
		try {
			await deleteStaffTrigger(idToDelete).unwrap();
			setDeleteModal({ open: false, staff: null });
		} catch (error) {
			console.error("Error deleting staff:", error);
		}
	};

	const handleOpenEditModal = (staff) => {
		setEditingStaff(staff);
		setShowModal(true);
	};

	const [filters, setFilters] = useState({
		staffType: "",
		searchTerm: "",
		role: "",
	});
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};
	if (isErrorAllStaff) {
		return <ErrorFallback error={allStaffError} />;
	}
	const staffTypeOptions = [
		{ value: "", label: "All Staff Type" },
		{ value: "INHOUSE", label: "Inhouse" },
		{ value: "GUEST", label: "Guest" },
	];
	const roleOptions = [
		{ value: "", label: "All Roles" },
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
	return (
		<>
			<div className='grid grid-cols-6 gap-4 mb-4'>
				<CustomSelect
					value={filters.staffType}
					options={staffTypeOptions}
					onChange={(e) => handleFilterChange("staffType", e.target.value)}
				/>
				<CustomSelect value={filters.role} options={roleOptions} onChange={(e) => handleFilterChange("role", e.target.value)} />
				<SearchInput value={filters.searchTerm} onChange={(e) => handleFilterChange("searchTerm", e.target.value)} />
			</div>
			<Card className={"h-[510px]"}>
				<CardBody>
					{isLoadingAllStaff ? (
						<SkeletonTable />
					) : allStaff.length === 0 ? (
						<EmptyState
							icon={<List className='w-12 h-12' />}
							title='No Staff Found'
							description='There are no staff members in the system. Get started by adding a new one.'
						/>
					) : (
						<>
							<Table>
								<TableHead>
											<TableRow>
										<TableHeader className='w-1/5 rounded-tl-2xl'>S.No.</TableHeader>
										<TableHeader className='w-1/5 rounded-tl-2xl'>Title</TableHeader>
										<TableHeader className='w-1/3'>Email</TableHeader>
										<TableHeader className='w-1/6'>Phone</TableHeader>
										<TableHeader className='w-1/6'>Course Specialization</TableHeader> {/**MULTIPLE OR COURSE CODE */}
										<TableHeader className='w-1/6'>Staff Role</TableHeader>
										<TableHeader className='w-1/6'>Staff Type</TableHeader>
										<TableHeader className='text-center rounded-tr-2xl w-[120px]'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='h-[440px] rounded-b-2xl overflow-y-auto scrollbar-none'>
								<Table>
									<TableBody>
										{allStaff.map((staff, index) => (
											<TableRow key={staff.id}>
												<TableCell className='w-1/5'>{index + 1}</TableCell>
												<TableCell className='w-1/5'>{staff.firstName + " " + staff.lastName}</TableCell>
												<TableCell className='font-medium text-center w-1/3'>{staff.email}</TableCell>
												<TableCell className='font-medium text-center w-1/6'>{staff.phone}</TableCell>
												<TableCell className='w-1/6'>{staff.courseSpecialization}</TableCell>
												<TableCell className='w-1/6'>{staff.staffRole}</TableCell>
												<TableCell className='w-1/6'>{staff.staffType}</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='ghost'
															className='cursor-pointer dark:hover:text-yellow-400'
															size='sm'
															onClick={() => handleOpenEditModal(staff)}>
															<Edit size={16} />
														</Button>
														<Button
															variant='ghost'
															size='sm'
															className='text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 cursor-pointer'
															onClick={() =>
																setDeleteModal({
																	open: true,
																	staff,
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
					)}
				</CardBody>
			</Card>

			{/* Modal for Create/Edit */}
			<Modal
				isOpen={showModal}
				onClose={() => {
					setShowModal(false);
					setEditingStaff(null);
				}}
				size='lg'>
				<ModalHeader
					title={editingStaff ? "Edit Staff Details" : "Create Staff Member"}
					subtitle={editingStaff ? "Update staff member details." : "Add a new staff member to the system."}
					onClose={() => {
						setShowModal(false);
						setEditingStaff(null);
					}}
				/>
				<ModalBody>
					<StaffForm
						staff={editingStaff}
						onSubmit={editingStaff ? handleUpdateStaff : handleCreateStaff}
						onCancel={() => {
							setShowModal(false);
							setEditingStaff(null);
						}}
						isLoading={creating || updating}
					/>
				</ModalBody>
			</Modal>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, Premise: null })}
				onConfirm={() => handleDeleteStaff()}
				title='Delete Batch Cycle'
				message={`Are you sure you want to delete "${
					deleteModal.staff?.firstName + " " + deleteModal.staff?.lastName
				}" from the system? This action cannot be undone.`}
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};

export default StaffList;
