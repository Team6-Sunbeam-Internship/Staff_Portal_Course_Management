import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
	Edit,
	Eye,
	Clock,
	CheckSquare,
	XCircle,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { showNotification } from "../../../../../store/slices/uiSlice";
import {
	useGetTimesheetsQuery,
	useUpdateTimesheetMutation,
} from "../../../../../store";
import {
	setBreadcrumbs,
	// selectAccessibleMenus,
} from "../../../../../store";
import {
	Table,
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
	Button,
	Badge,
	Progress,
	Card,
	CardBody,
	CardHeader,
	EmptyState,
	SkeletonTable,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
} from "../../../../common";
import { setHeaderInfo } from "../../../../store";

// Helper function to determine the color variant of the status badge
const getStatusVariant = (status) => {
	switch (status) {
		case "approved":
			return "success";
		case "pending":
			return "warning";
		case "rejected":
			return "danger";
		case "draft":
			return "info";
		default:
			return "secondary";
	}
};

// Helper function to format the time range
const formatTimeRange = (start, end) => {
	const startTime = start.substring(0, 5);
	const endTime = end.substring(0, 5);
	return `${startTime} - ${endTime}`;
};

export const TimesheetMyEntries = () => {
	const dispatch = useDispatch();
	

	const { data: timesheets = [], isLoading } = useGetTimesheetsQuery(); // get staff id from access token

	const [updateTimesheet, { isLoading: updating }] =
		useUpdateTimesheetMutation();

	const [selectedEntry, setSelectedEntry] = useState(null);
	const [showUpdateModal, setShowUpdateModal] = useState(false);
	const [expandedRows, setExpandedRows] = useState([]);

	// NEW STATE: Tracks the topic completion status changes within the modal
	const [topicsToUpdate, setTopicsToUpdate] = useState([]);

	// =========================================================================
	// --- HANDLERS ---
	// =========================================================================

	const toggleRow = (id) => {
		setExpandedRows((prev) =>
			prev.includes(id)
				? prev.filter((rowId) => rowId !== id)
				: [...prev, id]
		);
	};

	const handleOpenUpdateModal = (entry) => {
		setSelectedEntry(entry);
		const initialTopics =
			entry.topicGroups?.flatMap((group) =>
				group.topics.map((topic) => ({
					...topic,
					groupId: group.id, // Keep a reference to the parent group/section ID if needed later
				}))
			) || [];

		setTopicsToUpdate(initialTopics);
		setShowUpdateModal(true);
	};

	// NEW HANDLER: Updates the completion status of a single topic in state
	const handleTopicCheck = (topicId, isChecked) => {
		setTopicsToUpdate((prevTopics) =>
			prevTopics.map((topic) =>
				topic.id === topicId
					? { ...topic, completed: isChecked }
					: topic
			)
		);
	};

	const handleTopicsUpdated = async () => {
		if (!selectedEntry) return;

		// 1. Re-structure the updated topics back into the topicGroups format
		const updatedTopicGroups = selectedEntry.topicGroups.map((group) => {
			// Find all topics belonging to this group in the topicsToUpdate state
			const updatedTopicsForGroup = topicsToUpdate
				.filter(
					(t) => t.groupId === group.id // Filter by groupId/sectionId
				)
				.map((t) => ({
					id: t.id,
					name: t.name,
					section: t.section, // Re-include necessary fields
					completed: t.completed, // Use the updated completion status
				}));

			return {
				...group,
				topics: updatedTopicsForGroup,
			};
		});

		try {
			// 2. Prepare the payload with the updated topic structure
			const payload = {
				...selectedEntry,
				topicGroups: updatedTopicGroups,
				// Ensure other non-topic fields that might be editable are included if necessary,
				// but for this task, we only focus on the topics.
			};

			await updateTimesheet({
				id: selectedEntry.id,
				...payload,
			}).unwrap();

			dispatch(
				showNotification({
					message: "Timesheet topics successfully updated.",
					type: "success",
				})
			);
			setShowUpdateModal(false);
		} catch (error) {
			dispatch(
				showNotification({
					message: `Failed to update timesheet: ${
						error.data?.message || "Unknown error"
					}`,
					type: "error",
				})
			);
		}
	};

	const canEdit = (entry) =>
		["draft", "rejected", "pending"].includes(entry.status);

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
					title: "My Entries",
					path: "/scheduling-sessions/timesheets/my-entries",
					icon: "list",
				},
			])
		);
		dispatch(setHeaderInfo({ title: "My Timesheet Entries", icon: Clock }));
	}, [dispatch]);

	// =========================================================================
	// --- RENDERING HELPERS ---
	// =========================================================================

	const renderTopicProgress = (entry) => {
		if (!entry.topicGroups || entry.topicGroups.length === 0) return 0;

		const allTopics = entry.topicGroups.flatMap(
			(group) => group.topics || []
		);
		const totalTopics = allTopics.length;
		const completedTopics = allTopics.filter((t) => t.completed).length;

		if (totalTopics === 0) return 0;
		return Math.round((completedTopics / totalTopics) * 100);
	};

	// =========================================================================
	// --- RENDERING ---
	// =========================================================================

	return (
		<>
			<Card className='mt-6'>
				<CardHeader
					title='My Timesheet Entries'
					action={
						<Button
							variant='primary'
							leftIcon={<Plus className='mr-2 h-4 w-4' />}
						>
							Add New Entry
						</Button>
					}
				/>
				<CardBody>
					{isLoading && <SkeletonTable rows={5} cols={6} />}

					{!isLoading && timesheets.length === 0 && (
						<EmptyState
							title='No Timesheet Entries Found'
							message='You have not submitted any timesheet entries yet.'
						/>
					)}

					{!isLoading && timesheets.length > 0 && (
						<Table>
							<TableHead>
								<TableRow>
									<TableHeader className='w-1/12'>
										Status
									</TableHeader>
									<TableHeader className='w-1/12'>
										Date
									</TableHeader>
									<TableHeader className='w-1/12'>
										Time
									</TableHeader>
									<TableHeader className='w-2/12'>
										Course/Module
									</TableHeader>
									<TableHeader className='w-1/12'>
										Entry Type
									</TableHeader>
									<TableHeader className='w-1/12'>
										Duration
									</TableHeader>
									<TableHeader className='w-2/12'>
										Progress
									</TableHeader>
									<TableHeader className='w-2/12 text-center'>
										Actions
									</TableHeader>
									<TableHeader className='w-1/12'></TableHeader>
								</TableRow>
							</TableHead>
							<TableBody>
								{timesheets.map((entry) => {
									const isExpanded = expandedRows.includes(
										entry.id
									);
									const progress = renderTopicProgress(entry);

									return (
										<>
											<TableRow key={entry.id}>
												<TableCell>
													<Badge
														variant={getStatusVariant(
															entry.status
														)}
													>
														{entry.status.toUpperCase()}
													</Badge>
												</TableCell>
												<TableCell className='text-sm'>
													{entry.date}
												</TableCell>
												<TableCell className='text-sm'>
													{formatTimeRange(
														entry.startTime,
														entry.endTime
													)}
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
													{entry.duration} hrs
												</TableCell>
												<TableCell>
													<Progress
														value={progress}
														label={`${progress}%`}
													/>
												</TableCell>
												<TableCell className='text-center space-x-2'>
													{canEdit(entry) && (
														<Button
															variant='info'
															size='sm'
															onClick={() =>
																handleOpenUpdateModal(
																	entry
																)
															}
															disabled={updating}
															leftIcon={
																<Edit className='mr-1 h-4 w-4' />
															}
														>
															Update Topics
														</Button>
													)}
													<Button
														variant='secondary'
														size='sm'
														onClick={() =>
															console.log(
																"Delete feature not yet implemented"
															)
														}
														disabled={updating}
														leftIcon={
															<Trash2 className='mr-1 h-4 w-4' />
														}
													>
														Delete
													</Button>
												</TableCell>
												<TableCell className='w-[40px]'>
													<Button
														variant='ghost'
														size='icon'
														onClick={() =>
															toggleRow(entry.id)
														}
														title={
															isExpanded
																? "Collapse"
																: "Expand"
														}
													>
														{isExpanded ? (
															<ChevronUp className='h-4 w-4' />
														) : (
															<ChevronDown className='h-4 w-4' />
														)}
													</Button>
												</TableCell>
											</TableRow>
											{/* Expanded Details Row */}
											{isExpanded && (
												<TableRow className='bg-gray-50 dark:bg-gray-700'>
													<TableCell
														colSpan={9}
														className='pt-2 pb-4'
													>
														<div className='pl-4 space-y-2'>
															<div className='text-sm'>
																<strong>
																	Topics
																	Logged:
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
																		Extra
																		Topics:
																	</strong>{" "}
																	{
																		entry.extraTopics
																	}
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
															{entry.rejectionReason &&
																entry.status ===
																	"rejected" && (
																	<div className='text-sm text-red-600'>
																		<strong>
																			Rejection
																			Reason:
																		</strong>{" "}
																		{
																			entry.rejectionReason
																		}
																	</div>
																)}
														</div>
													</TableCell>
												</TableRow>
											)}
										</>
									);
								})}
							</TableBody>
						</Table>
					)}
				</CardBody>
			</Card>

			{/* Update Topics Modal */}
			<Modal
				isOpen={showUpdateModal}
				onClose={() => setShowUpdateModal(false)}
				size='lg'
			>
				<ModalHeader
					title='Update Session Topics'
					subtitle='Mark topics as completed or pending'
				/>
				<ModalBody>
					{selectedEntry && (
						<div className='space-y-4'>
							<p className='text-sm text-gray-600 dark:text-gray-400'>
								Mark the topics that were completed during this
								session.
							</p>
							{/* RENDER TOPICS TO UPDATE from the NEW STATE */}
							{topicsToUpdate.map((topic, index) => (
								<label
									key={topic.id || index}
									className='flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'
								>
									<input
										type='checkbox'
										checked={topic.completed} // Use CHECKED, not defaultChecked
										onChange={(e) =>
											handleTopicCheck(
												topic.id,
												e.target.checked
											)
										} // ADDED ONCHANGE HANDLER
										className='rounded text-indigo-600 focus:ring-indigo-500'
									/>
									<div className='flex-1'>
										<div className='font-medium'>
											{topic.name}
										</div>
										<div className='text-sm text-gray-500'>
											{topic.section}
										</div>
									</div>
									<Badge
										variant={
											topic.completed
												? "success"
												: "warning"
										}
									>
										{topic.completed
											? "Completed"
											: "Pending"}
									</Badge>
								</label>
							))}
						</div>
					)}
				</ModalBody>
				<ModalFooter>
					<Button
						variant='secondary'
						onClick={() => setShowUpdateModal(false)}
						disabled={updating}
					>
						Cancel
					</Button>
					<Button
						variant='primary'
						onClick={handleTopicsUpdated} // Uses the modified topicsToUpdate state
						disabled={updating}
						leftIcon={<Edit className='mr-2 h-4 w-4' />}
					>
						{updating ? "Updating..." : "Update Topics"}
					</Button>
				</ModalFooter>
			</Modal>
		</>
	);
};

export default TimesheetMyEntries;