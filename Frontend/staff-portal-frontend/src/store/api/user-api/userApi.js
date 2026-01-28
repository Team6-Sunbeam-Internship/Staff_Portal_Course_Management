import { createEntityAdapter } from "@reduxjs/toolkit";
import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

// create entity adapter
export const staffAdapter = createEntityAdapter({
	selectId: (staff) => staff.staffId,
});
// initial state
export const initialState = staffAdapter.getInitialState();

export const userApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllStaff: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.ALL_STAFF,
				params,
			}),
			providesTags: ["Staff"],
			transformResponse: (response) => staffAdapter.setAll(initialState, response.apiResponse),
			transformErrorResponse: (response) => response,
		}),
		// For Module Router
		// param: uniqueCourseName + multiple -> response: List<EligibleStafDTO>: staffId, name, course_specialization
		getEligibleStaff: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.ELIGIBLE_STAFF,
				params,
			}),
			providesTags: ["Staff"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		createStaff: builder.mutation({
			query: (payload) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.CREATE_STAFF,
				method: "POST",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(payload, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse;
					const completeNewEntry = { ...payload, staffId: newId };
					dispatch(
						userApi.util.updateQueryData("getAllStaff", {}, (draft) => {
							staffAdapter.addOne(draft, completeNewEntry);
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		}),
		// authUserId == staffId
		updateStaff: builder.mutation({
			query: ({ id, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.UPDATE_STAFF}`,
				method: "PATCH",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ id, payload }, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					userApi.util.updateQueryData("getAllStaff", {}, (draft) => {
						staffAdapter.updateOne(draft, { id, changes: payload });
					})
				);

				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		deleteStaff: builder.mutation({
			query: (staffId) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.DELETE_STAFF}/${staffId}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(staffId, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					userApi.util.updateQueryData("getAllStaff", {}, (draft) => {
						staffAdapter.removeOne(draft, staffId);
					})
				);

				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
	}),
});

export const { useGetAllStaffQuery, useGetEligibleStaffQuery, useCreateStaffMutation, useUpdateStaffMutation, useDeleteStaffMutation } = userApi;
