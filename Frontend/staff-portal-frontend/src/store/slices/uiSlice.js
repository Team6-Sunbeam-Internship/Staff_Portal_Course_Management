import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	sidebarCollapsed: false,
	notifications: [],
	loading: {
		global: false,
		entities: {},
	},
	modals: {
		activeModal: null,
		modalData: null,
	},
	filters: {},
	pagination: {},
};

export const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		toggleSidebar: (state) => {
			state.sidebarCollapsed = !state.sidebarCollapsed;
		},
		setSidebarCollapsed: (state, action) => {
			state.sidebarCollapsed = action.payload;
		},
		showNotification: (state, action) => {
			const notification = {
				id: Date.now() + Math.random(),
				timestamp: Date.now(),
				...action.payload,
			};
			state.notifications.unshift(notification);
			if (state.notifications.length > 10) {
				state.notifications = state.notifications.slice(0, 10);
			}
		},
		removeNotification: (state, action) => {
			state.notifications = state.notifications.filter(
				(notification) => notification.id !== action.payload
			);
		},
		clearNotifications: (state) => {
			state.notifications = [];
		},
		setGlobalLoading: (state, action) => {
			state.loading.global = action.payload;
		},
		setEntityLoading: (state, action) => {
			const { entity, loading } = action.payload;
			state.loading.entities[entity] = loading;
		},
		clearEntityLoading: (state, action) => {
			delete state.loading.entities[action.payload];
		},
		openModal: (state, action) => {
			const { modalId, data = null } = action.payload;
			state.modals.activeModal = modalId;
			state.modals.modalData = data;
		},
		closeModal: (state) => {
			state.modals.activeModal = null;
			state.modals.modalData = null;
		},
		setFilters: (state, action) => {
			const { entity, filters } = action.payload;
			state.filters[entity] = filters;
		},
		clearFilters: (state, action) => {
			delete state.filters[action.payload];
		},
		setPagination: (state, action) => {
			const { entity, pagination } = action.payload;
			state.pagination[entity] = pagination;
		},
		clearPagination: (state, action) => {
			delete state.pagination[action.payload];
		},
		resetUI: () => initialState,
		initializeUI: (state, action) => {
			const { userRole } = action.payload;
			// Initialize UI based on user role if needed
			if (userRole === "ADMIN") {
				state.sidebarCollapsed = false;
			}
		},
	},
});

export const {
	toggleSidebar,
	setSidebarCollapsed,
	showNotification,
	removeNotification,
	clearNotifications,
	setGlobalLoading,
	setEntityLoading,
	clearEntityLoading,
	openModal,
	closeModal,
	setFilters,
	clearFilters,
	setPagination,
	clearPagination,
	resetUI,
	initializeUI,
} = uiSlice.actions;

export default uiSlice.reducer;
