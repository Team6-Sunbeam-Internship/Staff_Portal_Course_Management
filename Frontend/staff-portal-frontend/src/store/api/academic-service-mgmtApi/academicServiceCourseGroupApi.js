import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

export const academicServiceCourseGroupApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getCourseGroups: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.GET_ALL_COURSE_GROUPS,
				params,
			}),
			providesTags: (result) =>
				result ?
					[...result.map(({ id }) => ({ type: "CourseGroup", id })), { type: "CourseGroup", id: "LIST" }]
				:	[{ type: "CourseGroup", id: "LIST" }],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		createCourseGroup: builder.mutation({
			query: ({ payload, courseCode }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_COURSE_GROUP}/${courseCode}`,
				method: "POST",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				const { payload, courseCode, batchCycleId, courseTypeId } = args;
				// Pessimitic patching
				try {
					const { data: serverResponse = [] } = await queryFulfilled;
					const completeNewEntry = serverResponse.map((id, index) => ({
						id: id,
						...payload[index],
						batchCycleId,
						courseTypeId,
						courseCode,
					}));
					// create an array of objects
					dispatch(
						academicServiceCourseGroupApi.util.updateQueryData("getCourseGroups", courseCode, (draft) => {
							draft.unshift(...completeNewEntry);
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		}),
		updateCourseGroup: builder.mutation({
			query: ({ id, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_COURSE_GROUP}/${id}`,
				method: "PUT",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				const { id, payload, courseCode, batchCycleId, courseTypeId } = args;
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceCourseGroupApi.util.updateQueryData("getCourseGroups", courseCode, (draft) => {
						const index = draft.findIndex((courseGroup) => courseGroup.id === id);
						if (index !== -1) {
							draft[index] = { ...payload, batchCycleId, courseTypeId, courseCode, id };
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
		deleteCourseGroup: builder.mutation({
			query: ({ id }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_COURSE_GROUP}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				const { id, courseCode } = args;
				// Optimistic patching
				const patchResutl = dispatch(
					academicServiceCourseGroupApi.util.updateQueryData("getCourseGroups", courseCode, (draft) => {
						const index = draft.findIndex((courseGroup) => courseGroup.id === id);
						if (index !== -1) {
							draft.splice(index, 1);
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResutl.undo();
				}
			},
		}),
	}),
});

export const { useGetCourseGroupsQuery, useCreateCourseGroupMutation, useUpdateCourseGroupMutation, useDeleteCourseGroupMutation } =
	academicServiceCourseGroupApi;
