import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import API_CONFIG from "../../config/api.config";
import {notify} from "../../utils/Notify"
const getCsrfToken = () => {
	// Looks for the cookie named XSRF-TOKEN
	const match = document.cookie.match(new RegExp("(^| )XSRF-TOKEN=([^;]+)"));
	return match ? decodeURIComponent(match[2]) : null;
};

const getSPARoute = () => {
	const currentPath = window.location.pathname + window.location.search;
	return currentPath;
}
const rawBaseQuery = fetchBaseQuery({
	baseUrl: API_CONFIG.BFF_BASE_URL,
	credentials: "include",
	prepareHeaders: (headers) => {
		const token = getCsrfToken();
		if (token) {
			// This header makes the 403 error go away
			headers.set("X-XSRF-TOKEN", token);
		}
		return headers;
	},
});

const baseQueryWithAuth = async (args, api, extraOptions) => {
	args.headers = {
		...args.headers,
		"X-SPA-Route": getSPARoute(),
	}
	const result = await rawBaseQuery(args, api, extraOptions);
	if (result.error?.status === 401) {
		sessionStorage.setItem("resumePending", "true");
		notify.error(result.error.data.message);
		window.location.href = API_CONFIG.BFF_BASE_URL + API_CONFIG.ENDPOINTS.AUTH.LOGIN;
	}
	return result;
};

export const baseApi = createApi({
	reducerPath: "api",
	baseQuery: baseQueryWithAuth,
	tagTypes: [
		"Session",
		"User",
		"Profile",
		"Staff",
		"MenuItems",
		"RoleBasedMenu",
		"StaffMenuAccess",
		"CourseAssignment",
		"CourseType",
		"Course",
		"Module",
		"Subject",
		"Section",
		"Topic",
		"CourseGroup",
		"BatchCycle",
		"Premise",
		"Infrastructure",
		"Student",
		"Schedule",
		"ScheduleSession",
		"Timesheet",
	],
	keepUnusedDataFor: 300,
	// refetchOnMountOrArgChange: 30,
	refetchOnFocus: !0,
	refetchOnReconnect: !0,
	endpoints: () => ({}),
});
export default baseApi;
