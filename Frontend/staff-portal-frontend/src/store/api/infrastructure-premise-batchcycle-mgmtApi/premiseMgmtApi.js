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
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		createPremise: builder.mutation({
			query: (newPremise) => ({
				url: API_CONFIG.ENDPOINTS.INFRASTRUCTURE.CREATE_PREMISE,
				method: "POST",
				body: newPremise,
				headers: {
					"Content-Type": "application/json",
					"X-COMMAND-TYPE": "CREATE_PREMISE",
				},
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newPremise, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse;
					const completeNewEntry = { ...newPremise, id: newId };
					dispatch(
						premiseMgmtApi.util.updateQueryData("getPremises", undefined, (draft) => {
							draft.unshift(completeNewEntry);
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		}),
		updatePremise: builder.mutation({
			query: (updatePremiseData) => {
				const { id, payload } = updatePremiseData;
				console.log("updatePremiseData:", updatePremiseData);
				return {
					url: `${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.UPDATE_PREMISE}/${id}`,
					method: "PUT",
					body: payload,
					headers: {
						"Content-Type": "application/json",
						"X-COMMAND-TYPE": "UPDATE_PREMISE",
					},
				};
			},
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(updatedPremiseData, { dispatch, queryFulfilled }) {
				const { id, payload } = updatedPremiseData;
				// Optimistic patching
				const patchResult = dispatch(
					premiseMgmtApi.util.updateQueryData("getPremises", undefined, (draft) => {
						const index = draft.findIndex((premise) => premise.id === id);
						console.log("Premise Update Index:", index);
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
		deletePremise: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.DELETE_PREMISE}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					premiseMgmtApi.util.updateQueryData("getPremises", undefined, (draft) => {
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
