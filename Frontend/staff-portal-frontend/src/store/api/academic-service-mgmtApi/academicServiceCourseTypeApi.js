/*eslint-disable*/
import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

const academicServiceCourseTypeApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllCourseTypes: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.GET_ALL_COURSE_TYPES,
				params,
			}),
			providesTags: ["CourseType"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		createCourseType: builder.mutation({
			query: (body) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC_SERVICE.CREATE_COURSE_TYPE,
				method: "POST",
				body,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newCourseType, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { ...newCourseType, id: newId };
					dispatch(
						academicServiceCourseTypeApi.util.updateQueryData("getAllCourseTypes", {}, (draft) => {
							draft.unshift(completeNewEntry);
						})
					);
				} catch (error) {
					console.log(error);
				}
			},
		}),
		updateCourseType: builder.mutation({
			query: (body) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_COURSE_TYPES}/${body.id}`,
				method: "PUT",
				body,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			onQueryStarted: async (body, { dispatch, queryFulfilled }) => {
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceCourseTypeApi.util.updateQueryData("getAllCourseTypes", {}, (draft) => {
						const index = draft.findIndex((item) => item.id === body.id);
						if (index !== -1) {
							draft[index] = body;
						}
					})
				)
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			}
		}),
		deleteCourseType: builder.mutation({
			query: (body) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_COURSE_TYPES}/${body.id}`,
				method: "DELETE",
				body,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			onQueryStarted: async (body, { dispatch, queryFulfilled }) => {
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceCourseTypeApi.util.updateQueryData("getAllCourseTypes", {}, (draft) => {
						const index = draft.findIndex((item) => item.id === body.id);
						if (index !== -1) {
							draft.splice(index, 1);
						}
					})
				)
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			}
		})
	})
})

export const {
	useGetAllCourseTypesQuery,
	useCreateCourseTypeMutation,
	useUpdateCourseTypeMutation,
	useDeleteCourseTypeMutation
} = academicServiceCourseTypeApi;