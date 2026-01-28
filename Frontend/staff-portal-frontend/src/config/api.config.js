const API_CONFIG = {
	// BFF Configuration
	BFF_BASE_URL: import.meta.env.VITE_BFF_BASE_URL || "http://localhost:8001",

	// API Endpoints
	ENDPOINTS: {
		// Authentication endpoints
		AUTH: {
			LOGIN: "/login",
			LOGOUT: "/bff/auth/logout",
			PROFILE: "/bff/auth/profile",
			REFRESH: "/bff/auth/refresh",
			SESSION: "/bff/session",
			PRESERVED_COMMANDS: "/bff/session/preserved-commands",
		},

		// Academic Management endpoints
		ACADEMIC: {
			// Course Types
			GET_ALL_COURSE_TYPES: "/bff/apig/academic/course-types/getAll",
			CREATE_COURSE_TYPES: "/bff/apig/academic/course-types/create",
			UPDATE_COURSE_TYPES: "/bff/apig/academic/course-types/update",
			DELETE_COURSE_TYPES: "/bff/apig/academic/course-types/delete",

			// CourseGroups
			GET_ALL_COURSE_GROUPS: "/bff/apig/academic/course-groups/getAll",
			CREATE_COURSE_GROUP: "/bff/apig/academic/course-groups/create",
			UPDATE_COURSE_GROUP: "/bff/apig/academic/course-groups/update",
			DELETE_COURSE_GROUP: "/bff/apig/academic/course-groups/delete",
			// Courses
			GET_ALL_COURSES: "/bff/apig/academic/course/getAll",
			GET_UNIQUE_COURSE_NAMES: "/bff/apig/academic/course/getUniqueCourseNames",
			GET_PAGINATED_COURSES: "/bff/apig/academic/course/getPaginated",
			GET_COURSE_HIERARCHY: "/bff/apig/academic/course/getHierarchy",
			IMPORT_COURSE_HIERARCHY: "/bff/apig/academic/course/import",
			CREATE_COURSE: "/bff/apig/academic/course/create",
			UPDATE_COURSE: "/bff/apig/academic/course/update",
			DELETE_COURSE: "/bff/apig/academic/course/delete",

			// Modules
			CREATE_MODULE: "/bff/apig/academic/module/create",
			UPDATE_MODULE: "/bff/apig/academic/module/update",
			DELETE_MODULE: "/bff/apig/academic/module/delete",

			// Subjects
			CREATE_SUBJECT: "/bff/apig/academic/subject/create",
			UPDATE_SUBJECT: "/bff/apig/academic/subject/update",
			DELETE_SUBJECT: "/bff/apig/academic/subject/delete",

			// Sections
			CREATE_SECTION: "/bff/apig/academic/section/create",
			UPDATE_SECTION: "/bff/apig/academic/section/update",
			DELETE_SECTION: "/bff/apig/academic/section/delete",
			// Topics
			CREATE_TOPIC: "/bff/apig/academic/topic/create",
			UPDATE_TOPIC: "/bff/apig/academic/topic/update",
			DELETE_TOPIC: "/bff/apig/academic/topic/delete",

			// Assignments
			GET_ALL_ASSIGNMENTS: "bff/apig/academic/assign-course/getAll",
			GET_ASSIGN_COURSE: "bff/apig/academic/assign-course/courseCoordinator/getAssignCourse",
			CREATE_ASSIGNMENT: "/bff/apig/academic/assign-course/create",
			UPDATE_ASSIGNMENT: "/bff/apig/academic/assign-course/update",
			DELETE_ASSIGNMENT: "/bff/apig/academic/assign-course/delete",

			// Module Router
			GET_COURSE_COORD_ASSIGN_COURSE_AND_MODULE_LIST: "/bff/apig/academic/course-coordinator-assign/getAssignCourse",
		},

		// Infrastructure-Premise-BatchCycle Management endpoints
		INFRASTRUCTURE: {
			// BATCH CYCLES
			GET_ALL_BATCH_CYCLES: "/bff/apig/academic/batch-cycle/getAll",
			CREATE_BATCH_CYCLE: "/bff/apig/academic/batch-cycle/create",
			UPDATE_BATCH_CYCLE: "/bff/apig/academic/batch-cycle/update",
			DELETE_BATCH_CYCLE: "/bff/apig/academic/batch-cycle/delete",

			// PREMISES
			GET_ALL_PREMISES: "/bff/apig/academic/premise/getAll",
			CREATE_PREMISE: "/bff/apig/academic/premise/create",
			UPDATE_PREMISE: "/bff/apig/academic/premise/update",
			DELETE_PREMISE: "/bff/apig/academic/premise/delete",

			// INFRASTRUCTURE
			GET_ALL_INFRASTRUCTURE: "/bff/apig/academic/infrastructure/getAll",
			CREATE_INFRASTRUCTURE: "/bff/apig/academic/infrastructure/create",
			UPDATE_INFRASTRUCTURE: "/bff/apig/academic/infrastructure/update",
			DELETE_INFRASTRUCTURE: "/bff/apig/academic/infrastructure/delete",
		},

		// Staff Management endpoints
		STAFF: {
			STAFF: "/bff/auth/staff",
			ALL_STAFF: "/bff/apig/user/staff/getAll",
			ELIGIBLE_STAFF: "/bff/apig/user/staff/eligibleStaff", // For Module Router
			CREATE_STAFF: "/bff/auth/admin/createStaff",
			UPDATE_STAFF: "/bff/auth/admin/updateStaff",
			DELETE_STAFF: "/bff/auth/admin/deleteStaff",
			COURSE_ASSIGNMENTS: "/bff/apig/user/course-assignments",

			// Staff Menu Access
			GET_ALL_STAFF_MENU_ACCESS_EXCEPTION: "/bff/apig/user/staff-menu-access/getAll",
			CREATE_UPDATE_STAFF_MENU_ACCESS_EXCEPTION: "/bff/apig/user/staff-menu-access/create_update_exceptions",
			DELETE_STAFF_MENU_ACCESS_EXCEPTION: "/bff/apig/user/staff-menu-access/delete",
		},

		SYSTEM_ADMINISTRATION: {
			GET_SIDEBAR_MENU_ITEMS: "/bff/apig/user/menu-items/getSidebarMenuItems",

			GET_ALL_MENU_ITEMS: "/bff/apig/user/menu-items/getAll",
			CREATE_MENU_ITEM: "/bff/apig/user/menu-items/create",
			UPDATE_MENU_ITEM: "/bff/apig/user/menu-items/update",
			DELETE_MENU_ITEM: "/bff/apig/user/menu-items/delete",

			GET_ALL_ROLE_MENU_ACCESS_ITEMS: "bff/apig/user/role-menu-access/getAll",
			CREATE_ROLE_MENU_ACCESS_ITEM: "bff/apig/user/role-menu-access/create",
			UPDATE_ROLE_MENU_ACCESS_ITEM: "bff/apig/user/role-menu-access/updateStatus",
			DELETE_ROLE_MENU_ACCESS_ITEM: "bff/apig/user/role-menu-access/delete",

			GET_ALL_STAFF_MENU_ACCESS: "bff/apig/user/staff-menu-access/getAll",
			CREATE_STAFF_MENU_ACCESS: "bff/apig/user/staff-menu-access/create",
			UPDATE_STAFF_MENU_ACCESS: "bff/apig/user/staff-menu-access/update",
			DELETE_STAFF_MENU_ACCESS: "bff/apig/user/staff-menu-access/delete",
		},

		// Student Operations endpoints
		STUDENTS: {
			STUDENTS: "/bff/apig/user/students",
			COURSE_GROUPS: "/bff/apig/user/student/course-groups",
			GROUP_ASSIGNMENTS: "/bff/apig/user/student/group-assignments",
			IMPORT: "/bff/apig/user/students/import",
		},

		// Scheduling endpoints
		SCHEDULING: {
			// Scheduling
			GET_SCHEDULES: "/bff/apig/scheduling/schedule/getAll",
			CREATE_SCHEDULE: "/bff/apig/scheduling/schedule/create",
			UPDATE_SCHEDULE: "/bff/apig/scheduling/schedule/update",
			DELETE_SCHEDULE: "/bff/apig/scheduling/schedule/delete",

			SESSIONS: "/bff/apig/scheduling/sessions",
			TIMESHEETS: "/bff/apig/scheduling/timesheets",
			RECORDED_VIDEOS: "/bff/apig/scheduling/recorded-videos",
		},

		// Reports endpoints
		REPORTS: {
			SCHEDULE_REPORTS: "/bff/apig/reports/schedule-reports",
			STUDENT_CERTIFICATES: "/bff/apig/reports/student-certificates",
			EXPORT_DATA: "/bff/apig/reports/export-data",
			DOCUMENT_GENERATION: "/bff/apig/reports/document-generation",
		},
	},

	// Request Configuration
	REQUEST_CONFIG: {
		timeout: 30000, // 30 seconds
		withCredentials: true, // Include session cookies
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
	},

	// Response Configuration
	RESPONSE_CONFIG: {
		validateStatus: (status) => status >= 200 && status < 300,
	},

	// Error Configuration
	ERROR_CONFIG: {
		retryAttempts: 3,
		retryDelay: 1000, // 1 second
		retryCondition: (error) => {
			return !error.response || error.response.status >= 500;
		},
	},

	// File Upload Configuration
	FILE_UPLOAD_CONFIG: {
		maxFileSize: 10 * 1024 * 1024, // 10MB
		allowedFileTypes: [
			"application/pdf",
			"application/vnd.ms-excel",
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"text/csv",
			"image/jpeg",
			"image/png",
			"image/gif",
		],
		timeout: 120000, // 2 minutes for file uploads
	},

	// Cache Configuration
	CACHE_CONFIG: {
		staleTime: 5 * 60 * 1000, // 5 minutes
		cacheTime: 10 * 60 * 1000, // 10 minutes
	},

	// Pagination Configuration
	PAGINATION_CONFIG: {
		defaultPageSize: 20,
		pageSizeOptions: [10, 20, 50, 100],
	},

	// Environment specific configurations
	ENVIRONMENT: {
		isDevelopment: import.meta.env.MODE === "development",
		isProduction: import.meta.env.MODE === "production",
	},
};

export default API_CONFIG;
