import { Calendar, CalendarIcon, LucideChevronDown, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { AnimatePresence, motion as Motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFilteredMenu, useOutsideClick } from "../../../../hooks";
import {
	setBreadcrumbs,
	setHeaderInfo,
	useCreateScheduleMutation,
	useDeleteScheduleMutation,
	useGetAllInfrastructureQuery,
	useGetAssignCourseQuery,
	useGetCourseGroupsQuery,
	useGetEligibleStaffQuery,
	useGetSchedulesQuery,
	useUpdateScheduleMutation,
} from "../../../../store";
import { selectUserRole } from "../../../../store/selectors";
import { notify } from "../../../../utils/Notify";
import {
	Button,
	Card,
	CardBody,
	ConfirmDialog,
	CustomDatePicker,
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

const ScheduleTable = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canAccessScheduleTable = pathSet.has("/schedule-session-timesheet-management/create-schedule") && userRole === "COURSE_COORDINATOR";

	const [filters, setFilters] = useState({
		courseCode: "",
		startDate: "",
		endDate: "",
		skipDays: [],
	});

	const [deleteConfirm, setDeleteConfirm] = useState({
		open: false,
		index: null,
		sessionId: null,
	});

	const [scheduleData, setScheduleData] = useState([]);
	const [editingCell, setEditingCell] = useState(null);
	const [conflicts, setConflicts] = useState([]);
	const [savingSessionId, setSavingSessionId] = useState(null); // Granular loading state

	// RTK Query hooks
	// assignCourseAndModules =  List<CourseCoordinatorAssignResponseDTO> = courseCode, courseName, current, List<ModuleResponseDTO>
	// ModuleResponseDTO = id, title, theoryHours, practicalHours, moduleRouterId
	const { data: assignCourseAndModules = [], isLoading: loadingAssignCourseAndModules } = useGetAssignCourseQuery();

	const uniqueCourseNames = useMemo(() => {
		return Array.from(new Set(assignCourseAndModules.map((item) => item.courseName)));
	}, [assignCourseAndModules]);
	console.log("unique course names: ", uniqueCourseNames);
	const courseOptions = useMemo(() => {
		return [
			{ value: "", label: "Select Course" },
			...assignCourseAndModules.map((item) => ({
				value: item.courseCode,
				label: item.courseCode,
			})),
		];
	}, [assignCourseAndModules]);

	// eligible staff params

	const { data: eligibleStaff = [] } = useGetEligibleStaffQuery(
		{ courseNames: uniqueCourseNames, multiple: true },
		{ skip: uniqueCourseNames.length === 0 }
	);
	console.log("eligible staff: ", eligibleStaff);
	const staffOptions = useMemo(() => {
		const options = eligibleStaff.map((staff) => ({
			value: staff.id,
			label: `${staff.name} ${staff.courseSpecialization === "MULTIPLE" ? "Multiple Specialization" : staff.courseSpecialization}`,
		}));
		// Add an initial unassigned option
		options.unshift({ value: "", lable: "---Select Staff---" });
		return options;
	}, [eligibleStaff]);

	const { data: venues = [] } = useGetAllInfrastructureQuery();
	console.log("venues: ", venues);
	const venueOptions = useMemo(() => {
		return [
			{ value: "", label: "Select Venue" },
			...venues.map((v) => ({
				value: v.id,
				label: v.title,
			})),
		];
	}, [venues]);

	const datePickerValue = useMemo(
		() => ({
			start: filters.startDate ? new Date(filters.startDate) : null,
			end: filters.endDate ? new Date(filters.endDate) : null,
		}),
		[filters.startDate, filters.endDate]
	);

	// Memoize query arguments to prevent unstable object references
	const scheduleQueryArgs = useMemo(
		() => ({
			courseCode: filters.courseCode,
			startDate: filters.startDate,
			endDate: filters.endDate,
		}),
		[filters.courseCode, filters.startDate, filters.endDate]
	);

	const { data: existingSchedules, isLoading: loadingSchedules } = useGetSchedulesQuery(scheduleQueryArgs, {
		skip: !filters.courseCode || !filters.startDate || !filters.endDate,
	});

	const [createSchedule, { isLoading: creating, isSuccess: isCreateSuccess, isError: isCreateError, error: createError, reset: resetCreate }] =
		useCreateScheduleMutation();
	const [updateSchedule, { isLoading: updating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError, reset: resetUpdate }] =
		useUpdateScheduleMutation();
	const [deleteSchedule, { isLoading: deleting, isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError, reset: resetDelete }] =
		useDeleteScheduleMutation();

	const currentCourseDetails = useMemo(() => {
		const selectedCourse = assignCourseAndModules.find((acm) => acm.courseCode === filters.courseCode);
		return selectedCourse;
	}, [assignCourseAndModules, filters.courseCode]);
	console.log("current course details: ", currentCourseDetails);
	const isCurrentCourseEditable = useMemo(() => {
		if (!currentCourseDetails) return false;
		return currentCourseDetails.current === true;
	}, [currentCourseDetails]);
	console.log("is current course editable: ", isCurrentCourseEditable);
	const { data: courseGroups = [] } = useGetCourseGroupsQuery(
		{ courseCode: currentCourseDetails?.courseCode },
		{
			skip: !currentCourseDetails?.current,
		}
	);
	console.log("Course Group: 	", courseGroups);
	const courseGroupOptions = useMemo(() => {
		return [
			{ value: "", label: "Select Course Group" },
			...courseGroups.map((cg) => ({
				value: cg.title,
				label: cg.title,
			})),
		];
	}, [courseGroups]);

	const modules = useMemo(() => {
		const selectedCourse = assignCourseAndModules.find((acm) => acm.courseCode === filters.courseCode);
		return selectedCourse ? selectedCourse.assignCourseModuleList : [];
	}, [assignCourseAndModules, filters.courseCode]);

	const moduleOptions = useMemo(() => {
		return [
			{ value: "", label: "Select Module" },
			...modules.map((module) => ({
				value: module.id,
				label: `${module.title} (${module.theoryHours}T/${module.practicalHours}P)`,
			})),
		];
	}, [modules]);

	const notAccessible = () => {
		return <ErrorFallback errorMessage='You are not authorized to access this page.' />;
	};

	useEffect(() => {
		if (!canAccessScheduleTable) {
			notAccessible();
		}
	}, [canAccessScheduleTable]);

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
						label: "Save/Print",
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
		if (isCreateSuccess) {
			notify.success("Schedule session has been created successfully.");
			setSavingSessionId(null);
			resetCreate();
		}
		if (isCreateError) {
			const message = createError?.data?.message || "Failed to create session.";
			notify.error(message);
			setSavingSessionId(null);
			resetCreate();
		}
	}, [isCreateSuccess, isCreateError, createError, dispatch, resetCreate]);

	useEffect(() => {
		if (isUpdateSuccess) {
			notify.success("Schedule session has been updated successfully.");
			setSavingSessionId(null);
			resetUpdate();
		}
		if (isUpdateError) {
			const message = updateError?.data?.message || "Failed to update session.";
			notify.error(message);
			setSavingSessionId(null);
			resetUpdate();
		}
	}, [isUpdateSuccess, isUpdateError, updateError, dispatch, resetUpdate]);

	useEffect(() => {
		if (isDeleteSuccess) {
			notify.success("Schedule session has been deleted successfully.");
			resetDelete();
		}
		if (isDeleteError) {
			const message = deleteError?.data?.message || "Failed to delete session.";
			notify.error(message);
			resetDelete();
		}
	}, [isDeleteSuccess, isDeleteError, deleteError, dispatch, resetDelete]);

	const generateScheduleGrid = useCallback((existingSchedules = [], currentFilters) => {
		if (!currentFilters.startDate || !currentFilters.endDate) return [];

		const start = new Date(currentFilters.startDate);
		const end = new Date(currentFilters.endDate);
		const days = [];

		for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
			const dayOfWeek = date.getDay();
			if (!currentFilters.skipDays.includes(dayOfWeek)) {
				days.push(new Date(date));
			}
		}

		const gridData = days
			.map((date) => {
				const dateStr = date.toISOString().split("T")[0];
				const existingSessions = existingSchedules.filter((schedule) => schedule.date === dateStr);

				if (existingSessions.length > 0) {
					return existingSessions.map((session) => ({
						id: session.id,
						date: dateStr,
						dayName: date.toLocaleDateString("en-US", {
							weekday: "short",
							day: "2-digit",
							month: "short",
						}),
						startTime: session.startTime || "",
						endTime: session.endTime || "",
						activity: session.activity,
						module: session.moduleId,
						faculty: session.facultyIds || [],
						groups: session.groupIds || [],
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
							startTime: "",
							endTime: "",
							activity: "",
							module: "",
							faculty: [],
							groups: [],
							venue: "",
							isExisting: false,
						},
					];
				}
			})
			.flat();

		return gridData.sort((a, b) => new Date(a.date) - new Date(b.date));
	}, []);
	const checkForConflicts = useCallback(async (data) => {
		const newConflicts = [];
		const sessionsWithData = data.filter((session) => session.time && session.faculty.length > 0 && session.venue);

		for (let i = 0; i < sessionsWithData.length; i++) {
			for (let j = i + 1; j < sessionsWithData.length; j++) {
				const sessionA = sessionsWithData[i];
				const sessionB = sessionsWithData[j];

				if (sessionA.date === sessionB.date && sessionA.time === sessionB.time) {
					const facultyConflict = sessionA.faculty.some((fA) => sessionB.faculty.includes(fA));
					const venueConflict = sessionA.venue === sessionB.venue;

					if (facultyConflict || venueConflict) {
						newConflicts.push({
							type: facultyConflict ? "faculty" : "venue",
							sessionA,
							sessionB,
							message: `${facultyConflict ? "Faculty" : "Venue"} conflict on ${sessionA.dayName} at ${sessionA.time}`,
						});
					}
				}
			}
		}

		setConflicts(newConflicts);
	}, []);
	useEffect(() => {
		if (filters.startDate && filters.endDate && existingSchedules) {
			const gridData = generateScheduleGrid(existingSchedules, filters);
			setScheduleData(gridData);
			checkForConflicts(gridData);
		}
	}, [existingSchedules, filters, generateScheduleGrid, checkForConflicts]);

	const handleFilterChange = (name, value) => {
		setFilters((prev) => ({ ...prev, [name]: value }));
	};

	const updateScheduleRow = (index, field, value) => {
		setScheduleData((prev) => {
			// shallow clone the list
			const updated = [...prev];

			// guard: if index invalid, return previous state unchanged
			if (index < 0 || index >= updated.length) return prev;

			// clone the specific session and update only the given field
			const updatedSession = { ...updated[index], [field]: value };

			// If we're updating startTime/endTime, keep a derived `time` for display/use elsewhere
			if (field === "startTime" || field === "endTime") {
				const start = field === "startTime" ? value : updatedSession.startTime;
				const end = field === "endTime" ? value : updatedSession.endTime;
				updatedSession.time = start && end ? `${start}-${end}` : "";
			}

			updated[index] = updatedSession;

			checkForConflicts(updated);

			return updated;
		});
	};

	const addSession = (dateStr) => {
		if (!isCurrentCourseEditable) {
			notify.error("Cannot add sessions to past or non-current courses.");
			return;
		}

		const newSession = {
			id: null,
			date: dateStr,
			dayName: scheduleData.find((s) => s.date === dateStr)?.dayName || "",
			time: "",
			activity: "",
			module: "",
			faculty: [],
			venue: "",
			isExisting: false,
		};

		setScheduleData((prev) => [...prev, newSession].sort((a, b) => new Date(a.date) - new Date(b.date)));
	};

	const handleDeleteClick = (index, sessionId) => {
		if (!isCurrentCourseEditable) {
			notify.error("Cannot delete sessions from past or non-current courses.");
			return;
		}

		if (sessionId) {
			setDeleteConfirm({ open: true, index, sessionId });
		} else {
			// Local delete
			setScheduleData((prev) => {
				const updated = prev.filter((_, i) => i !== index);
				checkForConflicts(updated);
				return updated;
			});
		}
	};

	const handleConfirmDelete = async () => {
		const { sessionId } = deleteConfirm;
		if (sessionId) {
			try {
				await deleteSchedule({ currentFilters: filters, sessionId }).unwrap();
			} catch {
				// Handled by useEffect
			}
		}
		setDeleteConfirm({ open: false, index: null, sessionId: null });
	};

	const saveSession = async (index) => {
		if (!isCurrentCourseEditable) {
			// dispatch(showNotification({ type: "error", title: "Read-Only", message: "Cannot save changes to past or non-current courses." }));
			return;
		}

		const session = scheduleData[index];
		const isSavingExisting = session.isExisting && session.id;

		if (!session.time || !session.activity || !session.module || session.faculty.length === 0 || !session.venue) {
			notify.error("Please fill all required fields");
			return;
		}

		setSavingSessionId(session.id || `new-${index}`);

		try {
			const sessionData = {
				scheduleDate: session.date,
				activity: session.activity,
				courseCode: filters.courseCode,
				facultyIds: session.faculty,
				groupIds: session.groups,
				timeSlot: {
					startTime: session.startTime,
					endTime: session.endTime,
				},
				module: session.module,
				venue: session.venue,
				...(isSavingExisting && { id: session.id }),
			};

			let result;

			if (isSavingExisting) {
				result = await updateSchedule({ currentFilters: filters, schedule: sessionData }).unwrap();
			} else {
				// Create (Pessimistic Patching in API slice)
				result = await createSchedule({ currentFilters: filters, schedule: sessionData }).unwrap();

				// Update local state with the new server ID
				// The API slice updates the RTK cache, but we must update the component's local array
				if (result.id) {
					setScheduleData((prev) => {
						const updated = [...prev];
						// Find the temporary session using the index
						const tempSession = updated[index];

						// Replace the temporary item with the server response data + local UI data
						updated[index] = {
							...tempSession, // Preserve local UI data like dayName
							...sessionData,
							id: result.id, // Use the new ID from the server
							isExisting: true,
						};
						return updated;
					});
				}
			}
			setEditingCell(null);
		} catch {
			// Handled by useEffect
		} finally {
			setSavingSessionId(null);
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

	const renderCell = (session, index, field) => {
		const isEditing = editingCell === `${index}-${field}`;

		if (isEditing && isCurrentCourseEditable) {
			switch (field) {
				case "time":
					return (
						<div className='flex items-center space-x-2'>
							<Input
								type='time'
								value={session.startTime || ""}
								onChange={(e) => updateScheduleRow(index, "startTime", e.target.value)}
								className='w-24'
								autoFocus
							/>
							<span>-</span>
							<Input
								type='time'
								value={session.endTime || ""}
								onChange={(e) => updateScheduleRow(index, "endTime", e.target.value)}
								className='w-24'
							/>
						</div>
					);
				case "activity":
					return (
						<CustomSelect
							value={session[field]}
							onChange={(e) => {
								updateScheduleRow(index, field, e.target.value);
								updateScheduleRow(index, "faculty", []);
							}}
							options={activityOptions}
							autoFocus
						/>
					);
				case "module":
					return <CustomSelect value={session[field]} onChange={(e) => updateScheduleRow(index, field, e.target.value)} options={moduleOptions} />;
				case "faculty": {
					// Faculty selection logic depends on the activity (Lab allows multiple)
					const isMultiSelect = session.activity === "Lab";

					return (
						<CustomSelect
							value={isMultiSelect ? session[field] : session[field][0] || ""}
							onChange={(e) => {
								const values =
									isMultiSelect ?
										Array.isArray(e.target.value) ? e.target.value
										: e.target.value ? [e.target.value]
										: []
									: e.target.value ? [e.target.value]
									: [];
								updateScheduleRow(index, field, values.filter(Boolean));
							}}
							options={staffOptions}
							multiple={isMultiSelect}
						/>
					);
				}
				case "groups":
					// only for Activity = Lab
					// for other than Lab, cell will be empty
					// and multi select will be available
					return session.activity === "Lab" ?
							<CustomSelect
								value={session[field]}
								multiple={true}
								onChange={(e) => {
									const values =
										session.activity === "Lab" ?
											Array.isArray(e.target.value) ? e.target.value
											: e.target.value ? [e.target.value]
											: []
										: e.target.value ? [e.target.value]
										: [];
									updateScheduleRow(index, field, values.filter(Boolean));
								}}
								options={courseGroupOptions}
							/>
						:	"";
				case "venue":
					return <CustomSelect value={session[field]} onChange={(e) => updateScheduleRow(index, field, e.target.value)} options={venueOptions} />;
				default:
					return session[field];
			}
		}
		const displayValue = () => {
			if (field === "faculty" && Array.isArray(session[field])) {
				return session[field].map((fId) => eligibleStaff.find((s) => s.id === fId)?.firstName || fId).join(", ");
			}
			if (field === "module") {
				return modules.find((m) => m.id === session[field])?.title || session[field];
			}
			if (field === "venue") {
				return venues.find((v) => v.id === session[field])?.title || session[field];
			}
			if (field === "groups") {
				return courseGroups.find((g) => g.id === session[field])?.title || session[field];
			}
			return session[field];
		};
		return (
			<div
				className={`rounded p-1 ${isCurrentCourseEditable ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : "text-gray-500 italic"}`}
				onClick={() => isCurrentCourseEditable && setEditingCell(`${index}-${field}`)}
				title={isCurrentCourseEditable ? "Click to edit" : "Read-Only: Course is not current"}>
				{displayValue() || (isCurrentCourseEditable ? "Click to edit" : "-")}
			</div>
		);
	};
	const hasConflict = (session) => {
		return conflicts.some(
			(c) =>
				(c.sessionA.date === session.date && c.sessionA.startTime === session.startTime && c.sessionA.endTime === session.endTime) ||
				(c.sessionB.date === session.date && c.sessionB.startTime === session.startTime && c.sessionB.endTime === session.endTime)
		);
	};
	const formatDate = (dateStr) => {
		const date = new Date(dateStr);
		const day = date.getDate();
		const year = date.getFullYear();
		// format: Day, Day(number in two digits), Month(short first three letter), Year(last two digits))
		return `${date.toLocaleDateString("en-US", { weekday: "short" })}, ${day.toString().padStart(2, "0")}, ${date.toLocaleDateString("en-US", {
			month: "short",
		})}, ${year.toString().slice(-2)}`;
	};

	const isAnyLoading = creating || updating || deleting;
	const isSavingThisSession = (session) => {
		const currentId = session.id || `new-${scheduleData?.indexOf(session)}`;
		return currentId === savingSessionId;
	};

	const isFilterReady = filters.courseCode && filters.startDate && filters.endDate;

	const [isPickerOpen, setIsPickerOpen] = useState(false);
	const datePickerWrapperRef = useRef(null);
	useOutsideClick(datePickerWrapperRef, () => setIsPickerOpen(false));

	const formatDateLocal = (date) => {
		if (!date) return "";
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const formatDisplayDate = (dateStr) => {
		if (!dateStr) return "--/--/--";
		return new Date(dateStr).toLocaleDateString("en-IN", {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};
	const handleDateRangeChange = (range) => {
		const startStr = range.start ? formatDateLocal(range.start) : "";
		const endStr = range.end ? formatDateLocal(range.end) : "";
		setFilters((prev) => ({ ...prev, startDate: startStr, endDate: endStr }));
	};
	const handleResetFilters = () => {
		setFilters({
			courseCode: "",
			skipDays: [],
			startDate: "",
			endDate: "",
		});
	};
	return (
		<>
			{/* Filters */}
			<div className='mt-2 mb-6 grid grid-cols-5 gap-4'>
				<CustomSelect
					label={"Course"}
					value={filters.courseCode}
					onChange={(e) => handleFilterChange("courseCode", e.target.value)}
					options={courseOptions}
					loading={loadingAssignCourseAndModules}
				/>
				<CustomSelect
					label={"Skip Days"}
					value={filters.skipDays}
					onChange={(e) => handleFilterChange("skipDays", e.target.value)}
					options={skipDayOptions}
					multiple
				/>
				<div className='relative w-[300px]' ref={datePickerWrapperRef}>
					<button
						type='button'
						onClick={() => setIsPickerOpen(!isPickerOpen)}
						className={`flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3.5 text-left text-[10px] font-black tracking-widest uppercase transition-all ${isPickerOpen ? "bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20" : "border border-zinc-200 bg-white text-amber-400 hover:border-amber-500/50 dark:border-zinc-800 dark:bg-zinc-950"}`}>
						{filters.startDate ? `${formatDisplayDate(filters.startDate)} - ${formatDisplayDate(filters.endDate)}` : "Select Start-End Date"}
						<LucideChevronDown size={14} className={`transition-transform duration-300 ${isPickerOpen ? "rotate-180" : "opacity-30"}`} />
					</button>
					<div className='absolute top-full left-0 z-[100] mt-2 h-[330px] w-full'>
						<AnimatePresence mode='wait'>
							{isPickerOpen && (
								<Motion.div
									layout
									initial={{ opacity: 0, height: 0, scale: 0.98, y: -10 }}
									animate={{ opacity: 1, height: "auto", scale: 1, y: 0 }}
									exit={{ opacity: 0, height: 0, scale: 0.98, y: -10 }}
									transition={{ type: "spring", stiffness: 400, damping: 35, opacity: { duration: 0.3 } }}
									className='w-full origin-top overflow-hidden'>
									<CustomDatePicker variant='range' value={datePickerValue} onChange={handleDateRangeChange} className='origin-top scale-110' />
								</Motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
				<button
					title='reset filters'
					className='flex h-11 w-11 cursor-pointer items-center justify-center transition-all duration-300 ease-in-out active:scale-90'
					onClick={handleResetFilters}>
					<RotateCcw className='text-amber-500' size={24} />
				</button>
			</div>

			{/* {conflicts.length > 0 && (
				<div className='p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-red-900/40 dark:text-red-300' role='alert'>
					**Warning: Schedule Conflicts Detected!** Please review the highlighted sessions before saving.
					<ul className='mt-2 list-disc list-inside'>
						{conflicts.slice(0, 3).map((c, i) => (
							<li key={i}>{c.message}</li>
						))}
						{conflicts.length > 3 && <li>... and {conflicts.length - 3} more conflicts.</li>}
					</ul>
				</div>
			)} */}

			<Card>
				<CardBody>
					{!isFilterReady ?
						<EmptyState
							icon={<CalendarIcon className='h-12 w-12' />}
							title='Select Filters to View Schedule'
							description='Please select all filter criteria (Course and a date range) to load the schedule.'
						/>
					: loadingSchedules ?
						<SkeletonTable />
					: scheduleData.length === 0 ?
						<EmptyState
							icon={<Calendar className='h-12 w-12' />}
							title='No Schedule Found'
							description='No schedule found for the selected filters. Get started by creating your first schedule to manage your academic sessions.'
						/>
					:	<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader className='w-1/6 rounded-tl-xl'>Date/Day</TableHeader>
										<TableHeader className='w-1/6'>Time</TableHeader>
										<TableHeader className='w-1/6'>Activity</TableHeader>
										<TableHeader className='w-1/6'>Module</TableHeader>
										<TableHeader className='w-1/6'>Faculty</TableHeader>
										<TableHeader className='w-1/6'>Venue</TableHeader>
										<TableHeader className='w-1/6'>Groups</TableHeader>
										<TableHeader className='w-1/12 rounded-tr-xl text-center'>Actions</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<div className='scrollbar-none h-[430px] overflow-y-auto rounded-b-2xl'>
								<Table>
									<TableBody>
										{scheduleData.map((session, index) => {
											const conflict = hasConflict(session);
											const isNew = !session.id && !session.isExisting;
											const isSaving = isSavingThisSession(session);
											return (
												<TableRow
													key={session.id || index}
													className={`${conflict ? "bg-red-50 dark:bg-red-900/60" : ""} ${isNew ? "bg-blue-50 dark:bg-blue-900/60" : ""}`}>
													<TableCell className='w-1/6'>{formatDate(session.date)}</TableCell>
													<TableCell className='w-1/6'>
														{renderCell(session, index, "time")}
														{isCurrentCourseEditable && (
															<Button
																variant='secondary'
																icon={Plus}
																onClick={() => addSession(session.date)}
																className='mt-1 h-8 rounded-xl text-xs text-indigo-600 hover:text-indigo-800'
																disabled={isAnyLoading}>
																Add Session
															</Button>
														)}
													</TableCell>
													<TableCell className='w-1/6'>{renderCell(session, index, "activity")}</TableCell>
													<TableCell className='w-1/6'>{renderCell(session, index, "module")}</TableCell>
													<TableCell className='w-1/6'>{renderCell(session, index, "faculty")}</TableCell>
													<TableCell className='w-1/6'>{renderCell(session, index, "venue")}</TableCell>
													<TableCell className='w-1/6'>{renderCell(session, index, "groups")}</TableCell>
													<TableCell className='w-1/12 text-center'>
														<Button
															icon={Save}
															variant='gradientEmerald'
															onClick={() => saveSession(index)}
															loading={isSaving}
															disabled={
																!isCurrentCourseEditable ||
																isSaving ||
																isAnyLoading ||
																!session.time ||
																!session.activity ||
																!session.module ||
																!session.venue ||
																session.faculty.length === 0
															}
														/>
														<Button
															icon={Trash2}
															variant='gradientRose'
															onClick={() => handleDeleteClick(index, session.id)}
															loading={false}
															// Delete session
														/>
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
			<ConfirmDialog
				isOpen={deleteConfirm.open}
				onClose={() => setDeleteConfirm({ open: false, index: null, sessionId: null })}
				onConfirm={handleConfirmDelete}
				title='Delete Session'
				message='Are you sure you want to delete this session? This action cannot be undone.'
				confirmText='Delete'
				type='danger'
			/>
		</>
	);
};

export default ScheduleTable;
