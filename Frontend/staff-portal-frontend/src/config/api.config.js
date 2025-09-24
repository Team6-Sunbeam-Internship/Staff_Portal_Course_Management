const API_CONFIG = {
	// BFF Configuration
	BFF_BASE_URL: import.meta.env.VITE_BFF_BASE_URL || "http://localhost:8002",

	// API Endpoints
	ENDPOINTS: {
		// Authentication endpoints
		AUTH: {
			LOGIN: "/login",
			LOGOUT: "/bff/auth/logout",
			PROFILE: "/bff/auth/profile",
			REFRESH: "/bff/auth/refresh",
			SESSION: "/bff/session",
		},

		// Academic Management endpoints
		ACADEMIC: {
			COURSE_TYPES: "/bff/apig/academic/course-types",
			COURSES: "/bff/apig/academic/courses",
			MODULES: "/bff/apig/academic/modules",
			SUBJECTS: "/bff/apig/academic/subjects",
			SECTIONS: "/bff/apig/academic/sections",
			TOPICS: "/bff/apig/academic/topics",
			COURSE_GROUPS: "/bff/apig/academic/course-groups",
		},

		// Infrastructure Management endpoints
		INFRASTRUCTURE: {
			BATCH_CYCLES: "/bff/apig/infrastructure/batch-cycles",
			PREMISES: "/bff/apig/infrastructure/premises",
			INFRASTRUCTURE: "/bff/apig/infrastructure/infrastructure",
		},

		// Staff Management endpoints
		STAFF: {
			STAFF: "/bff/auth/staff",
			MENU_ITEMS: "/bff/apig/user/menu-items",
			ROLE_BASED_MENU: "/bff/apig/user/role-based-menu",
			STAFF_MENU_ACCESS: "/bff/apig/user/staff-menu-access",
			COURSE_ASSIGNMENTS: "/bff/apig/user/course-assignments",
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
			SCHEDULES: "/bff/apig/scheduling/schedules",
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
