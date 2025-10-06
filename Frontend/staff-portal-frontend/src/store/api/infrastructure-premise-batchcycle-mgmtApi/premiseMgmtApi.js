/* eslint-disable */
import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

export const premiseMgmtApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getPremises: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.INFRASTRUCTURE.GET_ALL_PREMISES,
			}),
			providesTags: ["Premises"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		createPremise: builder.mutation({
			query: (newPremise) => ({
				url: API_CONFIG.ENDPOINTS.INFRASTRUCTURE.CREATE_PREMISE,
				method: "POST",
				body: newPremise,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newPremise, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { ...newPremise, id: newId };
					dispatch(
						premiseMgmtApi.util.updateQueryData("getPremises", {}, (draft) => {
							draft.unshift(completeNewEntry);
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		}),
		updatePremise: builder.mutation({
			query: (id, udpatedPremise) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.UPDATE_PREMISE}${id}`,
				method: "PUT",
				body: udpatedPremise,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(updatedPremise, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					premiseMgmtApi.util.updateQueryData("getPremises", {}, (draft) => {
						const index = draft.findIndex((premise) => premise.id === updatedPremise.id);
						if (index !== -1) {
							draft[index] = updatedPremise;
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
		deletePremise: builder.mutation({
			query: (id) => ({
				url: `/${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.DELETE_PREMISE}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					premiseMgmtApi.util.updateQueryData("getPremises", {}, (draft) => {
						const index = draft.findIndex((premise) => premise.id === id);
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

export const { useGetPremisesQuery, useCreatePremiseMutation, useUpdatePremiseMutation, useDeletePremiseMutation } = premiseMgmtApi;
