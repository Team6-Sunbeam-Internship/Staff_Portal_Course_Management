import { useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
	Card,
	CardBody,
	// CardHeader,
	Button,
	VStack,
	HStack,
} from "../../../layout";
import { setBreadcrumbs, useGetSchedulesQuery } from "../../../../store";

export const ScheduleCalendar = () => {
	const dispatch = useDispatch();
	const [currentWeek, setCurrentWeek] = useState(new Date());

	const [filters, setFilters] = useState({
		batchCycle: "",
		courseType: "",
		course: "",
	});
	const addDays = (date, days) => {
		const result = new Date(date);
		result.setDate(date.getDate() + days);
		return result;
	};
	const getWeekRange = useCallback((date) => {
		const startOfWeek = new Date(date);
		startOfWeek.setHours(0, 0, 0, 0);
		// Calculate diff to Monday (0=Mon, 6=Sun)
		const day = (startOfWeek.getDay() + 6) % 7;
		const diff = startOfWeek.getDate() - day;
		startOfWeek.setDate(diff);

		const days = Array.from({ length: 7 }).map((_, i) =>
			addDays(startOfWeek, i)
		);

		return days;
	}, []);

	
	const { start: weekStart, end: weekEnd } = getWeekRange(currentWeek);

	const { data: schedules = [], isLoading } = useGetSchedulesQuery({
		startDate: weekStart.toISOString().split("T")[0],
		endDate: weekEnd.toISOString().split("T")[0],
	});

	useEffect(() => {
		dispatch(
			setBreadcrumbs([
				{ title: "Home", path: "/dashboard", icon: "home" },
				{
					title: "Scheduling & Sessions",
					icon: "calendar",
				},
				{
					title: "Schedule Calendar",
					path: "/scheduling-sessions/schedule-calendar",
					icon: "calendar-days",
				},
			])
		);
	}, [dispatch]);

	const navigateWeek = (direction) => {
		const newDate = new Date(currentWeek);
		newDate.setDate(newDate.getDate() + direction * 7);
		setCurrentWeek(newDate);
	};

	const generateWeekDays = () => {
		const days = [];
		for (let i = 0; i < 7; i++) {
			const day = new Date(weekStart);
			day.setDate(weekStart.getDate() + i);
			days.push(day);
		}
		return days;
	};

	const getActivityColor = (activity) => {
		const colors = {
			Lecture:
				"bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
			Lab: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
			Workshop:
				"bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
			Seminar:
				"bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
		};
		return (
			colors[activity] ||
			"bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
		);
	};

	const weekDays = generateWeekDays();

	return (
		<VStack spacing='lg'>
			{/**add filters */}
			<Card>
				{/* <CardHeader
					title={`Week of ${weekStart.toLocaleDateString()} - ${weekEnd.toLocaleDateString()}`}
					action={
						<HStack spacing='sm'>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => navigateWeek(-1)}
								leftIcon={<ChevronLeft className='w-4 h-4' />}
							>
								Previous
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => setCurrentWeek(new Date())}
							>
								Today
							</Button>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => navigateWeek(1)}
								rightIcon={<ChevronRight className='w-4 h-4' />}
							>
								Next
							</Button>
						</HStack>
					}
				/> */}
				<CardBody>
					{isLoading ? (
						<div className='grid grid-cols-7 gap-2'>
							{Array.from({ length: 7 }).map((_, index) => (
								<div
									key={index}
									className='border rounded-lg p-4 animate-pulse'
								>
									<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2'></div>
									<div className='space-y-2'>
										<div className='h-16 bg-gray-100 dark:bg-gray-800 rounded'></div>
										<div className='h-16 bg-gray-100 dark:bg-gray-800 rounded'></div>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='grid grid-cols-7 gap-2'>
							{weekDays.map((day, dayIndex) => {
								const daySchedules = schedules.filter(
									(schedule) =>
										new Date(
											schedule.date
										).toDateString() === day.toDateString()
								);

								return (
									<div
										key={dayIndex}
										className='border border-gray-200 dark:border-gray-700 rounded-lg p-3 min-h-[200px]'
									>
										<div className='font-semibold text-sm mb-3 text-center'>
											<div>
												{day.toLocaleDateString(
													"en-US",
													{ weekday: "short" }
												)}
											</div>
											<div className='text-lg'>
												{day.getDate()}
											</div>
											<div className='text-xs text-gray-500'>
												{day.toLocaleDateString(
													"en-US",
													{ month: "short" }
												)}
											</div>
										</div>

										<div className='space-y-1'>
											{daySchedules.length === 0 ? (
												<div className='text-xs text-gray-400 text-center py-4'>
													No sessions
												</div>
											) : (
												daySchedules.map(
													(
														schedule,
														scheduleIndex
													) => (
														<div
															key={scheduleIndex}
															className={`p-2 rounded text-xs ${getActivityColor(
																schedule.activity
															)}`}
														>
															<div className='font-medium'>
																{schedule.time}
															</div>
															<div
																className='truncate'
																title={
																	schedule.activity
																}
															>
																{
																	schedule.activity
																}
															</div>
															<div
																className='truncate'
																title={
																	schedule.module
																}
															>
																{
																	schedule.module
																}
															</div>
															<div
																className='truncate text-xs opacity-75'
																title={
																	schedule.venue
																}
															>
																{schedule.venue}
															</div>
														</div>
													)
												)
											)}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</CardBody>
			</Card>
		</VStack>
	);
};
