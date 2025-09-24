import { createListenerMiddleware } from "@reduxjs/toolkit";
// import { logout } from "../slices/authSlice";
import { showNotification } from "../slices/uiSlice";

// store/middleware/errorMiddleware.js
export const errorMiddleware = createListenerMiddleware();

// Global error handler for API failures
errorMiddleware.startListening({
	predicate: (action) => {
		return action.type.endsWith("/rejected") && action.payload?.status;
	},
	effect: async (action, listenerApi) => {
		const { status, data } = action.payload;
		const state = listenerApi.getState();

		// Handle different HTTP status codes
		switch (status) {
			case 401:
				// Unauthorized - trigger logout
				if (state.auth.isAuthenticated) {
					// listenerApi.dispatch(logout());
				}
				break;

			case 403:
				// Forbidden - show permission error
				listenerApi.dispatch(
					showNotification({
						type: "error",
						title: "Access Denied",
						message:
							"You do not have permission to perform this action.",
					})
				);
				break;

			case 422:
				// Validation error - show validation messages
				if (data?.errors) {
					Object.entries(data.errors).forEach(([field, messages]) => {
						listenerApi.dispatch(
							showNotification({
								type: "error",
								title: "Validation Error",
								message: `${field}: ${messages.join(", ")}`,
							})
						);
					});
				}
				break;

			case 500:
				// Server error
				listenerApi.dispatch(
					showNotification({
						type: "error",
						title: "Server Error",
						message:
							"An unexpected server error occurred. Please try again later.",
					})
				);
				break;

			default:
				// Generic error
				listenerApi.dispatch(
					showNotification({
						type: "error",
						title: "Request Failed",
						message:
							data?.message || "An unexpected error occurred.",
					})
				);
		}
	},
});
