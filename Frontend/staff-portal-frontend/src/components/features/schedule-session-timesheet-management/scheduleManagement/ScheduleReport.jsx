import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Printer, Calendar, Filter } from "lucide-react";
import { useGetSchedulesQuery } from "../../../../../store/api/schedulingApi";
import { setBreadcrumbs } from "../../../../../store/slices/breadcrumbSlice";
import { selectAccessibleMenus } from "../../../../../store/selectors/authSelectors";
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
	Badge,
	Button,
	Select,
	Input,
	FormField,
	Grid,
	GridItem,
	VStack,
	HStack,
	EmptyState,
	SkeletonTable,
} from "../../../../common";
import { CustomSelect } from "../../../layout";
import {
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
export const ScheduleReport = () => {
	const dispatch = useDispatch();
	const accessibleMenus = useSelector(selectAccessibleMenus);

	const [filters, setFilters] = useState({
		batchCycle: "",
		courseType: "",
		course: "",
		startDate: "",
		endDate: "",
		faculty: "",
		venue: "",
	});
	// use course_code, staff_id(coordinator_id)
	const {
		data: schedules = [],
		isLoading,
		error,
	} = useGetSchedulesQuery(filters, {
		skip: !filters.batchCycle || !filters.courseType,
	});
	const { data: batchCycles = [], isLoading: loadingBatchCycles } =
		useGetBatchCyclesQuery();
	const { data: courseTypes = [], isLoading: loadingCourseTypes } =
		useGetCourseTypesQuery();
	const batchCycleOptions = [
		{
			label: "All",
			value: "",
		},
		...batchCycles.map((batchCycle) => ({
			label: batchCycle.name,
			value: batchCycle.id,
		})),
	];
	const courseTypeOptions = [
		{
			label: "All",
			value: "",
		},
		...courseTypes.map((courseType) => ({
			label: courseType.name,
			value: courseType.id,
		})),
	];
	// send course_code also
	const { data: courses = [], isLoading: loadingCourses } =
		useGetCoursesQuery(
			{
				batchCycle: filters.batchCycle,
				courseType: filters.courseType,
			},
			{ skip: !filters.batchCycle || !filters.courseType }
		);
	const courseOptions = [
		{
			label: "All",
			value: "",
		},
		...courses.map((course) => ({
			label: course.name,
			value: course.id,
		})),
	];
	// get all coordinators : this is for admin only
	// for course coordinator this will be directly fetch using getSchedule
	// write rtk query hook here
	/*
		useGetAllStaff,
		filter it by role: COURSE_COORDINATOR
	*/

	useEffect(() => {
		dispatch(
			setBreadcrumbs([
				{ title: "Home", path: "/dashboard", icon: "home" },
				{
					title: "Scheduling, Sessions & Timesheet",
					icon: "calendar",
				},
				{
					title: "Schedule Reports",
					path: "/scheduling-sessions/schedule-reports",
					icon: "file-text",
				},
			])
		);
	}, [dispatch]);

	const updateFilter = (key, value) => {
		setFilters((prev) => ({ ...prev, [key]: value }));
	};

	const exportToPrint = () => {
		const printWindow = window.open("", "_blank");
		printWindow.document.write(`
      <html>
        <head>
          <title>Schedule Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { text-align: center; margin-bottom: 20px; }
            .badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; }
            .lecture { background-color: #e3f2fd; color: #1565c0; }
            .lab { background-color: #f3e5f5; color: #7b1fa2; }
            .workshop { background-color: #fff3e0; color: #ef6c00; }
            .seminar { background-color: #e8f5e8; color: #2e7d32; }
            @media print {
              button { display: none; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Schedule Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Activity</th>
                <th>Module</th>
                <th>Faculty</th>
                <th>Venue</th>
              </tr>
            </thead>
            <tbody>
              ${schedules
					.map(
						(schedule) => `
                <tr>
                  <td>${new Date(schedule.date).toLocaleDateString("en-US", {
						weekday: "short",
						day: "2-digit",
						month: "short",
					})}</td>
                  <td>${schedule.time}</td>
                  <td>
                    <span class="badge ${schedule.activity.toLowerCase()}">
                      ${schedule.activity}
                    </span>
                  </td>
                  <td>${schedule.module}</td>
                  <td>${
						Array.isArray(schedule.faculty)
							? schedule.faculty.join(", ")
							: schedule.faculty
					}</td>
                  <td>${schedule.venue}</td>
                </tr>
              `
					)
					.join("")}
            </tbody>
          </table>
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Report
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background-color: #757575; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
              Close
            </button>
          </div>
        </body>
      </html>
    `);
		printWindow.document.close();
	};

	const exportToCSV = () => {
		const csvContent = [
			["Date", "Time", "Activity", "Module", "Faculty", "Venue"],
			...schedules.map((schedule) => [
				new Date(schedule.date).toLocaleDateString(),
				schedule.time,
				schedule.activity,
				schedule.module,
				Array.isArray(schedule.faculty)
					? schedule.faculty.join("; ")
					: schedule.faculty,
				schedule.venue,
			]),
		];

		const csv = csvContent.map((row) => row.join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute(
			"download",
			`schedule-report-${new Date().toISOString().split("T")[0]}.csv`
		);
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const getActivityVariant = (activity) => {
		const variants = {
			Lecture: "primary",
			Lab: "secondary",
			Workshop: "warning",
			Seminar: "success",
		};
		return variants[activity] || "outline";
	};

	const canViewReports = accessibleMenus.includes(
		"/scheduling-sessions/schedule-reports"
	);

	if (!canViewReports) {
		return (
			<EmptyState
				title='Access Restricted'
				description="You don't have permission to view schedule reports."
				icon={<Calendar className='w-12 h-12' />}
			/>
		);
	}

	return (
		<VStack spacing='lg'>
			{/* Filter Section */}
			<Card>
				<CardHeader
					title='Schedule Report Filters'
					action={
						<HStack spacing='sm'>
							<Button
								variant='outline'
								size='sm'
								leftIcon={<Download className='w-4 h-4' />}
								onClick={exportToCSV}
								disabled={schedules.length === 0}
							>
								Export CSV
							</Button>
							<Button
								variant='outline'
								size='sm'
								leftIcon={<Printer className='w-4 h-4' />}
								onClick={exportToPrint}
								disabled={schedules.length === 0}
							>
								Print Report
							</Button>
						</HStack>
					}
				/>
				<CardBody>
					<Grid columns={{ base: 5 }} gap='md'>
						<GridItem>
							<CustomSelect
								value={filters.batchCycle}
								onChange={(e) =>
									updateFilter("batchCycle", e.target.value)
								}
								options={batchCycleOptions}
							/>
						</GridItem>
						<GridItem>
							<CustomSelect
								value={filters.courseType}
								onChange={(e) =>
									updateFilter("courseType", e.target.value)
								}
								options={courseTypeOptions}
							/>
						</GridItem>
						<GridItem>
							<CustomSelect
								value={filters.course}
								onChange={(e) =>
									updateFilter("course", e.target.value)
								}
								options={courseOptions}
							/>
						</GridItem>
						<GridItem>
							<CustomSelect
							// for faculty
							/>
						</GridItem>
						<GridItem>
							<CustomSelect
							// for venue
							/>
						</GridItem>
					</Grid>
					<Grid columns={{ base: 1, md: 2 }} gap='md'>
						<GridItem>
							<Input
								type='date'
								value={filters.startDate}
								onChange={(e) =>
									updateFilter("startDate", e.target.value)
								}
							/>
						</GridItem>
						<GridItem>
							<FormField label='End Date'>
								<Input
									type='date'
									value={filters.endDate}
									onChange={(e) =>
										updateFilter("endDate", e.target.value)
									}
									min={filters.startDate}
								/>
							</FormField>
						</GridItem>
					</Grid>
				</CardBody>
			</Card>

			{/* Schedule Report Table */}
			<Card>
				<CardHeader title='Schedule Report' />
				<CardBody>
					{isLoading ? (
						<SkeletonTable rows={10} columns={6} />
					) : error ? (
						<EmptyState
							title='Error Loading Schedules'
							description={
								error.message || "Failed to load schedule data"
							}
							icon={<Calendar className='w-12 h-12' />}
						/>
					) : (
						<>
							<Table>
								<TableHead>
									<TableRow>
										<TableHeader>Date</TableHeader>
										<TableHeader>Time</TableHeader>
										<TableHeader>Activity</TableHeader>
										<TableHeader>Module</TableHeader>
										<TableHeader>Faculty</TableHeader>
										<TableHeader>Venue</TableHeader>
									</TableRow>
								</TableHead>
							</Table>
							<Table>
								<TableBody>
									{schedules.map((schedule, index) => (
										<TableRow key={index}>
											<TableCell>
												{new Date(
													schedule.date
												).toLocaleDateString("en-US", {
													weekday: "short",
													day: "2-digit",
													month: "short",
												})}
											</TableCell>
											<TableCell>
												{schedule.time}
											</TableCell>
											<TableCell>
												<Badge
													variant={getActivityVariant(
														schedule.activity
													)}
												>
													{schedule.activity}
												</Badge>
											</TableCell>
											<TableCell>
												{schedule.module}
											</TableCell>
											<TableCell>
												{Array.isArray(schedule.faculty)
													? schedule.faculty.join(
															", "
													  )
													: schedule.faculty}
											</TableCell>
											<TableCell>
												{schedule.venue}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</>
					)}
				</CardBody>
			</Card>
		</VStack>
	);
};
