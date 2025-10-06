import { BookOpen, Calendar, ClipboardCheck, Users } from "lucide-react";

export const DUMMY_OVERVIEW_STATS = [
	{
		id: 1,
		title: "Total Students",
		value: 1250,
		icon: Users,
		change: 5,
		changeType: "increase",
	},
	{
		id: 2,
		title: "Active Courses",
		value: 45,
		icon: BookOpen,
		change: 2,
		changeType: "increase",
	},
	{
		id: 3,
		title: "Completed Sessions",
		value: 320,
		icon: ClipboardCheck,
		change: 10,
		changeType: "increase",
	},
	{
		id: 4,
		title: "Pending Tasks",
		value: 8,
		icon: Calendar,
		change: 3,
		changeType: "decrease",
	},
];

export const DUMMY_LINE_CHART_DATA = {
	labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
	datasets: [
		{
			label: "Student Enrollments",
			data: [65, 59, 80, 81, 56, 55, 40],
			fill: false,
			borderColor: "rgb(59, 130, 246)",
			tension: 0.1,
		},
	],
};

export const DUMMY_BAR_CHART_DATA = {
	labels: ["Course A", "Course B", "Course C", "Course D", "Course E"],
	datasets: [
		{
			label: "Modules Completed",
			data: [12, 19, 3, 5, 2],
			backgroundColor: "rgba(59, 130, 246, 0.5)",
			borderColor: "rgb(59, 130, 246)",
			borderWidth: 1,
		},
	],
};

export const DUMMY_RECENT_ACTIVITIES = [
	{
		id: 1,
		text: "Student John Doe enrolled in Course C.",
		type: "enrollment",
		timestamp: "5 mins ago",
	},
	{
		id: 2,
		text: 'New module "Algebra" was added to Course A.',
		type: "course_update",
		timestamp: "1 hour ago",
	},
	{
		id: 3,
		text: 'Session with Jane Smith on "Database Management" was completed.',
		type: "session_completed",
		timestamp: "3 hours ago",
	},
	{
		id: 4,
		text: 'New task "Review Q3 Reports" assigned.',
		type: "task_assigned",
		timestamp: "Yesterday",
	},
];

export const DUMMY_UPCOMING_EVENTS = [
	{
		id: 1,
		title: "Student Council Meeting",
		date: "Oct 25, 2024",
		time: "10:00 AM",
		location: "Meeting Room 3",
	},
	{
		id: 2,
		title: 'Course "Data Science" begins',
		date: "Nov 1, 2024",
		time: "09:00 AM",
		location: "Online",
	},
];

export const DUMMY_ANNOUNCEMENTS = [
	{
		id: 1,
		title: "System Maintenance",
		content:
			"Scheduled system maintenance on Sunday, Oct 27, from 2 AM to 4 AM.",
		type: "maintenance",
	},
	{
		id: 2,
		title: "Holiday Notice",
		content: "The office will be closed on November 11th for Veterans Day.",
		type: "holiday",
	},
];
