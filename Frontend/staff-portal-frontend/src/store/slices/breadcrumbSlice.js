import { createSlice } from "@reduxjs/toolkit";

export const breadcrumbSlice = createSlice({
	name: "breadcrumb",
	initialState: {
		breadcrumbItems: [],
		customTrail: null,
		autoGenerate: true,
	},
	reducers: {
		setBreadcrumbs: (state, action) => {
			state.items = action.payload;
			state.customTrail = null;
		},

		addBreadcrumb: (state, action) => {
			const breadcrumb = action.payload;
			const existingIndex = state.items.findIndex(
				(item) => item.path === breadcrumb.path
			);

			if (existingIndex >= 0) {
				state.items[existingIndex] = breadcrumb;
			} else {
				state.items.push(breadcrumb);
			}
		},

		removeBreadcrumb: (state, action) => {
			const path = action.payload;
			state.items = state.items.filter((item) => item.path !== path);
		},

		setCustomTrail: (state, action) => {
			state.customTrail = action.payload;
			state.items = action.payload;
		},

		clearCustomTrail: (state) => {
			state.customTrail = null;
		},

		toggleAutoGenerate: (state) => {
			state.autoGenerate = !state.autoGenerate;
		},

		generateFromPath: (state, action) => {
			const { pathname, mappings = {} } = action.payload;

			if (!state.autoGenerate) return;

			const segments = pathname.split("/").filter(Boolean);
			const breadcrumbs = [
				{ title: "Home", path: "/dashboard", icon: "home" },
			];

			let currentPath = "";
			segments.forEach((segment, index) => {
				currentPath += `/${segment}`;
				const mapping = mappings[currentPath];

				if (mapping) {
					breadcrumbs.push({
						title: mapping.title,
						path: currentPath,
						icon: mapping.icon,
					});
				} else {
					breadcrumbs.push({
						title:
							segment.charAt(0).toUpperCase() +
							segment.slice(1).replace(/-/g, " "),
						path: currentPath,
						icon: "document",
					});
				}
			});

			state.items = breadcrumbs;
		},
	},
});

export const {
	setBreadcrumbs,
	addBreadcrumb,
	removeBreadcrumb,
	setCustomTrail,
	clearCustomTrail,
	toggleAutoGenerate,
	generateFromPath,
} = breadcrumbSlice.actions;

export default breadcrumbSlice.reducer;
