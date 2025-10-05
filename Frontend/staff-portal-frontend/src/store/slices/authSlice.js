import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	user: null,
	isAuthenticated: !1,
	isInitializing: !0,
	lastActivity: null,
	userRole: null,
	permissions: [],
	accessibleMenus: [],
	staffExceptions: [],
};
export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAuthData: (e, t) => {
			const {
				user: s,
				permissions: a = [],
				accessibleMenus: c = [],
				staffExceptions: i = [],
			} = t.payload;
			(e.user = s),
				(e.userRole = s?.role || null),
				(e.permissions = a),
				(e.accessibleMenus = c),
				(e.staffExceptions = i),
				(e.isAuthenticated = !0),
				(e.isInitializing = !1),
				(e.lastActivity = Date.now());
		},
		clearAuthData: (e) => {
			Object.assign(e, { ...initialState, isInitializing: !1 });
		},
		setInitializationComplete: (e) => {
			e.isInitializing = !1;
		},
		updateLastActivity: (e) => {
			e.lastActivity = Date.now();
		},
		updateUserProfile: (e, t) => {
			e.user && Object.assign(e.user, t.payload);
		},
		setPermissions: (e, t) => {
			e.permissions = t.payload;
		},
		setAccessibleMenus: (e, t) => {
			e.accessibleMenus = t.payload;
		},
		setStaffExceptions: (e, t) => {
			e.staffExceptions = t.payload;
		},
	},
});
export const {
	setAuthData,
	clearAuthData,
	setInitializationComplete,
	updateLastActivity,
	updateUserProfile,
	setPermissions,
	setAccessibleMenus,
	setStaffExceptions,
} = authSlice.actions;
export default authSlice.reducer;
