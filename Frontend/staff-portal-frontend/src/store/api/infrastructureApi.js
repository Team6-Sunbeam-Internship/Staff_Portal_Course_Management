import baseApi from "./baseApi";
import API_CONFIG from "../../config/api.config";
export const infrastructureApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getBatchCycles: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.INFRA.BATCH_CYCLES,
				params,
			}),
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({
								type: "BatchCycle",
								id,
							})),
							"BatchCycle",
					  ]
					: ["BatchCycle"],
			transformResponse: (response) => response.data || response,
		}),
		createBatchCycle: builder.mutation({
			query: (c) => ({
				url: API_CONFIG.ENDPOINTS.INFRA.BATCH_CYCLES,
				method: "POST",
				body: c,
			}),
			invalidatesTags: ["BatchCycle"],
		}),
		updateBatchCycle: builder.mutation({
			query: ({ id, ...c }) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRA.BATCH_CYCLES}/${id}`,
				method: "PATCH",
				body: c,
			}),
			invalidatesTags: (r, e, { id }) => [{ type: "BatchCycle", id }],
		}),
		deleteBatchCycle: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRA.BATCH_CYCLES}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (r, e, id) => [{ type: "BatchCycle", id }],
		}),
		getPremises: builder.query({
			query: (p = {}) => ({
				url: API_CONFIG.ENDPOINTS.INFRA.PREMISES,
				params: p,
			}),
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({
								type: "Premise",
								id,
							})),
							"Premise",
					  ]
					: ["Premise"],
			transformResponse: (response) => response.data || response,
		}),
		createPremise: builder.mutation({
			query: (premise) => ({
				url: API_CONFIG.ENDPOINTS.INFRA.PREMISES,
				method: "POST",
				body: premise,
			}),
			invalidatesTags: ["Premise"],
		}),
		updatePremise: builder.mutation({
			query: ({ id, ...premise }) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRA.PREMISES}/${id}`,
				method: "PATCH",
				body: premise,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Premise", id },
			],
		}),
		deletePremise: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRA.PREMISES}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Premise", id }],
		}),
		getInfrastructures: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.INFRA.INFRASTRUCTURES,
				params,
			}),
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({
								type: "Infrastructure",
								id,
							})),
							"Infrastructure",
					  ]
					: ["Infrastructure"],
			transformResponse: (response) => response.data || response,
		}),
		createInfrastructure: builder.mutation({
			query: (infrastructure) => ({
				url: API_CONFIG.ENDPOINTS.INFRA.INFRASTRUCTURES,
				method: "POST",
				body: infrastructure,
			}),
			invalidatesTags: ["Infrastructure"],
		}),
		updateInfrastructure: builder.mutation({
			query: ({ id, ...infrastructure }) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRA.INFRASTRUCTURES}/${id}`,
				method: "PATCH",
				body: infrastructure,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Infrastructure", id },
			],
		}),
		deleteInfrastructure: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.INFRA.INFRASTRUCTURES}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "Infrastructure", id },
			],
		}),
	}),
});
export const {
	useGetBatchCyclesQuery,
	useCreateBatchCycleMutation,
	useUpdateBatchCycleMutation,
	useDeleteBatchCycleMutation,
	useGetPremisesQuery,
	useCreatePremiseMutation,
	useUpdatePremiseMutation,
	useDeletePremiseMutation,
	useGetInfrastructuresQuery,
	useCreateInfrastructureMutation,
	useUpdateInfrastructureMutation,
	useDeleteInfrastructureMutation,
} = infrastructureApi;
