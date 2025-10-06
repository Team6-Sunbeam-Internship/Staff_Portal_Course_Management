import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import API_CONFIG from "../../config/api.config";
const baseQuery = fetchBaseQuery({
	baseUrl: API_CONFIG.BFF_BASE_URL,
	credentials: "include",
	prepareHeaders: (headers) => {
		headers.set("Content-Type", "application/json");
		headers.set("Accept", "application/json");
		// headers for multipart file upload
		return headers;
	},
});
export const baseApi = createApi({
	reducerPath: "api",
	baseQuery,
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
		"Video",
		"Report",
		"Certificate",
	],
	keepUnusedDataFor: 300,
	refetchOnMountOrArgChange: 30,
	refetchOnFocus: !0,
	refetchOnReconnect: !0,
	endpoints: () => ({}),
});
export default baseApi;
