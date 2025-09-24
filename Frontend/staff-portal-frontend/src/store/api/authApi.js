// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const authApi = createApi({
// 	reducerPath: "authApi",
// 	baseQuery: fetchBaseQuery({
// 		baseUrl: "/api/auth",
// 		credentials: "include", // Include session cookies
// 		prepareHeaders: (headers, { getState }) => {
// 			// Add any additional headers if needed
// 			headers.set("Content-Type", "application/json");
// 			return headers;
// 		},
// 	}),
// 	tagTypes: ["User", "Profile"],
// 	endpoints: (builder) => ({
// 		getUserProfile: builder.query({
// 			query: () => "/me",
// 			providesTags: ["User"],
// 			transformResponse: (response) => response.user,
// 			// Enhanced caching with automatic refetch
// 			keepUnusedDataFor: 300, // 5 minutes
// 			refetchOnMountOrArgChange: 30, // 30 seconds
// 		}),

// 		updateUserProfile: builder.mutation({
// 			query: (userData) => ({
// 				url: "/profile",
// 				method: "PATCH",
// 				body: userData,
// 			}),
// 			invalidatesTags: ["User", "Profile"],
// 			// Optimistic updates
// 			onQueryStarted: async (userData, { dispatch, queryFulfilled }) => {
// 				const patchResult = dispatch(
// 					authApi.util.updateQueryData(
// 						"getUserProfile",
// 						undefined,
// 						(draft) => {
// 							Object.assign(draft, userData);
// 						}
// 					)
// 				);

// 				try {
// 					await queryFulfilled;
// 				} catch {
// 					patchResult.undo();
// 				}
// 			},
// 		}),

// 		changePassword: builder.mutation({
// 			query: (passwordData) => ({
// 				url: "/change-password",
// 				method: "POST",
// 				body: passwordData,
// 			}),
// 		}),
// 	}),
// });

// export const {
// 	useGetUserProfileQuery,
// 	useUpdateUserProfileMutation,
// 	useChangePasswordMutation,
// } = authApi;

import baseApi from "./baseApi";
import API_CONFIG from "../../config/api.config";
export const authApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		checkSession: builder.query({
			query: () => API_CONFIG.ENDPOINTS.AUTH.SESSION,
			providesTags: ["Session", "User"],
			transformResponse: (response) => response,
			transformErrorResponse: (response, /*meta, arg*/) => {
				if (response.status === 401)
					return {
						status: 401,
						message: "Session expired or invalid",
					};
				return response.data || response;
			},
		}),
		logout: builder.mutation({
			query: () => ({
				url: API_CONFIG.ENDPOINTS.AUTH.LOGOUT,
				method: "POST",
			}),
			invalidatesTags: ["Session", "User", "Profile"],
			onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
				try {
					await queryFulfilled;
					dispatch(baseApi.util.resetApiState());
					window.location.href = "/api/auth/login";
				} catch (error) {
					console.error("Logout error:", error);
				}
			},
		}),
		updateProfile: builder.mutation({
			query: (data) => ({
				url: API_CONFIG.ENDPOINTS.AUTH.PROFILE,
				method: "PATCH",
				body: data,
			}),
			invalidatesTags: ["User", "Profile"],
			onQueryStarted: async (data, { dispatch, queryFulfilled }) => {
				const patchResult = dispatch(
					baseApi.util.updateQueryData(
						"checkSession",
						void 0,
						(draft) => {
							if (draft?.user) Object.assign(draft.user, data);
						}
					)
				);
				try {
					await queryFulfilled;
				} catch {
					patchResult.undo();
				}
			},
		}),
		changePassword: builder.mutation({
			query: (data) => ({
				url: "/api/auth/change-password",
				method: "Patch",
				body: data,
			}),
			transformResponse: (response) => response,
			transformErrorResponse: (response) => response.data || response,
		}),
		forgotPassword: builder.mutation({
			query: (data) => ({
				url: "/api/auth/forgot-password",
				method: "POST",
				body: data,
			}),
			transformResponse: (response) => response,
			transformErrorResponse: (response) => response.data || response,
		})
	}),
	overrideExisting: !1,
});
export const {
	useCheckSessionQuery,
	useLogoutMutation,
	useUpdateProfileMutation,
	useChangePasswordMutation,
	useForgotPasswordMutation
} = authApi;
