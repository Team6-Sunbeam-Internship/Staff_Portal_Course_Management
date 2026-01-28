import API_CONFIG from "../../../config/api.config";
import { updateAuthUser } from "../../slices/authSlice";
import baseApi from "../baseApi";

export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		checkSession: builder.query({
			query: () => ({
				url: API_CONFIG.ENDPOINTS.AUTH.SESSION,
				headers: {
					"Content-Type": "application/json",
				},
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			providesTags: ["Session"],
		}),
		updateAuthUserProfile: builder.mutation({
			query: (profileData) => ({
				url: API_CONFIG.ENDPOINTS.AUTH.UPDATE_AUTH_USER_PROFILE,
				method: "POST",
				body: profileData,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			providesTags: ["Session"],
			async onQueryStarted(profileData, { dispatch, getState, queryFulfilled }) {
				// Optimistic patching
				const originalState = getState().auth.authUser;

				dispatch(updateAuthUser(profileData));

				try {
					const result = await queryFulfilled;
				} catch (error) {
					dispatch(updateAuthUser(originalState));
				}
			},
		}),
		getPreservedCommands: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.AUTH.PRESERVED_COMMANDS,
				params,
			}),
			providesTags: ["PreservedCommands"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
	}),
});

export const { useCheckSessionQuery, useUpdateAuthUserProfileMutation, useGetPreservedCommandsQuery } = authApi;
