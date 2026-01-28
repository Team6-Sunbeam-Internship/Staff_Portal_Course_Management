import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CheckCircle, Calendar } from "lucide-react";
import {
	Table,
	TableHead,
	TableRow,
	TableHeader,
	TableBody,
	TableCell,
	Badge,
	Card,
	CardBody,
	// CardHeader,
	EmptyState,
	SkeletonTable,
} from "../../../layout";
import { selectUserRole } from "../../../../store/selectors";
import { setBreadcrumbs, useGetTimeSheetsQuery } from "../../../../store";

export const TimesheetVerifyLogs = () => {
	const dispatch = useDispatch();
	const userRole = useSelector(selectUserRole);
	
	const canViewLogs = userRole !== 'ADMIN' && userRole !== 'COURSE_COORDINATOR';

	const { data: timesheets = [], isLoading } = useGetTimeSheetsQuery(
		{
			status: "approved",
		},
		{
			skip: !canViewLogs,
		}
	);

	const approvedEntries = timesheets.filter(
		(entry) => entry.status === "approved"
	);

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
					title: "Verify Logs",
					path: "/scheduling-sessions/timesheets/verify-logs",
					icon: "check",
				},
			])
		);
	}, [dispatch]);

	if (isLoading) {
		return (
			<Card>
				<CardBody>
					<SkeletonTable rows={5} columns={6} />
				</CardBody>
			</Card>
		);
	}

	if (!canViewLogs) {
		return (
			<EmptyState
				title='Access Restricted'
				description="You don't have permission to view timesheet verification logs."
				icon={<CheckCircle className='w-12 h-12' />}
			/>
		);
	}

	return (
		<Card>
			{/* <CardHeader title='Verified Timesheet Logs' /> */}
			<CardBody>
				<Table>
					<TableHead>
						<TableRow>
							<TableHeader>Date</TableHeader>
							<TableHeader>Time</TableHeader>
							<TableHeader>Course/Module</TableHeader>
							<TableHeader>Topics Completed</TableHeader>
							<TableHeader>Verified By</TableHeader>
							<TableHeader>Status</TableHeader>
						</TableRow>
					</TableHead>
				</Table>
				<Table>
					<TableBody>
						{approvedEntries.map((entry, index) => (
							<TableRow key={index}>
								<TableCell>
									{new Date(entry.date).toLocaleDateString()}
								</TableCell>
								<TableCell>
									{entry.startTime} - {entry.endTime}
								</TableCell>
								<TableCell>
									{entry.courses?.map((course, idx) => (
										<div key={idx} className='text-sm'>
											{course.courseName} /{" "}
											{course.moduleName}
										</div>
									))}
								</TableCell>
								<TableCell>
									<div className='text-sm'>
										{entry.topics
											?.filter((topic) => topic.completed)
											.map((topic) => topic.name)
											.join(", ") || "-"}
									</div>
								</TableCell>
								<TableCell>{entry.verifiedBy || "-"}</TableCell>
								<TableCell>
									<Badge variant='success'>
										{entry.status}
									</Badge>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardBody>
		</Card>
	);
};
