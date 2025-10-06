import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api";
import { breadcrumbSlice } from "./slices/breadcrumbSlice";
import { uiSlice, authSlice } from "./slices";

export const store = configureStore({
	reducer: {
		[baseApi.reducerPath]: baseApi.reducer,
		breadcrumb: breadcrumbSlice.reducer,
		ui: uiSlice.reducer,
		auth: authSlice.reducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(baseApi.middleware),
})

export const { getState, dispatch } = store;
export default store;