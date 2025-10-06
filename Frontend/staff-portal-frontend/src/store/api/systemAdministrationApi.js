import baseApi from "./baseApi";
import API_CONFIG from "../../config/api.config";

export const systemAdministrationApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getMenuItems: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.MENU_ITEMS,
				params,
			}),
			providesTags: ["MenuItems"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		getAllRoleBasedMenu: builder.query({
			query: () => ({
				url: API_CONFIG.ENDPOINTS.STAFF.ALL_ROLE_BASED_MENU,
			}),
			providesTags: ["RoleBasedMenu"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		getRoleBasedMenu: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.ROLE_BASED_MENU,
				params,
			}),
			providesTags: ["RoleBasedMenu"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		getStaffAccessMenu: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.STAFF_MENU_ACCESS,
				params,
			}),
			providesTags: ["StaffMenuAccess"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		getAllStaffAccessMenu: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.STAFF_MENU_ACCESS,
				params,
			}),
			providesTags: ["StaffMenuAccess"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
	}),
});

export const {
	useGetMenuItemsQuery,
	useGetAllRoleBasedMenuQuery,
	useGetRoleBasedMenuQuery,
	useGetStaffAccessMenuQuery,
	useGetAllStaffAccessMenuQuery,
} = systemAdministrationApi;
