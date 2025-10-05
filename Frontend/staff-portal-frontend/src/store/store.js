// import { configureStore, combineSlices } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
// import { authSlice } from "./slices/authSlice";
// import { permissionsSlice } from "./slices/permissionsSlice";
// import { uiSlice } from "./slices/uiSlice";
// import { breadcrumbSlice } from "./slices/breadcrumbSlice";
// import { staffApi, studentApi, schedulingApi, reportsApi, authApi, academicApi, infrastructureApi } from "./api";
// import { authMiddleware, errorMiddleware, cacheMiddleware } from "./middleware";
// import { academicSlice, infrastructureSlice, schedulingSlice, staffSlice } from "./slices";
// import { studentsSlice } from "./slices/studentSlice";


// // Static slices that are always loaded
// const staticSlices = combineSlices(
// 	authSlice,
// 	permissionsSlice,
// 	uiSlice,
// 	breadcrumbSlice
// );

// // Dynamic slices that can be lazy-loaded
// const dynamicSlices = combineSlices();

// // Combine all API slices for RTK Query integration
// const apiSlices = [ 
// 	academicSlice,
// 	infrastructureSlice,
// 	schedulingSlice,
// 	staffSlice,
// 	studentsSlice
// ];

// // Create the root reducer with support for dynamic injection
// const createRootReducer = (asyncReducers = {}) => {
// 	return combineSlices(
// 		staticSlices,
// 		dynamicSlices,
// 		...apiSlices
// 			.map((api) => api.reducerPath)
// 			.reduce((acc, path, index) => {
// 				acc[path] = apiSlices[index].reducer;
// 				return acc;
// 			}, {}),
// 		...asyncReducers
// 	);
// };

// // Configure the store with advanced middleware setup
// export const store = configureStore({
// 	reducer: createRootReducer(),
// 	middleware: (getDefaultMiddleware) =>
// 		getDefaultMiddleware({
// 			serializableCheck: {
// 				// Ignore RTK Query internal actions
// 				ignoredActions: [
// 					"persist/PERSIST",
// 					"persist/REHYDRATE",
// 					...apiSlices.flatMap((api) => [
// 						api.util.getRunningQueriesThunk.pending.type,
// 						api.util.getRunningQueriesThunk.fulfilled.type,
// 						api.util.getRunningMutationsThunk.pending.type,
// 						api.util.getRunningMutationsThunk.fulfilled.type,
// 					]),
// 				],
// 				ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
// 				ignoredPaths: ["items.dates"],
// 			},
// 			thunk: {
// 				extraArgument: {
// 					// Extra argument for thunks - can include services, etc.
// 					api: apiSlices.reduce((acc, api) => {
// 						acc[api.reducerPath] = api;
// 						return acc;
// 					}, {}),
// 				},
// 			},
// 		}).concat(
// 			// Add all API middlewares
// 			...apiSlices.map((api) => api.middleware),
// 			// Custom middlewares
// 			authMiddleware,
// 			errorMiddleware,
// 			cacheMiddleware
// 		),
// 	devTools: process.env.NODE_ENV !== "production" && {
// 		name: "Staff Portal Store",
// 		trace: true,
// 		traceLimit: 25,
// 		actionSanitizer: (action) => ({
// 			...action,
// 			// Sanitize sensitive data in dev tools
// 			...(action.type.includes("auth") &&
// 				action.payload?.password && {
// 					payload: { ...action.payload, password: "[REDACTED]" },
// 				}),
// 		}),
// 		stateSanitizer: (state) => ({
// 			...state,
// 			// Sanitize sensitive state data
// 			auth: state.auth
// 				? {
// 						...state.auth,
// 						token: state.auth.token ? "[REDACTED]" : null,
// 				}
// 				: state.auth,
// 		}),
// 	},
// 	enhancers: (getDefaultEnhancers) =>
// 		getDefaultEnhancers({
// 			autoBatch: { type: "tick" }, // Use RAF batching for better performance
// 		}),
// });

// // Setup RTK Query listeners for refetchOnFocus/refetchOnReconnect
// setupListeners(store.dispatch);

// // Enable dynamic reducer injection
// store.asyncReducers = {};

// // Function to inject reducers dynamically (for code splitting)
// store.injectReducer = (key, asyncReducer) => {
// 	if (!store.asyncReducers[key]) {
// 		store.asyncReducers[key] = asyncReducer;
// 		store.replaceReducer(createRootReducer(store.asyncReducers));
// 	}
// };

// // Function to remove reducers (for cleanup)
// store.removeReducer = (key) => {
// 	if (store.asyncReducers[key]) {
// 		delete store.asyncReducers[key];
// 		store.replaceReducer(createRootReducer(store.asyncReducers));
// 	}
// };

// // Export types for TypeScript support (if needed in future)
// export const getState = store.getState;
// export const dispatch = store.dispatch;

// // Export API hooks for components
// export const {
// 	// Auth API hooks
// 	useLoginMutation,
// 	useLogoutMutation,
// 	useRefreshTokenMutation,
// 	useGetUserProfileQuery,
// } = authApi;

// export const {
// 	// Academic API hooks
// 	useGetCourseTypesQuery,
// 	useCreateCourseTypeMutation,
// 	useUpdateCourseTypeMutation,
// 	useDeleteCourseTypeMutation,
// 	useGetCoursesQuery,
// 	useCreateCourseMutation,
// 	useUpdateCourseMutation,
// 	useDeleteCourseMutation,
// 	useGetModulesQuery,
// 	useCreateModuleMutation,
// 	useUpdateModuleMutation,
// 	useDeleteModuleMutation,
// } = academicApi;

