import { createSelector } from "@reduxjs/toolkit";

export const selectAuthUser = (state) => state.auth.authUser;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsInitializing = (state) => state.auth.isInitializing;

export const selectUserRole = createSelector(
	[selectAuthUser],
	(authUser) => authUser.role
)