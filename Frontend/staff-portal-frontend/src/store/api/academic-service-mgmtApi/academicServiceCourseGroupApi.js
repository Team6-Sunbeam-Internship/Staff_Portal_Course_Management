import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

export const academicServiceCourseGroupApi = baseApi.injectEndpoints({
	endpoints: (builder) => {
		getCourseGroups: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.GET_ALL_COURSE_GROUPS,
				params,
			}),
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: "CourseGroup", id })), { type: "CourseGroup", id: "LIST" }]
					: [{ type: "CourseGroup", id: "LIST" }],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		});
		createCourseGroup: builder.mutation({
			query: (body) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_COURSE_GROUP,
				method: "POST",
				body,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newCourseGroup, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { id: newId, ...newCourseGroup };
					dispatch(
						academicServiceCourseGroupApi.util.updateQueryData("getCourseGroups", {}, (draft) => {
							draft.unshift(completeNewEntry);
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		});
		updateCourseGroup: builder.mutation({
			query: ({ courseGroupId, updatedCourseGroup }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_COURSE_GROUP}/${courseGroupId}`,
				method: "PUT",
				body: updatedCourseGroup,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			onQueryStarted: async (courseGroupId, updatedCourseGroup, { dispatch, queryFulfilled }) => {
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceCourseGroupApi.util.updateQueryData("getCourseGroups", {}, (draft) => {
						const index = draft.findIndex((courseGroup) => courseGroup.id === courseGroupId);
						if (index !== -1) {
							draft[index] = updatedCourseGroup;
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
		});
		deleteCourseGroup: builder.mutation({
			query: (courseGroupId) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_COURSE_GROUP}/${courseGroupId}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			onQueryStarted: async (courseGroupId, { dispatch, queryFulfilled }) => {
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceCourseGroupApi.util.updateQueryData("getCourseGroups", {}, (draft) => {
						const index = draft.findIndex((courseGroup) => courseGroup.id === courseGroupId);
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
		});
	},
});

export const { useGetCourseGroupsQuery, useCreateCourseGroupMutation, useUpdateCourseGroupMutation, useDeleteCourseGroupMutation } =
	academicServiceCourseGroupApi;
