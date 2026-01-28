import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, XCircle, Clock } from "lucide-react";


// Changed import name to reflect fetching router IDs (users) instead of modules
import {
	Table,
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
	Button,
	Badge,
	Card,
	CardBody,
	// CardHeader,
	EmptyState,
	SkeletonTable,
	ConfirmDialog,
} from "../../../layout";
import { setBreadcrumbs, setHeaderInfo, useApproveTimesheetMutation, useGetAssignCourseQuery, useGetModuleRouterIdsQuery, useGetTimeSheetsQuery } from "../../../../store";
import { selectUserRole } from "../../../../store/selectors/authSelectors";

// Helper function to format the time range
const formatTimeRange = (start, end) => {
	const startTime = start.substring(0, 5);
	const endTime = end.substring(0, 5);
	return `${startTime} - ${endTime}`;
};

export const TimesheetApproveLogs = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole)

	const [approveTimesheet, { isLoading: approving }] =
		useApproveTimesheetMutation();
	const [confirmDialog, setConfirmDialog] = useState({
		open: false,
		entry: null,
		action: null,
	});

	// Determine user's approval authority
	const isCoordinator = userRole === 'COURSE_COORDINATOR';
	const canApprove = isCoordinator;

	// Determine if we need to fetch user data for a Coordinator
	const shouldFetchRouterIds = isCoordinator 

	// =========================================================================
	// --- CORE LOGIC: Fetch Relevant Module Router IDs for Course Coordinator ---
	// (Module Routers are the staff whose timesheets the coordinator can approve)
	// =========================================================================
	
	// courseCode, courseName 
	const { data: assignCourse, isLoading: loadingAssignCourse, isError: isErrorAssignCourse, error: errorAssignCourse } = useGetAssignCourseQuery();
	
	const {
		data: routerIds = [], // Array of User IDs (router IDs) the coordinator is responsible for
		isLoading: routerIdsLoading,
		isSuccess: routerIdsSuccess,
	} = useGetModuleRouterIdsQuery(
		// <--- Hook name changed
		{
			courseCode: assignCourse.courseCode
		},
		{
			// Skip fetching router IDs if the user is an ADMIN or if the necessary user data is missing
			skip: !shouldFetchRouterIds,
			refetchOnMountOrArgChange: true,
		}
	);

	// =========================================================================
	// --- CORE LOGIC: Fetch Timesheets Based on Role ---
	// =========================================================================

	// The timesheet query parameters will change based on the user's role.
	const timesheetQueryParams = useMemo(() => {

		if (isCoordinator && routerIdsSuccess) {
			// COORDINATOR fetches pending timesheets relevant to the fetched Module Router User IDs.
			// We assume the timesheet API accepts a userIds array for filtering.
			// Only query if the router list has successfully loaded for the coordinator.
			// routerIds list could be empty if coordinator has no assigned routers, which is handled gracefully by the API
			return { status: "pending", userIds: routerIds }; // <--- Filter by userIds (routerIds)
		}

		// Default case (non-approver, or coordinator still waiting for router ID data)
		return { status: "pending", skip: true };
	}, [isCoordinator, routerIdsSuccess, routerIds]);

	const {
		data: timesheetEntries = [],
		isLoading: timesheetsLoading,
		isError: timesheetsError,
		isFetching: timesheetsFetching,
	} = useGetTimeSheetsQuery(timesheetQueryParams, {
		// Skip fetching if the timesheetQueryParams tell us to skip
		skip: timesheetQueryParams.skip === true,
	});

	// Ensure loading state correctly waits for router IDs if coordinator
	const isLoading =
		(isCoordinator ? routerIdsLoading : false) ||
		timesheetsLoading ||
		timesheetsFetching; // <--- routerIdsLoading used

	// =========================================================================
	// --- HANDLERS ---
	// =========================================================================

	const handleConfirmAction = (entry, action) => {
		setConfirmDialog({ open: true, entry, action });
	};

	const handleApprove = async () => {
		const { entry, action } = confirmDialog;

		if (!entry || !action) return;

		try {
			await approveTimesheet({
				id: entry.id,
				status: action, // "approved" or "rejected"
				// Assuming user ID for logging : get from access token
			}).unwrap();

			dispatch(
				// showNotification({
				// 	message: `Timesheet entry successfully ${action}.`,
				// 	type: "success",
				// })
			);
		} catch (error) {
			dispatch(
				// showNotification({
				// 	message: `Failed to process timesheet: ${
				// 		error.data?.message || "Unknown error"
				// 	}`,
				// 	type: "error",
				// })
			);
		} finally {
			setConfirmDialog({ open: false, entry: null, action: null });
		}
	};

	// =========================================================================
	// --- LIFECYCLE & BREADCRUMBS ---
	// =========================================================================

	useEffect(() => {
		dispatch(
			setBreadcrumbs([
				{ title: "Home", path: "/dashboard", icon: "home" },
				{
					title: "Scheduling & Sessions",
					path: "/scheduling-sessions",
					icon: "calendar",
				},
				{
					title: "Timesheets",
					path: "/scheduling-sessions/timesheets",
					icon: "clock",
				},
				{
					title: "Approval Logs",
					path: "/scheduling-sessions/timesheets/approve-logs",
					icon: "check",
				},
			])
		);
		dispatch(setHeaderInfo({ title: "Timesheet Approval", icon: Clock }));
	}, [dispatch]);

	// =========================================================================
	// --- RENDERING ---
	// =========================================================================

	if (!canApprove) {
		return (
			<EmptyState
				title='Access Restricted'
				message='You do not have the required permissions (ADMIN or COURSE_COORDINATOR) to approve timesheets.'
			/>
		);
	}

	const displayEntries = timesheetEntries.filter(
		(entry) => entry.status === "pending"
	);

	return (
		<>
			<Card className='mt-6'>
				{/* <CardHeader
					title={`Pending Timesheet Entries (${displayEntries.length})`}
				/> */}
				<CardBody>
					{isLoading && <SkeletonTable rows={5} cols={6} />}

					{!isLoading && displayEntries.length === 0 && (
						<EmptyState
							title='No Pending Timesheets'
							message={
								isCoordinator
									? "There are no pending timesheets from your module routers." // <--- Updated message
									: "All timesheets are up-to-date or already processed."
							}
						/>
					)}

					{!isLoading && displayEntries.length > 0 && (
						<Table>
							<TableHead>
								<TableRow>
									<TableHeader className='w-1/12'>
										Date
									</TableHeader>
									<TableHeader className='w-1/12'>
										Time
									</TableHeader>
									<TableHeader className='w-2/12'>
										Staff
									</TableHeader>
									<TableHeader className='w-2/12'>
										Course/Module
									</TableHeader>
									<TableHeader className='w-2/12'>
										Entry Type
									</TableHeader>
									<TableHeader className='w-1/12'>
										Duration
									</TableHeader>
									<TableHeader className='w-3/12 text-center'>
										Actions
									</TableHeader>
								</TableRow>
							</TableHead>
							<TableBody>
								{displayEntries.map((entry) => (
									<>
										<TableRow key={entry.id}>
											<TableCell className='text-sm'>
												{entry.date}
											</TableCell>
											<TableCell className='text-sm'>
												{formatTimeRange(
													entry.startTime,
													entry.endTime
												)}
											</TableCell>
											<TableCell className='text-sm font-medium'>
												{entry.staffName ||
													entry.userId}
											</TableCell>
											<TableCell className='text-sm'>
												<div className='font-semibold'>
													{entry.courseName ||
														entry.courseCode}
												</div>
												<div className='text-xs text-gray-500'>
													{entry.moduleName}
												</div>
											</TableCell>
											<TableCell>
												<Badge
													variant={
														entry.entryType ===
														"THEORY"
															? "info"
															: entry.entryType ===
															  "LAB"
															? "warning"
															: "secondary"
													}
												>
													{entry.entryType}
												</Badge>
											</TableCell>
											<TableCell className='text-sm'>
												{entry.duration}{" "}
												<span className='text-xs text-gray-500'>
													hrs
												</span>
											</TableCell>
											<TableCell className='text-center space-x-2'>
												<Button
													variant='success'
													size='sm'
													onClick={() =>
														handleConfirmAction(
															entry,
															"approved"
														)
													}
													disabled={approving}
													className='inline-flex items-center'
												>
													<CheckCircle className='w-4 h-4 mr-2' />
													Approve
												</Button>
												<Button
													variant='danger'
													size='sm'
													onClick={() =>
														handleConfirmAction(
															entry,
															"rejected"
														)
													}
													disabled={approving}
													className='inline-flex items-center'
												>
													<XCircle className='w-4 h-4 mr-2' />
													Reject
												</Button>
											</TableCell>
										</TableRow>
										{/* Expanded Details Row */}
										<TableRow className='bg-gray-50 dark:bg-gray-700'>
											<TableCell
												colSpan={7}
												className='pt-2 pb-4'
											>
												<div className='pl-4 space-y-2'>
													<div className='text-sm'>
														<strong>
															Topics Logged:
														</strong>
														<div className='flex flex-wrap gap-1 mt-1'>
															{entry.topicGroups &&
																entry.topicGroups.map(
																	(
																		group,
																		gIdx
																	) => (
																		<div
																			key={
																				gIdx
																			}
																			className='flex items-center space-x-1 p-1 px-2 bg-gray-100 dark:bg-gray-800 rounded'
																		>
																			<span className='text-xs font-semibold'>
																				{
																					group.subjectName
																				}{" "}
																				(
																				{
																					group.sectionName
																				}
																				):
																			</span>
																			<span className='text-sm'>
																				{group.topics
																					.map(
																						(
																							t
																						) =>
																							t.name
																					)
																					.join(
																						", "
																					)}
																			</span>
																		</div>
																	)
																)}
														</div>
													</div>
													{entry.extraTopics && (
														<div className='text-sm'>
															<strong>
																Extra Topics:
															</strong>{" "}
															{entry.extraTopics}
														</div>
													)}
													{entry.taskAssignment && (
														<div className='text-sm'>
															<strong>
																Task/Assignment:
															</strong>{" "}
															{
																entry.taskAssignment
															}
														</div>
													)}
												</div>
											</TableCell>
										</TableRow>
									</>
								))}
							</TableBody>
						</Table>
					)}
				</CardBody>
			</Card>

			<ConfirmDialog
				isOpen={confirmDialog.open}
				onClose={() =>
					setConfirmDialog({ open: false, entry: null, action: null })
				}
				onConfirm={handleApprove}
				title={`$
					{confirmDialog.action === "approved" ? "Approve" : "Reject"}
					Timesheet Entry`}
				message={`Are you sure you want to $
					{confirmDialog.action === "approved" ? "approve" : "reject"}
					this timesheet entry?`}
				confirmText={
					confirmDialog.action === "approved" ? "Approve" : "Reject"
				}
				type={
					confirmDialog.action === "approved" ? "success" : "danger"
				}
				loading={approving}
			/>
		</>
	);
};
