import { createSelector } from "@reduxjs/toolkit";

export const selectUIState = (state) => state.ui;
// export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed;
export const selectNotifications = (state) => state.ui.notifications;
export const selectLoadingStates = (state) => state.ui.loading;
export const selectActiveModal = (state) => state.ui.modals.activeModal;
// export const selectPreferences = (state) => state.ui.preferences;
// export const selectRecentSearches = (state) => state.ui.recentSearches;
// export const selectBookmarkedItems = (state) => state.ui.bookmarkedItems;

// Complex UI state selectors
export const selectUnreadNotifications = createSelector(
	[selectNotifications],
	(notifications) => {
		return notifications.filter((notification) => !notification.read);
	}
);

export const selectNotificationsByType = createSelector(
	[selectNotifications],
	(notifications) => {
		return notifications.reduce((acc, notification) => {
			if (!acc[notification.type]) {
				acc[notification.type] = [];
			}
			acc[notification.type].push(notification);
			return acc;
		}, {});
	}
);

export const selectIsLoading = createSelector(
	[selectLoadingStates],
	(loadingStates) => {
		return (section) => {
			return section ? loadingStates[section] : loadingStates.global;
		};
	}
);


export const uiSelectors = {
	selectUIState,
	selectSidebarCollapsed,
	selectNotifications,
	selectActiveModal,
	selectLoadingStates,
	selectUnreadNotifications,
	selectNotificationsByType,
	selectIsLoading,
};
