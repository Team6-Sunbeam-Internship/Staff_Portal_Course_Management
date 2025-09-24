// // store/slices/permissionsSlice.js
// import {
// 	createSlice,
// 	createAsyncThunk,
// } from "@reduxjs/toolkit";
// import { permissionAdapters } from "../adapters";



// export const fetchUserPermissions = createAsyncThunk(
// 	"permissions/fetchUserPermissions",
// 	async (_, { getState, rejectWithValue }) => {
// 		try {
// 			const { auth } = getState();

// 			if (!auth.isAuthenticated || !auth.user) {
// 				return rejectWithValue("User not authenticated");
// 			}

// 			const response = await fetch("/api/permissions/user", {
// 				credentials: "include",
// 			});

// 			if (!response.ok) {
// 				throw new Error("Failed to fetch permissions");
// 			}

// 			const permissionsData = await response.json();
// 			return permissionsData;
// 		} catch (error) {
// 			return rejectWithValue(error.message);
// 		}
// 	}
// );

// const initialState = permissionAdapters.getInitialState({
// 	userRole: null,
// 	isLoading: false,
// 	error: null,
// 	lastUpdated: null,
// 	roleHierarchy: {
// 		ADMIN: 3,
// 		COURSE_COORDINATOR: 2,
// 		GENERAL_USER: 1,
// 	},
// 	menuItems: [],
// 	accessibleRoutes: [],
// });

// export const permissionsSlice = createSlice({
// 	name: "permissions",
// 	initialState,
// 	reducers: {
// 		setPermissions: (state, action) => {
// 			const { permissions, role, menuItems = [] } = action.payload;

// 			state.userRole = role;
// 			state.menuItems = menuItems;
// 			state.lastUpdated = Date.now();
// 			state.error = null;

// 			// Normalize and store permissions
// 			permissionAdapters.setAll(state, permissions);

// 			// Extract accessible routes from permissions
// 			state.accessibleRoutes = permissions
// 				.filter((p) => p.allowed && p.menuPath)
// 				.map((p) => p.menuPath);
// 		},

// 		clearPermissions: (state) => {
// 			state.userRole = null;
// 			state.menuItems = [];
// 			state.accessibleRoutes = [];
// 			state.lastUpdated = null;
// 			state.error = null;
// 			permissionAdapters.removeAll(state);
// 		},

// 		updatePermission: (state, action) => {
// 			const { permissionId, allowed } = action.payload;
// 			permissionAdapters.updateOne(state, {
// 				id: permissionId,
// 				changes: { allowed },
// 			});
// 		},

// 		addMenuException: (state, action) => {
// 			const { staffId, menuItem, allowed } = action.payload;
// 			// Add logic for staff-specific menu exceptions
// 			const exceptionId = `${staffId}_${menuItem}`;
// 			permissionAdapters.upsertOne(state, {
// 				id: exceptionId,
// 				resource: menuItem,
// 				action: "access",
// 				allowed,
// 				isException: true,
// 				staffId,
// 			});
// 		},

// 		removeMenuException: (state, action) => {
// 			const { staffId, menuItem } = action.payload;
// 			const exceptionId = `${staffId}_${menuItem}`;
// 			permissionAdapters.removeOne(state, exceptionId);
// 		},
// 	},

// 	extraReducers: (builder) => {
// 		builder
// 			.addCase(fetchUserPermissions.pending, (state) => {
// 				state.isLoading = true;
// 				state.error = null;
// 			})
// 			.addCase(fetchUserPermissions.fulfilled, (state, action) => {
// 				state.isLoading = false;
// 				const { permissions, role, menuItems } = action.payload;

// 				state.userRole = role;
// 				state.menuItems = menuItems || [];
// 				state.lastUpdated = Date.now();

// 				permissionAdapters.setAll(state, permissions);

// 				state.accessibleRoutes = permissions
// 					.filter((p) => p.allowed && p.menuPath)
// 					.map((p) => p.menuPath);
// 			})
// 			.addCase(fetchUserPermissions.rejected, (state, action) => {
// 				state.isLoading = false;
// 				state.error = action.payload;
// 			});
// 	},
// });

// export const {
// 	setPermissions,
// 	clearPermissions,
// 	updatePermission,
// 	addMenuException,
// 	removeMenuException,
// } = permissionsSlice.actions;

// export default permissionsSlice.reducer;
