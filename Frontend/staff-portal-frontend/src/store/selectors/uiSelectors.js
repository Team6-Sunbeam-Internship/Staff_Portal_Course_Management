import { createSelector } from "@reduxjs/toolkit";

// A "root" selector that gets the entire UI state slice
const selectUiState = (state) => state.ui;

/**
 * Selector to get the header object from the UI state.
 * @returns {{ title: string, subtitle: string, action: React.ReactNode | null }}
 */
export const selectHeaderInfo = createSelector(
	[selectUiState],
	(uiState) => uiState.header
);

/**
 * Selector to get just the title from the header object.
 * This is an example of a more granular selector.
 * @returns {string}
 */
export const selectHeaderTitle = createSelector(
	[selectHeaderInfo],
	(header) => header.title
);

export const selectHeaderTitleAndSubtitle = createSelector(
	[selectHeaderInfo],
	(header) => ({
		title: header.title,
		subtitle: header.subtitle,
	})
);
