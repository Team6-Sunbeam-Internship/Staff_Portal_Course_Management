import baseApi from "./baseApi";
import API_CONFIG from "../../config/api.config";

export const dashboardApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getDashboardStats: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.DASHBOARD.STATS,
				params,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response /*meta, arg*/) => response,
		}),
		getRecentActivities: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES,
				params,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response /*meta, arg*/) => response,
		}),
	}),
});

export const { useGetDashboardStatsQuery, useGetRecentActivitiesQuery } =
	dashboardApi;
