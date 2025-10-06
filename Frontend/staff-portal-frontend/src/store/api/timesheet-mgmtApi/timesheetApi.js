import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

export const timesheetApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getModuleRouterCoursehierarchy: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.TIMESHEET.MODULE_ROUTER_COURSE_HIERARCHY,
				params,
				headers: {
					"Content-Type": "application/json",
				},
			}),
			providesTags: ["ModuleRouterCourseHierarchy"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
	}),
});

export const { useGetModuleRouterCoursehierarchyQuery } = timesheetApi;
