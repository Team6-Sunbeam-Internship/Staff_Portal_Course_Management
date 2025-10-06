import baseApi from "./baseApi";
import API_CONFIG from "../../config/api.config";

export const userApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllStaff: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.ALL_STAFF,
				params,
			}),
			providesTags: ["Staff"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		// For Module Router
		// param: course_code == course_designation + multiple -> response: List<EligibleStafDTO>: staffId, name, course_designation
		getEligibleStaff: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.ELIGIBLE_STAFF,
				params,
			}),
			providesTags: ["Staff"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		createStaff: builder.mutation({
			query: (staff) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.CREATE_STAFF,
				method: "POST",
				body: staff,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(staff, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { ...staff, id: newId };
					dispatch(
						userApi.util.updateQueryData("getAllStaff", {}, (draft) => {
							draft.unshift(completeNewEntry);
						})
					);
				} catch (error) {
					// do nothing
				}
			}
		}),
		// authUserId == staffId
		updateStaff: builder.mutation({
			query: ({  staffId, staff }) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.UPDATE_STAFF,
				method: "PUT",
				body: staff,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({staffId, staff}, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					userApi.util.updateQueryData("getAllStaff", staffId, (draft) => {
						const index = draft.findIndex((item) => item.id === staffId);
						if (index !== -1) {
							draft[index] = staff;
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
		deleteStaff: builder.mutation({
			query: (staffId) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.DELETE_STAFF,
				method: "DELETE",
				body: staffId,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(staffId, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					userApi.util.updateQueryData("getAllStaff", staffId, (draft) => {
						const index = draft.findIndex((item) => item.id === staffId);
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
	}),
});

export const {
	useGetAllStaffQuery,
	useGetEligibleStaffQuery,
	useCreateStaffMutation,
	useUpdateStaffMutation,
	useDeleteStaffMutation,
} = userApi;
