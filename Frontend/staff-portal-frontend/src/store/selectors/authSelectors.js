import { createSelector } from "@reduxjs/toolkit";

// Base selectors
export const selectAuthState = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsInitializing = (state) => state.auth.isInitializing;
export const selectLastActivity = (state) => state.auth.lastActivity;
export const selectUserRole = (state) => state.auth.userRole;
export const selectPermissions = (state) => state.auth.permissions;
export const selectAccessibleMenus = (state) => state.auth.accessibleMenus;
export const selectStaffExceptions = (state) => state.auth.staffExceptions;
export const selectBreadcrumbs = (state) => state.auth.breadcrumbs;
// Derived selectors
export const selectCurrentUser = selectUser;

export const selectUserFullName = createSelector([selectUser], (user) => {
	if (!user) return null;
	return user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();
});

export const selectUserInitials = createSelector(
	[selectUserFullName],
	(fullName) => {
		if (!fullName) return "U";
		return fullName
			.split(" ")
			.map((name) => name.charAt(0))
			.join("")
			.toUpperCase()
			.slice(0, 2);
	}
);

export const selectIsAdmin = createSelector(
	[selectUserRole],
	(role) => role === "ADMIN"
);

export const selectIsCourseCoordinator = createSelector(
	[selectUserRole],
	(role) => role === "COURSE_COORDINATOR"
);

export const selectCanAccessPath = createSelector(
	[selectAccessibleMenus],
	(accessibleMenus) => (path) => accessibleMenus.includes(path)
);

export const selectHasPermission = createSelector(
	[selectPermissions],
	(permissions) => (permission) => permissions.includes(permission)
);

export const selectUserStaffExceptions = createSelector(
	[selectStaffExceptions, selectUser],
	(staffExceptions, user) => {
		if (!user?.id) return [];
		return staffExceptions.filter(
			(exception) => exception.staffId === user.id
		);
	}
);

