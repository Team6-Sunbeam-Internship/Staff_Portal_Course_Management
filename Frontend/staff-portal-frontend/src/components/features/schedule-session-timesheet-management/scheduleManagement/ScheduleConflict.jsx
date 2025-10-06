import { useEffect, useState } from "react";
import { AlertTriangle, Users, MapPin, Clock } from "lucide-react";
import {
	Alert,
	AlertDescription,
	Badge,
	Card,
	CardBody,
	CardHeader,
	VStack,
} from "../../../../common";

export const ConflictChecker = ({ schedules = [], onConflictDetected }) => {
	const [conflicts, setConflicts] = useState([]);

	useEffect(() => {
		detectConflicts();
	}, [schedules]);

	const detectConflicts = () => {
		const conflicts = [];
		const activeSchedules = schedules.filter(
			(schedule) =>
				schedule.time &&
				schedule.faculty &&
				schedule.faculty.length > 0 &&
				schedule.venue
		);

		for (let i = 0; i < activeSchedules.length; i++) {
			for (let j = i + 1; j < activeSchedules.length; j++) {
				const scheduleA = activeSchedules[i];
				const scheduleB = activeSchedules[j];

				// Check if schedules are on same date and overlapping time
				if (
					scheduleA.date === scheduleB.date &&
					scheduleA.time === scheduleB.time
				) {
					// Faculty conflict
					const facultyConflict = scheduleA.faculty.some((fA) =>
						scheduleB.faculty.includes(fA)
					);

					// Venue conflict
					const venueConflict = scheduleA.venue === scheduleB.venue;

					if (facultyConflict) {
						conflicts.push({
							id: `faculty-${i}-${j}`,
							type: "faculty",
							severity: "high",
							date: scheduleA.date,
							time: scheduleA.time,
							scheduleA,
							scheduleB,
							conflictingResource: scheduleA.faculty.find((fA) =>
								scheduleB.faculty.includes(fA)
							),
							message: `Faculty member assigned to multiple sessions at the same time`,
						});
					}

					if (venueConflict) {
						conflicts.push({
							id: `venue-${i}-${j}`,
							type: "venue",
							severity: "high",
							date: scheduleA.date,
							time: scheduleA.time,
							scheduleA,
							scheduleB,
							conflictingResource: scheduleA.venue,
							message: `Venue double-booked for the same time slot`,
						});
					}
				}

				// Check for overlapping time slots (partial conflicts)
				if (
					scheduleA.date === scheduleB.date &&
					scheduleA.time !== scheduleB.time &&
					checkTimeOverlap(scheduleA.time, scheduleB.time)
				) {
					const facultyOverlap = scheduleA.faculty.some((fA) =>
						scheduleB.faculty.includes(fA)
					);

					const venueOverlap = scheduleA.venue === scheduleB.venue;

					if (facultyOverlap || venueOverlap) {
						conflicts.push({
							id: `overlap-${i}-${j}`,
							type: facultyOverlap ? "faculty" : "venue",
							severity: "medium",
							date: scheduleA.date,
							time: `${scheduleA.time} & ${scheduleB.time}`,
							scheduleA,
							scheduleB,
							conflictingResource: facultyOverlap
								? scheduleA.faculty.find((fA) =>
										scheduleB.faculty.includes(fA)
								  )
								: scheduleA.venue,
							message: `Overlapping ${
								facultyOverlap ? "faculty" : "venue"
							} assignment`,
						});
					}
				}
			}
		}

		setConflicts(conflicts);
		onConflictDetected && onConflictDetected(conflicts);
	};

	const checkTimeOverlap = (timeA, timeB) => {
		// Parse time strings like "09:00-10:00"
		const parseTime = (timeStr) => {
			const [start, end] = timeStr.split("-");
			return {
				start: new Date(`2000-01-01T${start}:00`),
				end: new Date(`2000-01-01T${end}:00`),
			};
		};

		try {
			const rangeA = parseTime(timeA);
			const rangeB = parseTime(timeB);

			return rangeA.start < rangeB.end && rangeA.end > rangeB.start;
		} catch (error) {
			return false;
		}
	};

	const getConflictIcon = (type) => {
		switch (type) {
			case "faculty":
				return <Users className='w-4 h-4' />;
			case "venue":
				return <MapPin className='w-4 h-4' />;
			default:
				return <Clock className='w-4 h-4' />;
		}
	};

	const getConflictVariant = (severity) => {
		switch (severity) {
			case "high":
				return "error";
			case "medium":
				return "warning";
			default:
				return "info";
		}
	};

	if (conflicts.length === 0) return null;

	return (
		<Card>
			<CardHeader
				title='Schedule Conflicts Detected'
				subtitle={`${conflicts.length} conflict${
					conflicts.length !== 1 ? "s" : ""
				} found`}
			/>
			<CardBody>
				<VStack spacing='sm'>
					{conflicts.map((conflict) => (
						<Alert
							key={conflict.id}
							variant={getConflictVariant(conflict.severity)}
						>
							<div className='flex items-start space-x-3'>
								<div className='flex-shrink-0 mt-0.5'>
									{getConflictIcon(conflict.type)}
								</div>
								<div className='flex-1 min-w-0'>
									<div className='flex items-center space-x-2 mb-1'>
										<Badge
											variant={getConflictVariant(
												conflict.severity
											)}
											size='sm'
										>
											{conflict.type.toUpperCase()}
										</Badge>
										<span className='text-sm font-medium'>
											{new Date(
												conflict.date
											).toLocaleDateString("en-US", {
												weekday: "short",
												month: "short",
												day: "numeric",
											})}{" "}
											at {conflict.time}
										</span>
									</div>
									<AlertDescription>
										{conflict.message}
									</AlertDescription>
									<div className='mt-2 text-xs text-gray-600 dark:text-gray-400'>
										<div>
											Session A:{" "}
											{conflict.scheduleA.module} (
											{conflict.scheduleA.activity})
										</div>
										<div>
											Session B:{" "}
											{conflict.scheduleB.module} (
											{conflict.scheduleB.activity})
										</div>
									</div>
								</div>
							</div>
						</Alert>
					))}
				</VStack>
			</CardBody>
		</Card>
	);
};
