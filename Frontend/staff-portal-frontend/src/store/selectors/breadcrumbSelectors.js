import { createSelector } from "@reduxjs/toolkit";

// base selectors
export const selectBreadcrumbs = (state) => state.breadcrumb;

export const selectBreadcrumbItems = createSelector(
	[selectBreadcrumbs],
	(breadcrumb) => breadcrumb.breadcrumbItems
)