import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Trash2, Save, Calendar, CalendarIcon } from "lucide-react";
import {
	useGetSchedulesQuery,
	useCreateScheduleMutation,
	useUpdateScheduleMutation,
	useDeleteScheduleMutation,
	useCheckScheduleConflictsMutation,
	useGetBatchCyclesQuery,
	useGetCourseTypesQuery,
	useGetCoursesQuery,
	useGetModulesQuery,
	useGetInfrastructuresQuery,
} from "../../../../../store/api/schedulingApi";
import { setBreadcrumbs } from "../../../../../store/slices/breadcrumbSlice";
import { showNotification } from "../../../../../store/slices/uiSlice";
import {
	// selectCurrentUser,
	selectAccessibleMenus,
} from "../../../../../store/selectors/authSelectors";
import {
	Card,
	CardBody,
	CardHeader,
	Table,
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
	Button,
	Select,
	Input,
	FormField,
	Grid,
	GridItem,
	VStack,
	HStack,
	Badge,
	Alert,
	AlertDescription,
	CustomSelect,
	Skeleton,
	SkeletonTable,
	EmptyState,
} from "../../../layout";
import { setHeaderInfo, useGetEligibleStaffQuery } from "../../../../store";

const ScheduleTable = () => {
	const dispatch = useDispatch();
	// const currentUser = useSelector(selectCurrentUser);
	const accessibleMenus = useSelector(selectAccessibleMenus);

	const [filters, setFilters] = useState({
		batchCycle: "",
		courseType: "",
		course: "",
		startDate: "",
		endDate: "",
		skipDays: [],
	});

	const [scheduleData, setScheduleData] = useState([]);
	const [editingCell, setEditingCell] = useState(null);
	const [conflicts, setConflicts] = useState([]);

	// RTK Query hooks
	const { data: batchCycles = [], isLoading: loadingBatchCycles } =
		useGetBatchCyclesQuery();
	const { data: courseTypes = [], isLoading: loadingCourseTypes } =
		useGetCourseTypesQuery();
	// send course_code also
	const { data: courses = [], isLoading: loadingCourses } =
		useGetCoursesQuery(
			{
				batchCycle: filters.batchCycle,
				courseType: filters.courseType,
			},
			{ skip: !filters.batchCycle || !filters.courseType }
		);

	const { data: modules = [] } = useGetModulesQuery(
		{
			courseId: filters.course,
		},
		{ skip: !filters.course }
	);

	const { data: staff = [] } = useGetEligibleStaffQuery({
		role: ["FACULTY", "LAB_INSTRUCTOR"],
	});

	const { data: venues = [] } = useGetInfrastructuresQuery();

	const {
		data: existingSchedules = [],
		refetch: refetchSchedules,
		isLoading: loadingSchedules,
	} = useGetSchedulesQuery(
		{
			batchCycle: filters.batchCycle,
			courseType: filters.courseType,
			course: filters.course,
			startDate: filters.startDate,
			endDate: filters.endDate,
		},
		{
			skip:
				!filters.batchCycle ||
				!filters.courseType ||
				!filters.course ||
				!filters.startDate ||
				!filters.endDate,
		}
	);

	const [createSchedule, { isLoading: creating }] =
		useCreateScheduleMutation();
	const [updateSchedule, { isLoading: updating }] =
		useUpdateScheduleMutation();
	const [deleteSchedule, { isLoading: deleting }] =
		useDeleteScheduleMutation();
	const [checkConflicts] = useCheckScheduleConflictsMutation();

	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Schedule",
				description: "View and manage schedule.",
				action: [
					{
						label: "Export",
					},
					{
						label: "Print",
					},
				],
			})
		);
		dispatch(
			setBreadcrumbs([
				{ title: "Home", path: "/dashboard", icon: "home" },
				{
					title: "Scheduling, Sessions & Timesheet",
					icon: "calendar",
				},
				{
					title: "Schedule",
					path: "/scheduling-sessions/schedule",
					icon: "calendar-days",
				},
			])
		);
	}, [dispatch]);

	useEffect(() => {
		if (filters.startDate && filters.endDate) {
			generateScheduleGrid();
		}
	}, [filters.startDate, filters.endDate]);

	const generateScheduleGrid = () => {
		const start = new Date(filters.startDate);
		const end = new Date(filters.endDate);
		const days = [];

		for (
			let date = new Date(start);
			date <= end;
			date.setDate(date.getDate() + 1)
		) {
			const dayOfWeek = date.getDay();
			if (!filters.skipDays.includes(dayOfWeek)) {
				days.push(new Date(date));
			}
		}

		const gridData = days
			.map((date) => {
				const dateStr = date.toISOString().split("T")[0];
				const existingSessions = existingSchedules.filter(
					(schedule) => schedule.date === dateStr
				);

				if (existingSessions.length > 0) {
					return existingSessions.map((session) => ({
						id: session.id,
						date: dateStr,
						dayName: date.toLocaleDateString("en-US", {
							weekday: "short",
							day: "2-digit",
							month: "short",
						}),
						time: session.time,
						activity: session.activity,
						module: session.moduleId,
						faculty: session.facultyIds || [],
						venue: session.venueId,
						isExisting: true,
					}));
				} else {
					return [
						{
							id: null,
							date: dateStr,
							dayName: date.toLocaleDateString("en-US", {
								weekday: "short",
								day: "2-digit",
								month: "short",
							}),
							time: "",
							activity: "",
							module: "",
							faculty: [],
							venue: "",
							isExisting: false,
						},
					];
				}
			})
			.flat();

		setScheduleData(gridData);
		checkForConflicts(gridData);
	};

	const checkForConflicts = async (data) => {
		const conflicts = [];
		const sessionsWithData = data.filter(
			(session) =>
				session.time && session.faculty.length > 0 && session.venue
		);

		for (let i = 0; i < sessionsWithData.length; i++) {
			for (let j = i + 1; j < sessionsWithData.length; j++) {
				const sessionA = sessionsWithData[i];
				const sessionB = sessionsWithData[j];

				if (
					sessionA.date === sessionB.date &&
					sessionA.time === sessionB.time
				) {
					const facultyConflict = sessionA.faculty.some((fA) =>
						sessionB.faculty.includes(fA)
					);
					const venueConflict = sessionA.venue === sessionB.venue;

					if (facultyConflict || venueConflict) {
						conflicts.push({
							type: facultyConflict ? "faculty" : "venue",
							sessionA,
							sessionB,
							message: `${
								facultyConflict ? "Faculty" : "Venue"
							} conflict on ${sessionA.dayName} at ${
								sessionA.time
							}`,
						});
					}
				}
			}
		}

		setConflicts(conflicts);
	};

	const updateFilter = (key, value) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
			...(key === "batchCycle" && { courseType: "", course: "" }),
			...(key === "courseType" && { course: "" }),
		}));
	};

	const updateScheduleRow = (index, field, value) => {
		setScheduleData((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], [field]: value };
			checkForConflicts(updated);
			return updated;
		});
	};

	const addSession = (dateStr) => {
		const newSession = {
			id: null,
			date: dateStr,
			dayName:
				scheduleData.find((s) => s.date === dateStr)?.dayName || "",
			time: "",
			activity: "",
			module: "",
			faculty: [],
			venue: "",
			isExisting: false,
		};

		setScheduleData((prev) =>
			[...prev, newSession].sort(
				(a, b) => new Date(a.date) - new Date(b.date)
			)
		);
	};

	const deleteSession = async (index, sessionId) => {
		if (sessionId) {
			try {
				await deleteSchedule(sessionId).unwrap();
				dispatch(
					showNotification({
						type: "success",
						title: "Session Deleted",
						message:
							"Schedule session has been deleted successfully",
					})
				);
				refetchSchedules();
			} catch (error) {
				dispatch(
					showNotification({
						type: "error",
						title: "Deletion Failed",
						message: error.message || "Failed to delete session",
					})
				);
			}
		} else {
			setScheduleData((prev) => prev.filter((_, i) => i !== index));
		}
	};

	const saveSession = async (index) => {
		const session = scheduleData[index];

		if (
			!session.time ||
			!session.activity ||
			!session.module ||
			session.faculty.length === 0 ||
			!session.venue
		) {
			dispatch(
				showNotification({
					type: "error",
					title: "Validation Error",
					message: "Please fill all required fields",
				})
			);
			return;
		}

		try {
			const sessionData = {
				...session,
				batchCycle: filters.batchCycle,
				courseType: filters.courseType,
				course: filters.course,
				moduleId: session.module,
				facultyIds: session.faculty,
				venueId: session.venue,
			};

			if (session.isExisting && session.id) {
				await updateSchedule({
					id: session.id,
					...sessionData,
				}).unwrap();
				dispatch(
					showNotification({
						type: "success",
						title: "Session Updated",
						message:
							"Schedule session has been updated successfully",
					})
				);
			} else {
				await createSchedule(sessionData).unwrap();
				dispatch(
					showNotification({
						type: "success",
						title: "Session Created",
						message:
							"Schedule session has been created successfully",
					})
				);
			}

			setEditingCell(null);
			refetchSchedules();
		} catch (error) {
			dispatch(
				showNotification({
					type: "error",
					title: "Save Failed",
					message: error.message || "Failed to save session",
				})
			);
		}
	};

	const activityOptions = [
		{ value: "", label: "Select Activity" },
		{ value: "Lecture", label: "Lecture" },
		{ value: "Lab", label: "Lab" },
		{ value: "Workshop", label: "Workshop" },
		{ value: "Seminar", label: "Seminar" },
	];

	const skipDayOptions = [
		{ value: 0, label: "Sunday" },
		{ value: 1, label: "Monday" },
		{ value: 2, label: "Tuesday" },
		{ value: 3, label: "Wednesday" },
		{ value: 4, label: "Thursday" },
		{ value: 5, label: "Friday" },
		{ value: 6, label: "Saturday" },
	];

	const canCreateSchedule = accessibleMenus.includes(
		"/scheduling-sessions/schedule"
	);

	const renderCell = (session, index, field) => {
		const isEditing = editingCell === `${index}-${field}`;

		if (isEditing) {
			switch (field) {
				case "time":
					return (
						<Input
							type='text'
							value={session[field]}
							onChange={(e) =>
								updateScheduleRow(index, field, e.target.value)
							}
							placeholder='09:00-10:00'
							onBlur={() => setEditingCell(null)}
							autoFocus
						/>
					);
				case "activity":
					return (
						<Select
							value={session[field]}
							onChange={(e) =>
								updateScheduleRow(index, field, e.target.value)
							}
							options={activityOptions}
							onBlur={() => setEditingCell(null)}
							autoFocus
						/>
					);
				case "module":
					return (
						<Select
							value={session[field]}
							onChange={(e) =>
								updateScheduleRow(index, field, e.target.value)
							}
							options={[
								{ value: "", label: "Select Module" },
								...modules.map((m) => ({
									value: m.id,
									label: m.title,
								})),
							]}
							onBlur={() => setEditingCell(null)}
							autoFocus
						/>
					);
				case "faculty":
					return (
						<Select
							value={session[field]}
							onChange={(e) => {
								const values =
									session.activity === "Lab"
										? Array.isArray(e.target.value)
											? e.target.value
											: [e.target.value]
										: [e.target.value];
								updateScheduleRow(index, field, values);
							}}
							options={[
								{ value: "", label: "Select Faculty" },
								...staff.map((s) => ({
									value: s.id,
									label: s.firstName + " " + s.lastName,
								})),
							]}
							multiple={session.activity === "Lab"}
							onBlur={() => setEditingCell(null)}
							autoFocus
						/>
					);
				case "venue":
					return (
						<Select
							value={session[field]}
							onChange={(e) =>
								updateScheduleRow(index, field, e.target.value)
							}
							options={[
								{ value: "", label: "Select Venue" },
								...venues.map((v) => ({
									value: v.id,
									label: v.name,
								})),
							]}
							onBlur={() => setEditingCell(null)}
							autoFocus
						/>
					);
				default:
					return session[field];
			}
		}

		return (
			<div
				className='cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-1 rounded'
				onClick={() => setEditingCell(`${index}-${field}`)}
			>
				{field === "faculty" && Array.isArray(session[field])
					? session[field]
							.map(
								(fId) =>
									staff.find((s) => s.id === fId)
										?.firstName || fId
							)
							.join(", ")
					: field === "module"
					? modules.find((m) => m.id === session[field])?.title ||
					  session[field]
					: field === "venue"
					? venues.find((v) => v.id === session[field])?.name ||
					  session[field]
					: session[field] || "Click to edit"}
			</div>
		);
	};
	const hasConflict = (session) => {
		return conflicts.some(
			(c) =>
				(c.scheduleA.date === session.date &&
					c.scheduleA.time === session.time) ||
				(c.scheduleB.date === session.date &&
					c.scheduleB.time === session.time)
		);
	};
	const formatDate = (date) => {
		const day = date.getDate();
		const year = date.getFullYear();
		// format: Day, Day(number in two digits), Month(short first three letter), Year(last two digits))
		return `${date.toLocaleDateString("en-US", { weekday: "short" })}, ${day
			.toString()
			.padStart(2, "0")}, ${date.toLocaleDateString("en-US", {
			month: "short",
		})}, ${year.toString().slice(-2)}`;
	};
	return (
		<>
			{/* Filters */}
			<div className='grid grid-cols-6 gap-4'>
				<CustomSelect
					value={filters.batchCycle}
					onChange={(e) => updateFilter("batchCycle", e.target.value)}
					options={[
						{
							value: "",
							label: "Select Batch Cycle",
						},
						...batchCycles.map((bc) => ({
							value: bc.id,
							label: bc.title,
						})),
					]}
					loading={loadingBatchCycles}
				/>
				<CustomSelect
					value={filters.courseType}
					onChange={(e) => updateFilter("courseType", e.target.value)}
					options={[
						{
							value: "",
							label: "Select Course Type",
						},
						...courseTypes.map((ct) => ({
							value: ct.id,
							label: ct.title,
						})),
					]}
					loading={loadingCourseTypes}
					disabled={!filters.batchCycle}
				/>
				<CustomSelect
					value={filters.course}
					onChange={(e) => updateFilter("course", e.target.value)}
					options={[
						{ value: "", label: "Select Course" },
						...courses.map((c) => ({
							value: c.id,
							label: c.title,
						})),
					]}
					loading={loadingCourses}
					disabled={!filters.courseType}
				/>
				<CustomSelect
					value={filters.skipDays}
					onChange={(e) => updateFilter("skipDays", e.target.value)}
					options={skipDayOptions}
					multiple
				/>
				<Input
					type='date'
					value={filters.startDate}
					onChange={(e) => updateFilter("startDate", e.target.value)}
				/>
				<Input
					type='date'
					value={filters.endDate}
					onChange={(e) => updateFilter("endDate", e.target.value)}
					min={filters.startDate}
				/>
			</div>
			<Card>
				<CardBody>
					{loadingSchedules ? (
						<SkeletonTable />
					) : scheduleData.length === 0 ? (
						<EmptyState
							icon={<Calendar className='w-12 h-12' />}
							title='No Schedule Found'
							description='No schedule found for the selected filters. Get started by creating your first schedule to manage your academic sessions.'
						/>
					) : (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-1/6 rounded-tl-xl'>
											Date/Day
										</TableHeader>
										<TableHeader className='w-1/12'>
											Time
										</TableHeader>
										<TableHeader className='w-1/6'>
											Activity
										</TableHeader>
										<TableHeader className='w-1/6'>
											Module
										</TableHeader>
										<TableHeader className='w-1/6'>
											Faculty
										</TableHeader>
										<TableHeader className='w-1/6'>
											Venue
										</TableHeader>
										<TableHeader className='w-1/12 text-center rounded-tr-xl'>
											Actions
										</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='h-[430px] rounded-b-2xl overflow-y-auto scrollbar-none'>
								<Table>
									<TableBody>
										{scheduleData.map((session, index) => {
											const conflict =
												hasConflict(session);
											const isNew = !session.id;
											return (
												<TableRow
													key={index}
													className={`${
														conflict
															? "bg-red-50 dark:bg-red-900/60"
															: ""
													} ${
														isNew
															? "bg-blue-50 dark:bg-blue-900/60"
															: ""
													}`}
												>
													<TableCell className='w-1/6'>
														{formatDate(
															session.date
														)}
													</TableCell>
													<TableCell className='w-1/12'>
														{renderCell(
															session,
															index,
															"time"
														)}
														<Button
															size='xs'
															variant='ghost'
															onClick={() =>
																addSession(
																	session.date
																)
															}
															className='mt-1 text-xs text-indigo-600 hover:text-indigo-800'
														>
															<Plus className='w-3 h-3 mr-1' />
															Add Session
														</Button>
													</TableCell>
													<TableCell className='w-1/6'>
														{renderCell(
															session,
															index,
															"activity"
														)}
													</TableCell>
													<TableCell className='w-1/6'>
														{renderCell(
															session,
															index,
															"module"
														)}
													</TableCell>
													<TableCell className='w-1/6'>
														{renderCell(
															session,
															index,
															"faculty"
														)}
													</TableCell>
													<TableCell className='w-1/6'>
														{renderCell(
															session,
															index,
															"venue"
														)}
													</TableCell>
													<TableCell className='w-1/12 text-center'>
														<Button
															size='sm'
															variant='ghost'
															onClick={() =>
																saveSession(
																	index
																)
															}
															loading={false}
															disabled={
																!session.time ||
																!session.activity ||
																!session.module ||
																session.venue
															}
															title='Save session'
															className='text-green-600 hover:text-green-800'
														>
															<Save className='w-4 h-4' />
														</Button>
														<Button
															size='sm'
															variant='ghost'
															onClick={() =>
																deleteSession(
																	index,
																	session.id
																)
															}
															loading={false}
															title='Delete session'
															className='text-red-600 hover:text-red-800'
														>
															<Trash2 className='w-4 h-4' />
														</Button>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</div>
						</>
					)}
				</CardBody>
			</Card>
		</>
	);
};

export default ScheduleTable;
