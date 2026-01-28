import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Download, Printer, Calendar, Filter } from "lucide-react";
import { setBreadcrumbs, useGetAllCourseTypesQuery, useGetSchedulesQuery } from "../../../../store";

import {
	Card,
	CardBody,
	// CardHeader,
	Table,
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
	Badge,
	Button,
	Input,
	Grid,
	GridItem,
	VStack,
	HStack,
	EmptyState,
	SkeletonTable,
} from "../../../layout";
import { CustomSelect } from "../../../layout";

import { selectUserRole } from "../../../../store/selectors";
import { useFilteredMenu } from "../../../../hooks";
import { useGetAssignCourseAndModulesQuery, useGetBatchCycleQuery } from "../../../../store";
export const ScheduleReport = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	const { pathSet } = useFilteredMenu();
	const canViewReports = pathSet.has("/schedule-session-timesheet-management") && userRole === "COURSE_COORDINATOR";

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
		skip: !filters.batchCycle && !filters.courseType && !filters.course && !filters.startDate && !filters.endDate,
	});
	const DEFAULT_BATCH_CYCLE_OPTION = {
		value: "",
		label: "Select batch cycle",
	};
	const selectBatchCycleOptions = (data) => {
		if (!data) return [DEFAULT_BATCH_CYCLE_OPTION];

		const mappedOptions = data.map((batchCycle) => ({
			label: batchCycle.name,
			value: batchCycle.id,
		}));

		return [DEFAULT_BATCH_CYCLE_OPTION, ...mappedOptions];
	};
	const { data: batchCycleOptions } = useGetBatchCycleQuery(undefined, {
		selectFromResult: ({ data, isLoading }) => ({
			data: selectBatchCycleOptions(data),
			isLoading,
		}),
	});

	const { data: courseTypes = [], isLoading: loadingCourseTypes } = useGetAllCourseTypesQuery();

	const courseTypeOptions = useMemo(() => {
		return courseTypes.map((courseType) => ({
			value: courseType.id,
			label: courseType.title,
		}));
	}, [courseTypes]);
	// send course_code also
	// assignCourseAndModules =  List<CourseCoordinatorAssignResponseDTO> = courseCode, courseName, isCurrent, List<ModuleResponseDTO>
	// ModuleResponseDTO = id, title, theoryHours, practicalHours, moduleRouterId
	const { data: assignCourseAndModules = [], isLoading: loadingAssignCourseAndModules } = useGetAssignCourseAndModulesQuery();

	const courseOptions = useMemo(() => {
		return [
			{ value: "", label: "Select Course" },
			...assignCourseAndModules.map((item) => ({
				value: item.courseCode,
				label: item.courseCode,
			})),
		];
	}, [assignCourseAndModules]);

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
                  <td>${Array.isArray(schedule.faculty) ? schedule.faculty.join(", ") : schedule.faculty}</td>
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
				Array.isArray(schedule.faculty) ? schedule.faculty.join("; ") : schedule.faculty,
				schedule.venue,
			]),
		];

		const csv = csvContent.map((row) => row.join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", `schedule-report-${new Date().toISOString().split("T")[0]}.csv`);
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

	if (!canViewReports) {
		return (
			<EmptyState
				title='Access Restricted'
				description="You don't have permission to view schedule reports."
				icon={<Calendar className='h-12 w-12' />}
			/>
		);
	}

	const showFilterWarning = !filters.batchCycle || !filters.courseType;
	const hasError = error && !isLoading;

	return (
		<VStack spacing='lg'>
			{/* Filter Section */}
			<Card>
				{/* <CardHeader
					title='Schedule Report Filters'
					action={
						<HStack spacing='sm'>
							<Button
								variant='outline'
								size='sm'
								leftIcon={<Download className='w-4 h-4' />}
								onClick={exportToCSV}
								disabled={schedules.length === 0}>
								Export CSV
							</Button>
							<Button
								variant='outline'
								size='sm'
								leftIcon={<Printer className='w-4 h-4' />}
								onClick={exportToPrint}
								disabled={schedules.length === 0}>
								Print Report
							</Button>
						</HStack>
					}
				/> */}
				<CardBody>
					<Grid columns={{ base: 5 }} gap='md'>
						<GridItem>
							<CustomSelect value={filters.batchCycle} onChange={(e) => updateFilter("batchCycle", e.target.value)} options={batchCycleOptions} />
						</GridItem>
						<GridItem>
							<CustomSelect value={filters.courseType} onChange={(e) => updateFilter("courseType", e.target.value)} options={courseTypeOptions} />
						</GridItem>
						<GridItem>
							<CustomSelect value={filters.course} onChange={(e) => updateFilter("course", e.target.value)} options={courseOptions} />
						</GridItem>
					</Grid>
					<Grid columns={{ base: 2, md: 2 }} gap='md'>
						<GridItem>
							<Input
								type='date'
								label='Start Date (Optional)'
								value={filters.startDate}
								onChange={(e) => updateFilter("startDate", e.target.value)}
							/>
						</GridItem>
						<GridItem>
							<Input
								type='date'
								label='End Date (Optional)'
								value={filters.endDate}
								onChange={(e) => updateFilter("endDate", e.target.value)}
								min={filters.startDate}
							/>
						</GridItem>
					</Grid>
				</CardBody>
			</Card>

			{/* Schedule Report Table */}
			<Card>
				<CardBody>
					{showFilterWarning ?
						<EmptyState
							title='Select Filters to View Report'
							description='Please select a Batch Cycle and Course Type to fetch schedules.'
							icon={<Filter className='h-12 w-12 text-indigo-500' />}
						/>
					: isLoading ?
						<SkeletonTable rows={10} columns={6} />
					: hasError ?
						<EmptyState
							title='Error Loading Schedules'
							description={error.message || "Failed to load schedule data."}
							icon={<X className='h-12 w-12 text-red-500' />}
						/>
					: schedules.length === 0 ?
						<EmptyState
							title='No Schedules Found'
							description='No sessions match the current filter criteria.'
							icon={<Calendar className='h-12 w-12 text-gray-500' />}
						/>
					:	<>
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
												{new Date(schedule.date).toLocaleDateString("en-US", {
													weekday: "short",
													day: "2-digit",
													month: "short",
												})}
											</TableCell>
											<TableCell>{schedule.time}</TableCell>
											<TableCell>
												<Badge variant={getActivityVariant(schedule.activity)}>{schedule.activity}</Badge>
											</TableCell>
											<TableCell>{schedule.module}</TableCell>
											<TableCell>{Array.isArray(schedule.faculty) ? schedule.faculty.join(", ") : schedule.faculty}</TableCell>
											<TableCell>{schedule.venue}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</>
					}
				</CardBody>
			</Card>
		</VStack>
	);
};
