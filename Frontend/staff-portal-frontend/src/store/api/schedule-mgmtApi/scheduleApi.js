import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

const cleanQueryArgs = (queryArgs) => {
	const cleaned = {};
	for (const key in queryArgs) {
		if (queryArgs[key] !== null && queryArgs[key] !== undefined && queryArgs[key] !== "") {
			cleaned[key] = queryArgs[key];
		}
	}
	return cleaned;
};

export const scheduleApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getSchedules: builder.query({
			query: (queryArgs) => ({
				url: API_CONFIG.ENDPOINTS.SCHEDULING.GET_SCHEDULES,
				params: cleanQueryArgs(queryArgs),
			}),
			serializeQueryArgs: ({ endpoints, queryArgs }) => {
				const { ...filters } = queryArgs;
				return endpoints + JSON.stringify(cleanQueryArgs(filters));
			},
			providesTags: ["Schedule"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		createSchedule: builder.mutation({
			query: ({ schedule }) => ({
				url: API_CONFIG.ENDPOINTS.SCHEDULING.CREATE_SCHEDULE,
				method: "POST",
				body: schedule,
			}),
			providesTags: ["Schedule"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ currentFilters, schedule }, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const targetFilters = cleanQueryArgs(currentFilters || {});
					const newId = serverResponse.id;
					const completeNewEntry = { ...schedule, id: newId };
					dispatch(
						scheduleApi.util.updateQueryData("getSchedules", targetFilters, (draft) => {
							draft.unshift(completeNewEntry);
						})
					);
				} catch (error) {}
			},
		}),
		updateSchedule: builder.mutation({
			query: ({ schedule }) => ({
				url: `${API_CONFIG.ENDPOINTS.SCHEDULING.UPDATE_SCHEDULE}/${schedule.id}`,
				method: "PUT",
				body: schedule,
			}),
			providesTags: ["Schedule"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ currentFilters, schedule }, { dispatch, queryFulfilled }) {
				const targetFilters = cleanQueryArgs(currentFilters) || {};
				// Optimistic patching
				const patchResult = dispatch(
					scheduleApi.util.updateQueryData("getSchedules", targetFilters, (draft) => {
						const index = draft.findIndex((item) => item.id === schedule.id);
						if (index !== -1) {
							draft[index] = schedule;
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		deleteSchedule: builder.mutation({
			query: ({ sessionId }) => ({
				url: `${API_CONFIG.ENDPOINTS.SCHEDULING.DELETE_SCHEDULE}/${sessionId}`,
				method: "DELETE",
			}),
			providesTags: ["Schedule"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ currentFilters, sessionId }, { dispatch, queryFulfilled }) {
				const targetFilters = cleanQueryArgs(currentFilters) || {};

				// optimistic patching
				const patchResult = dispatch(
					scheduleApi.util.updateQueryData("getSchedules", targetFilters, (draft) => {
						const index = draft.findIndex((item) => item.id === sessionId);
						if (index !== -1) {
							draft.splice(index, 1);
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
	}),
});

export const { useGetSchedulesQuery, useCreateScheduleMutation, useUpdateScheduleMutation, useDeleteScheduleMutation } = scheduleApi;
