import { Edit } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { notify } from "../../../../utils/Notify";
import { ModalForm } from "../../../layout/modals/ModalForm";

// --- COMMON COMPONENTS ---
import { useDispatch, useSelector } from "react-redux";
import {
	Badge,
	Button,
	Card,
	CardBody,
	CustomSelect,
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
	useGetAllRoleBasedMenuQuery,
	useGetPreservedCommandsQuery,
	useUpdateRoleBasedMenuItemMutation,
} from "../../../../store";
import { selectUserRole } from "../../../../store/selectors";
import { ErrorFallback } from "../../../layout/errorBoundary";
import ResumeModal from "../../../layout/modals/ResumeModal";
import { RoleBasedMenuMgmtModal } from "./RoleBasedMenuMgmtModal";

const RoleBasedMenuMgmt = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet, refetchSidebarMenuItems } = useFilteredMenu();
	const canAccessMenuManagement = pathSet.has("/system-administration/role-menus") && userRole === "ADMIN";

	const { showModal, openModal, closeModal } = useModal();
	const formRef = useRef(null);

	const [filters, setFilters] = useState({
		role: "ADMIN",
	});
	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};
	const [resumeModal, setResumeModal] = useState({
		open: false,
		resumeData: null,
	});
	const resumePending = sessionStorage.getItem("resumePending") === "true";
	const { data: preservedCommands = [] } = useGetPreservedCommandsQuery(undefined, { skip: !resumePending });

	const {
		data: roleBasedMenuItems,
		currentData,
		isLoading: isLoadingRoleBasedMenuItems,
		isError: isErrorRoleBasedMenuItems,
		error: roleBasedMenuItemsError,
	} = useGetAllRoleBasedMenuQuery();
	console.log("Role Based Menu Items: ", roleBasedMenuItems);
	const [updateRoleBasedMenuItem, { isError, error }] = useUpdateRoleBasedMenuItemMutation();

	const tableData = useMemo(() => {
		if (!currentData?.length) return [];
		let newTableData = [...currentData];
		const filterData = newTableData.filter((item) => item.roleName === filters.role);
		return filterData;
	}, [currentData, filters]);

	const handleResumeConfirm = (command) => {
		if (command.commandName === "CREATE_ROLE_BASED_MENU_ITEM") {
			openModal("RoleBasedMenu", "CREATE", command.payload);
		}

		if (command.commandName === "UPDATE_ROLE_BASED_MENU_ITEM") {
			openModal("RoleBasedMenu", "EDIT", command.payload);
		}

		setResumeModal({ open: false, resumeData: null });
	};

	const handleResumeDiscard = () => {
		setResumeModal({ open: false, resumeData: null });
	};

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

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Role Based Menu Items",
				subtitle: "List of role based menu items in the application",
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
					path: "/system-administration/role-menus",
					icon: "house-plug",
				},
			])
		);
	}, [dispatch]);

	if (isErrorRoleBasedMenuItems) {
		return <ErrorFallback errorMessage={roleBasedMenuItemsError.message} />;
	}

	const handleUpdateMenuItem = async (updatePayload) => {
		try {
			await updateRoleBasedMenuItem(updatePayload);
			if (filters.role === "ADMIN") refetchSidebarMenuItems();
			notify.success("Menu item access updated successfully!");
			closeModal();
		} catch (error) {
			notify.error("Failed to update menu item access.");
		}
	};

	const handleOpenEditModal = (roleBasedMenuItem) => {
		openModal(roleBasedMenuItem, "EDIT", roleBasedMenuItem);
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

	return (
		<>
			<div className='mb-2 grid grid-cols-6'>
				<CustomSelect value={filters.role} onChange={(e) => handleFilterChange("role", e.target.value)} options={roleOptions} />
			</div>
			<Card className={"h-[545px]"}>
				<CardBody>
					{isLoadingRoleBasedMenuItems ?
						<SkeletonTable />
					:	<>
							<Table>
								<TableHead>
									<TableRow isHeader={true}>
										<TableHeader className='w-[100px] rounded-tl-2xl'>S.No</TableHeader>
										<TableHeader className='w-1/2'>Menu Item</TableHeader>
										<TableHeader className='w-1/4'>Role</TableHeader>
										<TableHeader className='w-1/3'>Status</TableHeader>
										<TableHeader className='w-[120px] rounded-tr-lg text-center'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[474px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{tableData.map((roleBasedMenuItem, index) => (
											<TableRow key={index + 1}>
												<TableCell className='w-[100px] font-medium'>{index + 1}</TableCell>
												<TableCell className='w-1/2 pl-50 text-left font-medium'>{roleBasedMenuItem.title}</TableCell>
												<TableCell className='w-1/4 text-center font-medium'>{roleBasedMenuItem.roleName}</TableCell>
												<TableCell className='w-1/3'>
													<Badge className={getStatusClasses(roleBasedMenuItem.status)}>{roleBasedMenuItem.status}</Badge>
												</TableCell>
												<TableCell className='w-[120px]'>
													<div className='flex items-center justify-center space-x-2'>
														<Button
															icon={Edit}
															variant='gradientAmber'
															className='h-8 w-8 rounded-xl'
															onClick={() => handleOpenEditModal(roleBasedMenuItem)}
														/>
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
			{/* Modal for Create/Edit */}
			<ModalForm
				isOpen={showModal.open}
				onClose={closeModal}
				title='Update Role Access'
				description='Modify the access rights for this role.'
				formRef={formRef}
				loading={false}>
				{(modalFormRef) => {
					formRef.current = modalFormRef.current;
					return <RoleBasedMenuMgmtModal ref={modalFormRef} roleBasedMenuItem={showModal.payload} onSubmit={handleUpdateMenuItem} />;
				}}
			</ModalForm>
			<ResumeModal isOpen={resumeModal.open} commands={resumeModal.resumeData} onResume={handleResumeConfirm} onDiscard={handleResumeDiscard} />
		</>
	);
};

export default RoleBasedMenuMgmt;