// export const {
// 	// Infrastructure API hooks
// 	useGetBatchCyclesQuery,
// 	useCreateBatchCycleMutation,
// 	useGetPremisesQuery,
// 	useCreatePremiseMutation,
// 	useGetInfrastructureQuery,
// 	useCreateInfrastructureMutation,
// } = infrastructureApi;

// export const {
// 	// Staff API hooks
// 	useGetStaffQuery,
// 	useCreateStaffMutation,
// 	useUpdateStaffMutation,
// 	useDeleteStaffMutation,
// 	useAssignRoleMutation,
// 	useAssignCoordinatorMutation,
// } = staffApi;

// export const {
// 	// Students API hooks
// 	useGetStudentsQuery,
// 	useImportStudentsMutation,
// 	useCreateCourseGroupMutation,
// 	useAssignStudentToGroupMutation,

// } = studentApi;

// export const {
// 	// Scheduling API hooks
// 	useGetSchedulesQuery,
// 	useCreateScheduleMutation,
// 	useGetSessionsQuery,
// 	useCreateSessionMutation,
// 	useGetTimesheetsQuery,
// 	useSubmitTimesheetMutation,
// 	useApproveTimesheetMutation,
// } = schedulingApi;

// export const {
// 	// Reports API hooks
// 	useGenerateReportMutation,
// 	useGetReportsQuery,
// 	useDownloadReportMutation,
// } = reportsApi;

// export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
// import {
// 	authSlice,
// 	permissionsSlice,
// 	uiSlice,
// 	breadcrumbSlice,
// } from "./slices";
// import {
// 	authApi,
// 	academicApi,
// 	infrastructureApi,
// 	staffApi,
// 	studentApi,
// 	schedulingApi,
// 	reportsApi,
// } from "./api";
// import { authMiddleware, errorMiddleware, cacheMiddleware } from "./middleware";

// export const store = configureStore({
// 	reducer: {
// 		// RTK Query API slices
// 		[authApi.reducerPath]: authApi.reducer,
// 		[academicApi.reducerPath]: academicApi.reducer,
// 		[infrastructureApi.reducerPath]: infrastructureApi.reducer,
// 		[staffApi.reducerPath]: staffApi.reducer,
// 		[studentApi.reducerPath]: studentApi.reducer,
// 		[schedulingApi.reducerPath]: schedulingApi.reducer,
// 		[reportsApi.reducerPath]: reportsApi.reducer,

// 		// Redux Toolkit core slices for non-API state
// 		auth: authSlice.reducer,
// 		permissions: permissionsSlice.reducer,
// 		ui: uiSlice.reducer,
// 		breadcrumb: breadcrumbSlice.reducer,
// 	},

// 	middleware: (getDefaultMiddleware) =>
// 		getDefaultMiddleware({
// 			serializableCheck: {
// 				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
// 				ignoredPaths: ["meta.arg", "payload.timestamp"],
// 			},
// 		}).concat(
// 			authApi.middleware,
// 			academicApi.middleware,
// 			infrastructureApi.middleware,
// 			staffApi.middleware,
// 			studentApi.middleware,
// 			schedulingApi.middleware,
// 			reportsApi.middleware,
// 			authMiddleware,
// 			errorMiddleware,
// 			cacheMiddleware
// 		),

// 	devTools: process.env.NODE_ENV !== "production" && {
// 		name: "Staff Portal Store",
// 		trace: true,
// 		traceLimit: 25,
// 		actionSanitizer: (action) => ({
// 			...action,
// 			...(action.type.includes("auth") && action.payload?.password
// 				? { payload: { ...action.payload, password: "[REDACTED]" } }
// 				: {}),
// 		}),
// 		stateSanitizer: (state) => ({
// 			...state,
// 			auth: state.auth
// 				? {
// 						...state.auth,
// 						token: state.auth.token ? "[REDACTED]" : null,
// 				  }
// 				: state.auth,
// 		}),
// 	},
// });

// setupListeners(store.dispatch);

// export const { getState, dispatch } = store;
// export default store;

import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import "./api";
import { baseApi } from "./api/baseApi";
import { authSlice } from "./slices/authSlice";
import { uiSlice } from "./slices/uiSlice";
import { breadcrumbSlice } from "./slices/breadcrumbSlice";
import { errorMiddleware } from "./middleware/errorMiddleware";
export const store = configureStore({
	reducer: {
		[baseApi.reducerPath]: baseApi.reducer,
		auth: authSlice.reducer,
		ui: uiSlice.reducer,
		breadcrumb: breadcrumbSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
				ignoredPaths: ["meta.arg", "payload.timestamp"],
			},
		}).concat(errorMiddleware.middleware, baseApi.middleware),
	// devTools: process.env.NODE_ENV !== "production" && {
	// 	name: "Staff Portal Store",
	// 	trace: true,
	// 	traceLimit: 25,
	// 	actionSanitizer: (action) => ({
	// 		...action,
	// 		...(action.type.includes("auth") && action.payload?.password
	// 			? { payload: { ...action.payload, password: "[REDACTED]" } }
	// 			: {}),
	// 	}),
	// 	stateSanitizer: (state) => ({
	// 		...state,
	// 		auth: state.auth?.user
	// 			? {
	// 					...state.auth,
	// 					user: { ...state.auth.user, token: "[REDACTED]" },
	// 			  }
	// 			: state.auth,
	// 	}),
	// },
});
setupListeners(store.dispatch);
export const { getState, dispatch } = store;
export default store;

