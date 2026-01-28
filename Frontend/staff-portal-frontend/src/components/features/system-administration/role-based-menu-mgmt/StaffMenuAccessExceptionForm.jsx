import { AlertTriangle, ListPlus, Loader, Shield } from "lucide-react";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useFormState } from "../../../../hooks/uiHook/useFormState";
import { notify } from "../../../../utils/Notify";
import { Card, CardBody, CardHeader, CustomSelect, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../layout";

const useMenuAccessLogic = (selectedStaffId, allStaff, allRoleBasedMenuItems, allStaffMenuAccessExceptions) => {
	const selectedStaff = allStaff.find((staff) => staff.id === selectedStaffId);

	const availableMenuItems = useMemo(() => {
		if (!selectedStaff) return [];

		const existingExceptionIds = allStaffMenuAccessExceptions.filter((ex) => ex.staffId === selectedStaffId).map((e) => e.menuItemId);

		const defaultRoleRules = allRoleBasedMenuItems.filter((rmi) => rmi.roleName === selectedStaff.staffRole);

		const filteredList = defaultRoleRules
			.filter((rule) => !existingExceptionIds.includes(rule.menuItemId))
			.map((rule) => ({
				menuItemId: rule.menuItemId,
				menuItemTitle: rule.menuItemTitle,
				defaultAccess: rule.accessStatus,
				newExceptionStatus: "",
			}));

		return filteredList;
	}, [selectedStaffId, selectedStaff, allRoleBasedMenuItems, allStaffMenuAccessExceptions]);

	return {
		selectedStaff,
		availableMenuItems,
		staffRole: selectedStaff?.staffRole || null,
		loading: false,
	};
};

export const StaffMenuAccessExceptionForm = forwardRef(
	({ allStaff = [], allRoleBasedMenuItems = [], allStaffMenuAccessExceptions = [], onSubmit, isLoading }, ref) => {
		const { values, errors, setField, submit, reset, isDirty } = useFormState({
			initialValues: {
				staffId: "",
				exceptions: [],
			},
			validate: (vals) => {
				const errs = {};
				if (!vals.staffId) errs.staffId = "Staff is required";
				return errs;
			},
			onSubmit: (vals) => {
				if (vals.exceptions.length === 0) {
					notify.error("No exceptions selected to save.");
					return;
				}
				onSubmit(vals);
			},
		});

		const [tableData, setTableData] = useState([]);

		const { availableMenuItems, staffRole, loading } = useMenuAccessLogic(
			values.staffId,
			allStaff,
			allRoleBasedMenuItems,
			allStaffMenuAccessExceptions
		);

		useImperativeHandle(ref, () => ({
			submit,
			reset,
			isDirty,
		}));

		useEffect(() => {
			setTableData(availableMenuItems);
			// Whenever menu items change (STAFF CHANGE), reset exceptions list
			setField("exceptions", []);
		}, [availableMenuItems, setField]);

		const staffOptions = useMemo(() => {
			return allStaff.map((staff) => ({
				value: staff.staffId,
				label: `${staff.firstName} ${staff.lastName} (${staff.staffRole})`,
			}));
		}, [allStaff]);

		const handleStatusChange = useCallback(
			(menuItemId) => {
				setTableData((prevData) => {
					const newData = prevData.map((item) => {
						if (item.menuItemId === menuItemId) {
							const isCurrentlyOverridden = item.newExceptionStatus !== item.defaultAccess;

							const nextStatus =
								isCurrentlyOverridden ?
									item.defaultAccess === "ALLOWED" ?
										"BLOCKED"
									:	"ALLOWED" // Override to opposite
								:	item.defaultAccess;

							return { ...item, newExceptionStatus: nextStatus };
						}
						return item;
					});

					const exceptionToSave = newData.filter((item) => item.newExceptionStatus !== item.defaultAccess);
					// Update form state with new exceptions list
					setField(
						"exceptions",
						exceptionToSave.map((item) => ({
							menuItemId: item.menuItemId,
							status: item.newExceptionStatus,
						}))
					);

					return newData;
				});
			},
			[setField]
		);

		const isFormDisabled = isLoading || loading;

		return (
			<div className='space-y-6 p-4'>
				<div>
					<CustomSelect
						value={values.staffId}
						label={"Staff"}
						onChange={(e) => setField("staffId", e.target.value)}
						options={staffOptions}
						error={!!errors.staffId}
						disabled={isFormDisabled}
					/>
					{staffRole && (
						<p className='mt-2 text-xs text-gray-400'>
							Default Access Rules are based on Role: <span className='font-bold text-teal-300'>{staffRole}</span>
						</p>
					)}
				</div>
				<Card className='rounded-lg border border-gray-700 bg-gray-800 p-4'>
					<CardHeader className='text-md mb-3 flex items-center font-semibold text-white'>
						<ListPlus className='mr-2 h-5 w-5 text-teal-400' /> Apply Exceptions ({tableData.length} available)
					</CardHeader>
					<CardBody>
						{isFormDisabled || loading ?
							<div className='flex h-20 items-center justify-center text-teal-400'>
								<Loader className='mr-2 h-6 w-6 animate-spin' /> Loading exceptions...
							</div>
						:	<>
								{tableData.length === 0 && values.staffId ?
									<div className='rounded-lg border border-dashed border-gray-600 bg-gray-700/30 p-4 text-center text-gray-400'>
										<p>All menu items for this staff member already have an active exception.</p>
									</div>
								:	<Table>
										<TableHead>
											<TableRow>
												<TableHeader className='w-[100px] rounded-tl-2xl'>S.No</TableHeader>
												<TableHeader className='w-1/6'>Menu Item Title</TableHeader>
												<TableHeader className='w-1/4'>Default Access</TableHeader>
												<TableHeader className='w-[120px] rounded-tr-lg text-center'>Action / Current Status</TableHeader>
											</TableRow>
										</TableHead>
									</Table>
								}

								<div className='scrollbar-none h-[500px] overflow-y-auto rounded-b-2xl'>
									<Table>
										<TableBody>
											{tableData.map((item, index) => {
												const isOverridden = item.newException !== item.defaultAccess;
												return (
													<TableRow
														key={item.menuItemId}
														className={`hover:bg-gray-700/50 ${isOverridden ? "border-l-4 border-yellow-500 bg-gray-900/50" : ""}`}>
														<TableCell className='w-[100px] rounded-tl-2xl'>{index + 1}</TableCell>
														<TableCell className='w-1/6'>{item.menuItemTitle}</TableCell>
														<TableCell
															className={`w-1/4 ${item.defaultAccess === "ALLOWED" ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"}`}>
															{item.defaultAccess}
														</TableCell>
														<TableCell>
															<ToggleOverrideButton item={item} onClick={handleStatusChange} disabled={isFormDisabled} />
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							</>
						}
					</CardBody>
				</Card>
			</div>
		);
	}
);

const ToggleOverrideButton = ({ item, onClick, disabled }) => {
	const isOverridden = item.newExceptionStatus !== item.defaultAccess;
	const displayStatus = item.newExceptionStatus; // Always show the effective status

	// Determine the color and text based on the override state
	let buttonText, buttonColor, icon;

	if (isOverridden) {
		buttonText = "Revert to Default";
		buttonColor = "bg-yellow-600 hover:bg-yellow-500 text-gray-900 shadow-md ring-2 ring-yellow-400";
		icon = <AlertTriangle className='h-4 w-4' />; // Warning icon for overridden state
	} else {
		buttonText = "Apply Exception";
		buttonColor = "bg-gray-700 hover:bg-gray-600 text-white";
		icon = <Shield className='h-4 w-4' />; // Shield icon for stability/default
	}

	const statusColorClass = displayStatus === "ALLOWED" ? "bg-green-800 text-green-300" : "bg-red-800 text-red-300";
	const baseClasses = "flex items-center justify-between p-2 rounded-lg font-semibold text-xs transition duration-200 w-full";

	return (
		<button
			type='button'
			onClick={() => onClick(item.menuItemId)}
			disabled={disabled}
			className={`${baseClasses} ${buttonColor} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
			{/* Left side: Action Text */}
			<div className='flex items-center space-x-1'>
				{icon}
				<span className='uppercase'>{buttonText}</span>
			</div>

			{/* Right side: Current Effective Status */}
			<div className={`flex items-center space-x-1 rounded-md p-1 px-2 ${statusColorClass}`}>
				<span className='uppercase'>{displayStatus}</span>
			</div>
		</button>
	);
};
