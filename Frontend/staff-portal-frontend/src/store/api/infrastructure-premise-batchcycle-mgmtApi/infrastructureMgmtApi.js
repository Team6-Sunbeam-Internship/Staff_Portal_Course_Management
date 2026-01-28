/*eslint-disable */
import API_CONFIG from "../../../config/api.config";
import { applyEntityPatch } from "../../../utils/rtkQueryApiPatch/applyEntityPatch";
import { deriveInfrastructureFields } from "../../../utils/rtkQueryApiPatch/infrastructureDerivation";
import baseApi from "../baseApi";
import { premiseMgmtApi } from "./premiseMgmtApi";

export const infrastructureMgmtApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllInfrastructure: builder.query({
			query: () => ({
				url: `${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.GET_ALL_INFRASTRUCTURE}`,
			}),
			providesTags: ["Infrastructure"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		createInfrastructure: builder.mutation({
			query: (body) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.CREATE_INFRASTRUCTURE}`,
				method: "POST",
				body,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newInfrastructure, { dispatch, queryFulfilled, getState }) {
				// Pessimitic patching
				try {
					const { data: newId } = await queryFulfilled;
					const state = getState();
					const premises = premiseMgmtApi.endpoints.getPremises.select()(state)?.data || [];
					const newEntity = { id: newId };
					applyEntityPatch({
						entity: newEntity,
						payload: newInfrastructure,
						derive: deriveInfrastructureFields(premises)
					})
					// const premisesTitle = premises.find(premise => premise.id === newInfrastructure.premiseId)?.title ?? ""
					// const completeNewEntry = { ...newInfrastructure, id: newId, premisesTitle };
					dispatch(
						infrastructureMgmtApi.util.updateQueryData("getAllInfrastructure", undefined, (draft) => {
							draft.unshift(newEntity);
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		}),
		updateInfrastructure: builder.mutation({
			query: (updateInfrastructureData) => {
				const { id, payload } = updateInfrastructureData;
				return {
					url: `${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.UPDATE_INFRASTRUCTURE}/${id}`,
					method: "PUT",
					body: payload,
				};
			},
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(updateInfrastructureData, { dispatch, queryFulfilled, getState }) {
				const { id, payload } = updateInfrastructureData;
				// Optmistic patching
				const patchResult = dispatch(
					infrastructureMgmtApi.util.updateQueryData("getAllInfrastructure", undefined, (draft) => {
						const entity = draft.find((infrastructure) => infrastructure.id === id);
						if (!entity) return;
						const premises = premiseMgmtApi.endpoints.getPremises.select()(getState())?.data || [];
						applyEntityPatch({
							entity,
							payload,
							derive: deriveInfrastructureFields(premises)
						})
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
		deleteInfrastructure: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.DELETE_INFRASTRUCTURE}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					infrastructureMgmtApi.util.updateQueryData("getAllInfrastructure", undefined, (draft) => {
						const index = draft.findIndex((infrastructure) => infrastructure.id === id);
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

export const { useGetAllInfrastructureQuery, useCreateInfrastructureMutation, useUpdateInfrastructureMutation, useDeleteInfrastructureMutation } =
	infrastructureMgmtApi;
