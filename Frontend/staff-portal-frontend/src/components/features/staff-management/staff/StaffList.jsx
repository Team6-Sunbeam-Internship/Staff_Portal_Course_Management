import { Edit, List, RotateCcw, Search, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StaffForm } from ".";
import { useDebounce, useFilteredMenu } from "../../../../hooks";
import { useModal } from "../../../../providers";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateStaffMutation,
	useDeleteStaffMutation,
	useGetAllStaffQuery,
	useUpdateStaffMutation,
} from "../../../../store";
import { selectUserRole } from "../../../../store/selectors";
import { selectAllStaff } from "../../../../store/selectors/userSelectors";
import { notify } from "../../../../utils/Notify";
import {
	Button,
	Card,
	CardBody,
	ConfirmDialog,
	CustomSelect,
	EmptyState,
	Input,
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

const StaffList = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessStaffList = pathSet.has("/staff-management/staff") && userRole === "ADMIN";

	const formRef = useRef(null);
	const { showModal, openModal, closeModal } = useModal();
	const [deleteModal, setDeleteModal] = useState({
		open: false,
		staff: null,
	});

	const allStaff = useSelector(selectAllStaff);
	const { isLoading: isLoadingAllStaff, isError: isErrorAllStaff, error: allStaffError } = useGetAllStaffQuery();
	const [createStaff, { isSuccess: created, isLoading: creating, isError: createError }] = useCreateStaffMutation();
	const [updateStaff, { isLoading: updating, isSuccess: updated, isError: updateError }] = useUpdateStaffMutation();
	const [deleteStaffTrigger, { isLoading: deleting, isSuccess: deleted, isError: deleteError }] = useDeleteStaffMutation();
	console.log("All Staff: ", allStaff);
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
	}, [created, createError, updated, updateError, deleted, deleteError]);

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Staff",
				subtitle: "List of all staff members.",
				action: [
					{
						label: "Add Staff",
						entity: "Staff",
						mode: "CREATE",
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

	const handleSubmitStaff = async (data) => {
		const { id, payload } = data;
		try {
			if (id) {
				await updateStaff({ id, payload }).unwrap();
				console.log("Staff updated successfully!");
				notify.success(`Staff [${payload.firstName} ${payload.lastName}] updated successfully!`);
			} else {
				await createStaff(payload).unwrap();
				console.log("Staff created successfully!");
				notify.success(`Staff [${payload.firstName} ${payload.lastName}] created successfully!`);
			}
		} catch (error) {
			console.error("Error saving staff:", error);
			if (formRef.current) {
				formRef.current.reset();
			}
		}
		closeModal();
	};

	const handleDeleteStaff = async () => {
		const idToDelete = deleteModal.staff.staffId;
		if (!idToDelete) return;
		try {
			await deleteStaffTrigger(idToDelete).unwrap();
			setDeleteModal({ open: false, staff: null });
			notify.success(`Staff [${deleteModal.staff.firstName} ${deleteModal.staff.lastName}] deleted successfully!`);
		} catch (error) {
			console.error("Error deleting staff:", error);
		}
		setDeleteModal({ open: false, staff: null });
	};

	const handleOpenEditModal = (staff) => {
		openModal("Staff", "EDIT", staff);
	};

	const [filters, setFilters] = useState({
		staffType: "",
		searchTerm: "",
		role: "",
	});
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	// Debounce search term to avoid filtering on every keystroke
	const debouncedSearchTerm = useDebounce(filters.searchTerm, 300);

	// Client-side filtering - no backend requests
	const filteredStaff = useMemo(() => {
		if (!allStaff || allStaff.length === 0) return [];

		let result = allStaff;

		// Filter by staff type
		if (filters.staffType) {
			result = result.filter((staff) => staff.staffType === filters.staffType);
		}

		// Filter by role
		if (filters.role) {
			result = result.filter((staff) => staff.role === filters.role);
		}

		// Filter by search term (debounced)
		if (debouncedSearchTerm) {
			const searchLower = debouncedSearchTerm.toLowerCase();
			result = result.filter((staff) => {
				const fullName = `${staff.firstName} ${staff.lastName}`.toLowerCase();
				const email = staff.email?.toLowerCase() || "";
				const phone = staff.phoneNumber?.toString() || "";
				const courseSpecialization = staff.courseSpecialization?.toLowerCase() || "";
				const role = staff.role?.toLowerCase() || "";
				const staffType = staff.staffType?.toLowerCase() || "";
				return (
					fullName.includes(searchLower) ||
					email.includes(searchLower) ||
					phone.includes(searchLower) ||
					courseSpecialization.includes(searchLower) ||
					role.includes(searchLower) ||
					staffType.includes(searchLower)
				);
			});
		}

		return result;
	}, [allStaff, filters.staffType, filters.role, debouncedSearchTerm]);
	if (!canAccessStaffList) {
		return <ErrorFallback errorMessage='You are not authorized to view this page.' />;
	}
	if (isErrorAllStaff) {
		return <ErrorFallback error={allStaffError} />;
	}
	const staffTypeOptions = [
		{ value: "", label: "Select Staff Type" },
		{ value: "IN_HOUSE", label: "Inhouse" },
		{ value: "VISITING", label: "Visiting" },
	];
	const roleOptions = [
		{ value: "", label: "Select Staff Role" },
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
	const handleResetFilters = () => {
		setFilters({
			staffType: "",
			searchTerm: "",
			role: "",
		});
	};

	// Helper function to highlight search term in text
	const highlightText = (text, searchTerm) => {
		if (!searchTerm || !text) return text;

		const parts = text.toString().split(new RegExp(`(${searchTerm})`, "gi"));
		return (
			<>
				{parts.map((part, index) =>
					part.toLowerCase() === searchTerm.toLowerCase() ?
						<span key={index} className='bg-amber-200 font-semibold text-amber-900 dark:bg-amber-500/30 dark:text-amber-300'>
							{part}
						</span>
					:	part
				)}
			</>
		);
	};
	return (
		<>
			<div className='mt-2 mb-4 grid grid-cols-6 gap-4'>
				<CustomSelect
					label='Staff Type'
					value={filters.staffType}
					options={staffTypeOptions}
					onChange={(e) => handleFilterChange("staffType", e.target.value)}
				/>
				<CustomSelect label='Staff Role' value={filters.role} options={roleOptions} onChange={(e) => handleFilterChange("role", e.target.value)} />
				<Input label='Search' value={filters.searchTerm} icon={Search} onChange={(e) => handleFilterChange("searchTerm", e.target.value)} />
				<button
					title='reset filters'
					className='flex h-11 w-11 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out active:scale-90'
					onClick={handleResetFilters}>
					<RotateCcw className='text-amber-500' size={24} />
				</button>
			</div>
			<Card className={"h-[510px]"}>
				<CardBody>
					{isLoadingAllStaff ?
						<SkeletonTable />
					: allStaff?.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title='No Staff Found'
							description='There are no staff members in the system. Get started by adding a new one.'
						/>
					: filteredStaff?.length === 0 ?
						<EmptyState
							icon={<List className='h-12 w-12' />}
							title='No Staff Found'
							description='No staff members match your current filters. Try adjusting your search criteria.'
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-1/12 rounded-tl-2xl'>S.No.</TableHeader>
										<TableHeader className='w-1/5'>Title</TableHeader>
										<TableHeader className='w-1/3'>Email</TableHeader>
										<TableHeader className='w-1/6'>Gender</TableHeader>
										<TableHeader className='w-1/6'>Phone</TableHeader>
										<TableHeader className='w-1/6'>Course Specialization</TableHeader> {/**MULTIPLE OR COURSE CODE */}
										<TableHeader className='w-1/6'>Staff Role</TableHeader>
										<TableHeader className='w-1/6'>Staff Type</TableHeader>
										<TableHeader className='w-[120px] rounded-tr-2xl text-center'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[440px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{filteredStaff?.map((staff, index) => (
											<TableRow key={staff.id}>
												<TableCell className={`w-1/12 ${filteredStaff.length - 1 === index ? "rounded-bl-2xl" : ""}`}>{index + 1}</TableCell>
												<TableCell className='w-1/5'>{highlightText(`${staff.firstName} ${staff.lastName}`, debouncedSearchTerm)}</TableCell>
												<TableCell className='w-1/3 text-center font-medium'>{highlightText(staff.email, debouncedSearchTerm)}</TableCell>
												<TableCell className='w-1/6 text-center font-medium'>{highlightText(staff.gender, debouncedSearchTerm)}</TableCell>
												<TableCell className='w-1/6 text-center font-medium'>{highlightText(staff.phoneNumber, debouncedSearchTerm)}</TableCell>
												<TableCell className='w-1/6'>{highlightText(staff.courseSpecialization, debouncedSearchTerm)}</TableCell>
												<TableCell className='w-1/6'>{highlightText(staff.role, debouncedSearchTerm)}</TableCell>
												<TableCell className='w-1/6'>{highlightText(staff.staffType, debouncedSearchTerm)}</TableCell>
												<TableCell className={`w-[120px] ${filteredStaff.length - 1 === index ? "rounded-br-2xl" : ""}`}>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															variant='gradientAmber'
															icon={Edit}
															className='h-6 w-6 rounded-lg'
															onClick={() => handleOpenEditModal(staff)}
															disabled={creating || deleting}></Button>
														<Button
															variant='gradientRose'
															icon={Trash2}
															className='h-6 w-6 rounded-lg'
															onClick={() =>
																setDeleteModal({
																	open: true,
																	staff,
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
				isOpen={showModal.open && showModal.entity === "Staff"}
				onClose={closeModal}
				title={showModal.mode === "EDIT" ? "Edit Staff Details" : "Create Staff Member"}
				description={showModal.mode === "EDIT" ? "Update staff member details." : "Add a new staff member to the system."}
				formRef={formRef}
				loading={creating || updating}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return (
						<StaffForm
							ref={modalFormRef}
							staff={showModal.payload}
							onSubmit={handleSubmitStaff}
							staffRoleOptions={roleOptions}
							staffTypeOptions={staffTypeOptions}
							isLoading={creating || updating}
						/>
					);
				}}
			</ModalForm>

			{/* Confirmation Dialog */}
			<ConfirmDialog
				isOpen={deleteModal.open}
				onClose={() => setDeleteModal({ open: false, staff: null })}
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
