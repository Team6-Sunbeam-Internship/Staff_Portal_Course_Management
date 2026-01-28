/*eslint-disable*/
import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

export const academicServiceCourseTypeApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllCourseTypes: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.GET_ALL_COURSE_TYPES,
				params,
			}),
			providesTags: ["CourseType"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		createCourseType: builder.mutation({
			query: (payload) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_COURSE_TYPES,
				method: "POST",
				body: payload,
				headers: {
					"Content-Type": "application/json",
					"X-COMMAND-TYPE": "CREATE_COURSE_TYPE",
				},
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(payload, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: newId } = await queryFulfilled;
					const completeNewEntry = { ...payload, id: newId };
					dispatch(
						academicServiceCourseTypeApi.util.updateQueryData("getAllCourseTypes", undefined, (draft) => {
							draft.push(completeNewEntry);
						})
					);
				} catch (error) {
					console.log(error);
				}
			},
		}),
		updateCourseType: builder.mutation({
			query: ({ id, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_COURSE_TYPES}/${id}`,
				method: "PUT",
				body: payload,
				headers: {
					"Content-Type": "application/json",
					"X-COMMAND-TYPE": "UPDATE_COURSE_TYPE",
				},
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			onQueryStarted: async ({ id, payload }, { dispatch, queryFulfilled }) => {
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceCourseTypeApi.util.updateQueryData("getAllCourseTypes", undefined, (draft) => {
						const index = draft.findIndex((item) => item.id === id);
						if (index !== -1) {
							draft[index] = payload;
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
		deleteCourseType: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_COURSE_TYPES}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response,
			transformErrorResponse: (response) => response,
			onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
				
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceCourseTypeApi.util.updateQueryData("getAllCourseTypes", undefined, (draft) => {
						const index = draft.findIndex((item) => item.id === id);
						
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

export const { useGetAllCourseTypesQuery, useCreateCourseTypeMutation, useUpdateCourseTypeMutation, useDeleteCourseTypeMutation } =
	academicServiceCourseTypeApi;
