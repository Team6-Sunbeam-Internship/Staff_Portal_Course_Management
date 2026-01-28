/*eslint-disable */
import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

export const batchCycleMgmtApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		//-------------------------Batch Cycle Api Endpoints-------------------------
		getBatchCycle: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.INFRASTRUCTURE.GET_ALL_BATCH_CYCLES,
				params,
			}),
			providesTags: ["BatchCycle"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		createBatchCycle: builder.mutation({
			query: (newBatchCycle) => ({
				url: API_CONFIG.ENDPOINTS.INFRASTRUCTURE.CREATE_BATCH_CYCLE,
				method: "POST",
				body: newBatchCycle,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newBatchCycle, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse;
					console.log("New ID: ", newId);
					const completeNewEntry = { ...newBatchCycle, id: newId };
					dispatch(
						batchCycleMgmtApi.util.updateQueryData("getBatchCycle", undefined, (draft) => {
							draft.unshift(completeNewEntry);
						})
					);
				} catch (error) {}
			},
		}),
		updateBatchCycle: builder.mutation({
			query: (updateData) => {
				const { id, ...body } = updateData;
				console.log("Update Data:", updateData);
				return {
					url: `${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.UPDATE_BATCH_CYCLE}/${id}`,
					method: "PUT",
					body,
				};
			},
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
				// 1. Optimistically apply the update to the cache
				const { id, ...body } = updateData;
				const patchResult = dispatch(
					batchCycleMgmtApi.util.updateQueryData("getBatchCycle", undefined, (draft) => {
						const index = draft.findIndex((item) => item.id === id);
						if (index !== -1) {
							Object.assign(draft[index], body);
						}
					})
				);

				try {
					await queryFulfilled;
				} catch (error) {
					patchResult.undo();
				}
			},
		}),
		deleteBatchCycle: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.DELETE_BATCH_CYCLE}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response,
			transformErrorResponse: (response) => response,

			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				// 1. Optimistically remove the item from the cache
				const patchResult = dispatch(
					batchCycleMgmtApi.util.updateQueryData("getBatchCycle", undefined, (draft) => {
						console.log("Current Cache Draft:", JSON.parse(JSON.stringify(draft))); // Debug 1: Check structure
						// Find and remove the item by ID
						const index = draft.findIndex((item) => item.id === id);
						console.log("Index found:", index);
						if (index !== -1) {
							draft.splice(index, 1);
						}
						console.log("Current Cache Draft:", JSON.parse(JSON.stringify(draft)));
					})
				);

				try {
					const response = await queryFulfilled; // 2. Wait for the network request to succeed
					console.log("Response:", response);
				} catch (error) {
					// 3. If the network request failed, revert the cache change
					patchResult.undo();
					// The item is restored in the list immediately on failure
				}
			},
		}),
	}),
});

export const { useGetBatchCycleQuery, useCreateBatchCycleMutation, useUpdateBatchCycleMutation, useDeleteBatchCycleMutation } = batchCycleMgmtApi;
