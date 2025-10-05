import { createListenerMiddleware } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { clearAuthData } from "../slices/authSlice";
import { initializeUI, resetUI } from "../slices/uiSlice";

export const authMiddleware = createListenerMiddleware();

// Handle successful login
authMiddleware.startListening({
	matcher: authApi.endpoints.checkSession.matchFulfilled,
	effect: async (action, listenerApi) => {
		const { user } = action.payload;

		// Initialize UI state for the user
		listenerApi.dispatch(initializeUI({ userRole: user.role }));
	},
});

// Handle logout
authMiddleware.startListening({
	actionCreator: authApi.endpoints.logout.matchFulfilled,
	effect: async (action, listenerApi) => {
		// Clear all user-related state
		listenerApi.dispatch(clearAuthData());
		// listenerApi.dispatch(clearPermissions());
		listenerApi.dispatch(resetUI());

		// Clear any cached data
		listenerApi.dispatch(authApi.util.resetApiState());
	},
});
