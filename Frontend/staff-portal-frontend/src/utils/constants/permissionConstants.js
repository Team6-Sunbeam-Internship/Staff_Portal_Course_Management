export const USER_ROLES = {
	ADMIN: "ADMIN",
	COURSE_COORDINATOR: "COURSE_COORDINATOR",
	GENERAL_USER: "GENERAL_USER",
};

export const ROLE_HIERARCHY = {
	[USER_ROLES.ADMIN]: 3,
	[USER_ROLES.COURSE_COORDINATOR]: 2,
	[USER_ROLES.GENERAL_USER]: 1,
};

export const DEFAULT_PERMISSIONS = {
	// Academic Management
	"academic-management.view": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,USER_ROLES.GENERAL_USER,],
	"academic-management.course-types.create": [USER_ROLES.ADMIN],
	"academic-management.course-types.update": [USER_ROLES.ADMIN],
	"academic-management.course-types.delete": [USER_ROLES.ADMIN],
	"academic-management.courses.create": [USER_ROLES.ADMIN],
	"academic-management.courses.update": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,],
	"academic-management.courses.delete": [USER_ROLES.ADMIN],
	"academic-management.modules.create": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,],
	"academic-management.modules.update": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,],
	"academic-management.modules.delete": [USER_ROLES.ADMIN],
	"academic-management.subjects.create": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,],
	"academic-management.subjects.update": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,],
	"academic-management.subjects.delete": [USER_ROLES.ADMIN],

	// Infrastructure Management
	"infrastructure-management.view": [USER_ROLES.ADMIN],
	"infrastructure-management.batch-cycles.create": [USER_ROLES.ADMIN],
	"infrastructure-management.premises.create": [USER_ROLES.ADMIN],
	"infrastructure-management.infrastructure.create": [USER_ROLES.ADMIN],

	// Staff Management
	"staff-management.view": [USER_ROLES.ADMIN],
	"staff-management.staff.create": [USER_ROLES.ADMIN],
	"staff-management.role-assignment.create": [USER_ROLES.ADMIN],

	// Student Operations
	"student-operations.view": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,],
	"student-operations.students.import": [USER_ROLES.COURSE_COORDINATOR],
	"student-operations.course-groups.create": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,],

	// Scheduling & Sessions
	"scheduling-sessions.view": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,USER_ROLES.GENERAL_USER,],
	"scheduling-sessions.schedule.create": [USER_ROLES.COURSE_COORDINATOR],
	"scheduling-sessions.sessions.create": [USER_ROLES.COURSE_COORDINATOR,USER_ROLES.GENERAL_USER,],
	"scheduling-sessions.videos.create": [USER_ROLES.COURSE_COORDINATOR,USER_ROLES.GENERAL_USER,],
	"scheduling-sessions.timesheets.create": [USER_ROLES.GENERAL_USER],
	"scheduling-sessions.timesheets.approve": [USER_ROLES.COURSE_COORDINATOR],

	// System Administration
	"system-administration.view": [USER_ROLES.ADMIN],
	"system-administration.menus.create": [USER_ROLES.ADMIN],
	"system-administration.role-menus.create": [USER_ROLES.ADMIN],

	// Reports & Documentation
	"reports-documentation.view": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,],
	"reports-documentation.schedule-reports.generate": [USER_ROLES.COURSE_COORDINATOR,],
	"reports-documentation.certificates.generate": [USER_ROLES.ADMIN,USER_ROLES.COURSE_COORDINATOR,],
};
