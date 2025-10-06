/*eslint-disable */
import baseApi from "../baseApi";

export const infrastructureMgmtApi = baseApi.injectEndpoints({
	endpoints: () => ({
		getAllInfrastructure: {
			query: () => ({
				url: "/infrastructure",
			}),
			providesTags: ["Infrastructure"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		},
		createInfrastructure: {
			query: (body) => ({
				url: "/infrastructure",
				method: "POST",
				body,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newInfrastructure, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { ...newInfrastructure, id: newId };
					dispatch(
						infrastructureMgmtApi.util.updateQueryData("getAllInfrastructure", {}, (draft) => {
							draft.unshift(completeNewEntry);
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		},
		updateInfrastructure: {
			query: (body) => ({
				url: "/infrastructure",
				method: "PUT",
				body,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newInfrastructure, { dispatch, queryFulfilled }) {
				// Optmistic patching
				const patchResult = dispatch(
					infrastructureMgmtApi.util.updateQueryData("getAllInfrastructure", {}, (draft) => {
						const index = draft.findIndex((infrastructure) => infrastructure.id === newInfrastructure.id);
						if (index !== -1) {
							draft[index] = newInfrastructure;
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
		},
		deleteInfrastructure: {
			query: (body) => ({
				url: "/infrastructure",
				method: "DELETE",
				body,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newInfrastructure, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					infrastructureMgmtApi.util.updateQueryData("getAllInfrastructure", {}, (draft) => {
						const index = draft.findIndex((infrastructure) => infrastructure.id === newInfrastructure.id);
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
		},
	}),
});

export const { useGetAllInfrastructureQuery, useCreateInfrastructureMutation, useUpdateInfrastructureMutation, useDeleteInfrastructureMutation } =
	infrastructureMgmtApi;
