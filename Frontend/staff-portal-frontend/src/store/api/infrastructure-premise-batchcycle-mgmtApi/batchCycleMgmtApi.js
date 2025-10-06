/*eslint-disable */
import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

const batchCycleMgmtApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		//-------------------------Batch Cycle Api Endpoints-------------------------
		getBatchCycle: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.INFRASTRUCTURE.BATCH_CYCLES,
				params,
			}),
			providesTags: ["BatchCycle"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		createBatchCycle: builder.mutation({
			query: (body) => ({
				url: API_CONFIG.ENDPOINTS.INFRASTRUCTURE.CREATE_BATCH_CYCLE,
				method: "POST",
				body,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newBatchCycle, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					
					dispatch(
						batchCycleMgmtApi.util.updateQueryData("getBatchCycle", {}, (draft) => {
							draft.unshift(serverResponse);
						})
					);
				} catch (error) {}
			},
		}),
		updateBatchCycle: builder.mutation({
			query: (id, body) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRASTRUCTURE.UPDATE_BATCH_CYCLE}/${id}`,
				method: "PUT",
				body,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(updateData, { dispatch, queryFulfilled }) {
				// 1. Optimistically apply the update to the cache
				const patchResult = dispatch(
					batchCycleMgmtApi.util.updateQueryData("getBatchCycle", {}, (draft) => {
						const index = draft.findIndex((item) => item.id === updateData.id);
						if (index !== -1) {
							Object.assign(draft[index], updateData);
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
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,

			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				// 1. Optimistically remove the item from the cache
				const patchResult = dispatch(
					batchCycleMgmtApi.util.updateQueryData("getBatchCycle", {}, (draft) => {
						// Find and remove the item by ID
						const index = draft.findIndex((item) => item.id === id);
						if (index !== -1) {
							draft.splice(index, 1);
						}
					})
				);

				try {
					await queryFulfilled; // 2. Wait for the network request to succeed
				} catch (error) {
					// 3. If the network request failed, revert the cache change
					patchResult.undo();
					// The item is restored in the list immediately on failure
				}
			},
		}),
	}),
});

export const {
	useGetBatchCycleQuery,
	useCreateBatchCycleMutation,
	useUpdateBatchCycleMutation,
	useDeleteBatchCycleMutation,
} = batchCycleMgmtApi;
