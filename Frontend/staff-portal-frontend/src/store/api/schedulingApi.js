import baseApi from "./baseApi";
import API_CONFIG from "../../config/api.config";

export const schedulingApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getSchedules: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.SCHEDULING.SCHEDULES,
				params,
			}),
			providesTags: (result) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "Schedule",
								id,
							})),
							"Schedule",
					  ]
					: ["Schedule"],
			transformResponse: (response) => response.data || response,
		}),
		createSchedule: builder.mutation({
			query: (schedule) => ({
				url: API_CONFIG.ENDPOINTS.SCHEDULING.SCHEDULES,
				method: "POST",
				body: schedule,
			}),
			invalidatesTags: ["Schedule"],
		}),
		createBulkSchedule: builder.mutation({
			query: (schedules) => ({
				url: `${API_CONFIG.ENDPOINTS.SCHEDULING.SCHEDULES}/bulk`,
				method: "POST",
				body: schedules,
			}),
			invalidatesTags: ["Schedule"],
		}),
		updateSchedule: builder.mutation({
			query: ({ id, ...schedule }) => ({
				url: `${API_CONFIG.ENDPOINTS.SCHEDULING.SCHEDULES}/${id}`,
				method: "PATCH",
				body: schedule,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Schedule", id },
			],
		}),
		deleteSchedule: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.SCHEDULING.SCHEDULES}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Schedule", id }],
		}),
		checkScheduleConflicts: builder.mutation({
			query: (scheduleData) => ({
				url: `${API_CONFIG.ENDPOINTS.SCHEDULING.SCHEDULES}/check-conflicts`,
				method: "POST",
				body: scheduleData,
			}),
		}),
		getSessions: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.SCHEDULING.SESSIONS,
				params,
			}),
			providesTags: (result) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "ScheduleSession",
								id,
							})),
							"ScheduleSession",
					  ]
					: ["ScheduleSession"],
			transformResponse: (response) => response.data || response,
		}),
		createSession: builder.mutation({
			query: (session) => ({
				url: API_CONFIG.ENDPOINTS.SCHEDULING.SESSIONS,
				method: "POST",
				body: session,
			}),
			invalidatesTags: ["ScheduleSession"],
		}),
		updateSession: builder.mutation({
			query: ({ id, ...session }) => ({
				url: `${API_CONFIG.ENDPOINTS.SCHEDULING.SESSIONS}/${id}`,
				method: "PATCH",
				body: session,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "ScheduleSession", id },
			],
		}),
		deleteSession: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.SCHEDULING.SESSIONS}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "ScheduleSession", id },
			],
		}),
		getTimesheets: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.SCHEDULING.TIMESHEETS,
				params,
			}),
			providesTags: (result) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "Timesheet",
								id,
							})),
							"Timesheet",
					  ]
					: ["Timesheet"],
			transformResponse: (response) => response.data || response,
		}),
		submitTimesheet: builder.mutation({
			query: (timesheet) => ({
				url: API_CONFIG.ENDPOINTS.SCHEDULING.TIMESHEETS,
				method: "POST",
				body: timesheet,
			}),
			invalidatesTags: ["Timesheet"],
		}),
		updateTimesheet: builder.mutation({
			query: ({ id, ...timesheet }) => ({
				url: `${API_CONFIG.ENDPOINTS.SCHEDULING.TIMESHEETS}/${id}`,
				method: "PATCH",
				body: timesheet,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Timesheet", id },
			], 
			transformResponse: (response) => response.data || response,
		}),
		approveTimesheet: builder.mutation({
			query: ({ id, approvalData }) => ({
				url: `${API_CONFIG.ENDPOINTS.SCHEDULING.TIMESHEETS}/${id}/approve`,
				method: "POST",
				body: approvalData,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Timesheet", id },
			],
		}),
		getVideos: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.SCHEDULING.RECORDED_VIDEOS,
				params,
			}),
			providesTags: ["Video"],
			transformResponse: (response) => response.data || response,
		}),
		createVideo: builder.mutation({
			query: (video) => ({
				url: API_CONFIG.ENDPOINTS.SCHEDULING.RECORDED_VIDEOS,
				method: "POST",
				body: video,
			}),
			invalidatesTags: ["Video"],
		}),
	}),
	overrideExisting: false,
});
export const {
	useGetSchedulesQuery,
	useCreateScheduleMutation,
	useCreateBulkScheduleMutation,
	useUpdateScheduleMutation,
	useDeleteScheduleMutation,
	useCheckScheduleConflictsMutation,
	useGetSessionsQuery,
	useCreateSessionMutation,
	useUpdateSessionMutation,
	useDeleteSessionMutation,
	useGetTimesheetsQuery,
	useSubmitTimesheetMutation,
	useUpdateTimesheetMutation,
	useApproveTimesheetMutation,
	useGetVideosQuery,
	useCreateVideoMutation,
} = schedulingApi;
