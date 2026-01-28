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
				single: true,
			},
			{
				key: "course-groups",
				label: "Course Groups",
				path: "/academic-management/course-groups",
				single: true,
			},
			{
				key: "courses",
				label: "Courses",
				path: "/academic-management/courses",
				single: true,
			},
			{
				key: "modules-subjects",
				label: "Modules-Subjects",
				path: "/academic-management/modules-subjects",
				single: true,
			},
			{
				key: "module-router", // Access By Course_Coordinator only
				label: "Module Router",
				path: "/academic-management/module-router",
				single: true,
			},
			{
				key: "sections-topics",
				label: "Sections-Topics",
				path: "/academic-management/sections-topics",
				single: true,
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
				single: true,
			},
			{
				key: "premises",
				label: "Premises",
				path: "/infrastructure-management/premises",
				single: true,
			},
			{
				key: "infrastructure",
				label: "Infrastructure",
				path: "/infrastructure-management/infrastructure",
				single: true,
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
				label: "Staff-Management",
				path: "/staff-management/staff",
				single: true,
			},
			{
				key: "course-coordinator-assignment",
				label: "Course Assign",
				path: "/staff-management/course-assign",
				single: true,
			},
		],
	},
	{
		key: "student-operations", // Access by both ADMIN and COURSE_COORDINATOR
		label: "Student Operations",
		icon: "academic-cap",
		children: [
			{
				key: "students",
				label: "Students",
				path: "/student-operations/students",
				single: true,
			},
			{
				key: "course-groups",
				label: "Course Groups",
				path: "/student-operations/course-groups",
				single: true,
			},
		],
	},
	{
		key: "scheduling-sessions-timesheets",
		label: "Scheduling-Sessions-Logs",
		icon: "calendar-days",
		children: [
			{
				key: "schedule", // ACCESS BY COURSE_COORDINATOR
				label: "Schedule",
				icon: "calendar-days",
				children: [
					{
						key: "schedule-table",
						label: "ScheduleTable",
						path: "/scheduling-sessions/ScheduleTable",
						single: true,
					},
					{
						key: "schedule-report",
						label: "ScheduleReport",
						path: "/scheduling-sessions/ScheduleReport",
						single: true,
					},
					{
						key: "schedule-calendar",
						label: "ScheduleCalendar",
						path: "/scheduling-sessions/ScheduleCalendar",
						single: true,
					},
				],
			},
			{
				key: "sessions", // ACCESS BY COURSE_COORDINATOR AND GENERAL_USER
				label: "Sessions",
				path: "/scheduling-sessions/sessions",
				single: true,
			},
			{
				key: "videos", // ACCESS BY COURSE_COORDINATOR AND GENERAL_USER
				label: "Recorded Videos",
				path: "/scheduling-sessions/videos",
				single: true,
			},
			{
				key: "timesheets",
				label: "Timesheets",
				children: [
					{
						key: "timesheet-entry", // ACCESS BY GENERAL_USER
						label: "TimesheetEntry",
						path: "/scheduling-sessions/TimesheetAddEntry",
						single: true,
					},
					{
						key: "timesheet-my-entries", // ACCESS BY GENERAL_USER
						label: "TimesheetMyEntries",
						path: "/scheduling-sessions/TimesheetMyEntries",
						single: true,
					},
					{
						key: "timesheet-approve-logs", // ACCESS BY COURSE_COORDINATOR
						label: "TimesheetApproveLogs",
						path: "/scheduling-sessions/TimesheetApproveLogs",
						single: true,
					},
					{
						key: "timesheet-verify-logs", // ACCESS BY GENERAL_USER
						label: "TimesheetVerifyLogs",
						path: "/scheduling-sessions/TimesheetVerifyLogs",
						single: true,
					},
				],
			},
		],
	},
	{
		key: "system-administration", // ACCESS BY ADMIN ONLY
		label: "System Administration",
		icon: "cog-6-tooth",
		children: [
			{
				key: "menus",
				label: "Menu Management",
				path: "/system-administration/menus",
				single: true,
			},
			{
				key: "role-menus",
				label: "Role-Based Menu",
				path: "/system-administration/role-menus",
				single: true,
			},
			{
				key: "staff-menus-access",
				label: "Staff Menus Access",
				path: "/system-administration/staff-menu-access",
				single: true,
			},
		],
	},
	{
		key: "reports-documentation",
		label: "Reports & Documentation",
		icon: "document-chart-bar",
		children: [
			{
				key: "schedule-reports", // ACCESS BY ADMIN AND COURSE_COORDINATOR
				label: "Schedule Reports",
				path: "/reports-documentation/schedule-reports",
				single: true,
			},
			{
				key: "certificates", // ACCESS BY ADMIN AND COURSE_COORDINATOR
				label: "Student Certificates",
				path: "/reports-documentation/certificates",
				single: true,
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
