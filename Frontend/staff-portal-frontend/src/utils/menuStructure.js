export const menuStructure = [
	{
		key: "dashboard",
		label: "Dashboard",
		path: "/dashboard",
		icon: "home",
		single: true,
	},
	{
		key: "academic-management",
		label: "Academic Management",
		icon: "academic-cap",
		children: [
			{
				key: "course-types",
				label: "Course Types",
				path: "/academic-management/course-types",
			},
			{
				key: "courses",
				label: "Courses",
				path: "/academic-management/courses",
			},
			{
				key: "modules",
				label: "Modules",
				path: "/academic-management/modules",
			},
			{
				key: "subjects",
				label: "Subjects",
				path: "/academic-management/subjects",
			},
			{
				key: "sections",
				label: "Sections",
				path: "/academic-management/sections",
			},
			{
				key: "topics",
				label: "Topics",
				path: "/academic-management/topics",
			},
		],
	},
	{
		key: "infrastructure-management",
		label: "Infrastructure Management",
		icon: "building-office",
		children: [
			{
				key: "batch-cycles",
				label: "Batch Cycles",
				path: "/infrastructure-management/batch-cycles",
			},
			{
				key: "premises",
				label: "Premises",
				path: "/infrastructure-management/premises",
			},
			{
				key: "infrastructure",
				label: "Infrastructure",
				path: "/infrastructure-management/infrastructure",
			},
		],
	},
	{
		key: "staff-management",
		label: "Staff Management",
		icon: "users",
		children: [
			{
				key: "staff",
				label: "Staff",
				path: "/staff-management/staff",
			},
			{
				key: "course-coordinator-assignment",
				label: "Course Coordinator Assignment",
				path: "/staff-management/coordinator-assignment",
			},
		],
	},
	{
		key: "student-operations",
		label: "Student Operations",
		icon: "academic-cap",
		children: [
			{
				key: "students",
				label: "Students",
				path: "/student-operations/students",
			},
			{
				key: "course-groups",
				label: "Course Groups",
				path: "/student-operations/course-groups",
			},
		],
	},
	{
		key: "scheduling-sessions",
		label: "Scheduling & Sessions",
		icon: "calendar-days",
		children: [
			{
				key: "schedule",
				label: "Schedule",
				children: [
					{
						key: "schedule-table",
						label: "ScheduleTable",
						path: "/scheduling-sessions/ScheduleTable",
					},
					{
						key: "schedule-report",
						label: "ScheduleReport",
						path: "/scheduling-sessions/ScheduleReport",
					},
					{
						key: "schedule-calendar",
						label: "ScheduleCalendar",
						path: "/scheduling-sessions/ScheduleCalendar",
					},
				],
			},
			{
				key: "sessions",
				label: "Sessions",
				path: "/scheduling-sessions/sessions",
			},
			{
				key: "videos",
				label: "Recorded Videos",
				path: "/scheduling-sessions/videos",
			},
			{
				key: "timesheets",
				label: "Timesheets",
				children: [
					{
						key: "timesheet-entry",
						label: "TimesheetEntry",
						path: "/scheduling-sessions/TimesheetAddEntry",
					},
					{
						key: "timesheet-my-entries",
						label: "TimesheetMyEntries",
						path: "/scheduling-sessions/TimesheetMyEntries",
					},
					{
						key: "timesheet-approve-logs",
						label: "TimesheetApproveLogs",
						path: "/scheduling-sessions/TimesheetApproveLogs",
					},
					{
						key: "timesheet-verify-logs",
						label: "TimesheetVerifyLogs",
						path: "/scheduling-sessions/TimesheetVerifyLogs",
					},
				],
			},
		],
	},
	{
		key: "system-administration",
		label: "System Administration",
		icon: "cog-6-tooth",
		children: [
			{
				key: "menus",
				label: "Menu Management",
				path: "/system-administration/menus",
			},
			{
				key: "role-menus",
				label: "Role-Based Menu",
				path: "/system-administration/role-menus",
			},
			{
				key: "staff-menus-access",
				label: "Staff Menus Access",
				path: "/system-administration/staff-menu-access",
			},
		],
	},
	{
		key: "reports-documentation",
		label: "Reports & Documentation",
		icon: "document-chart-bar",
		children: [
			{
				key: "schedule-reports",
				label: "Schedule Reports",
				path: "/reports-documentation/schedule-reports",
			},
			{
				key: "certificates",
				label: "Student Certificates",
				path: "/reports-documentation/certificates",
			},
			{
				key: "documents",
				label: "Document Management",
				path: "/reports-documentation/documents",
			},
		],
	},
	{
		key: "profile",
		label: "Profile",
		icon: "user",
		path: "/profile",
		single: true,
	},
];
