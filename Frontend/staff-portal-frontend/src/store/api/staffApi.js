import baseApi from "./baseApi";
import API_CONFIG from "../../config/api.config";

export const staffApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getStaff: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.STAFF,
				params,
			}),
			providesTags: (result) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "Staff",
								id,
							})),
							"Staff",
					  ]
					: ["Staff"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response /*meta, arg*/) => response,
		}),
		createStaff: builder.mutation({
			query: (staff) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.STAFF,
				method: "POST",
				body: staff,
			}),
			invalidatesTags: ["Staff"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response /*meta, arg*/) => response,
		}),
		updateStaff: builder.mutation({
			query: ({ id, ...staff }) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.STAFF}/${id}`,
				method: "PATCH",
				body: staff,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: "Staff", id }],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response /*meta, arg*/) => response,
		}),
		deleteStaff: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.STAFF}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Staff", id }],
		}),
		getMenuItems: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.MENU_ITEMS,
				params,
			}),
			providesTags: ["MenuItems"],
			transformResponse: (response) => response.data || response,
		}),
		createMenuItem: builder.mutation({
			query: (menuItem) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.MENU_ITEMS,
				method: "POST",
				body: menuItem,
			}),
			invalidatesTags: ["MenuItems"],
		}),
		updateMenuItem: builder.mutation({
			query: ({ id, ...menuItem }) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.MENU_ITEMS}/${id}`,
				method: "PATCH",
				body: menuItem,
			}),
			invalidatesTags: ["MenuItems"],
		}),
		deleteMenuItem: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.MENU_ITEMS}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["MenuItems"],
		}),
		getRoleBasedMenu: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.ROLE_BASED_MENU,
				params,
			}),
			providesTags: ["RoleBasedMenu"],
			transformResponse: (response) => response.data || response,
		}),
		createRoleBasedMenu: builder.mutation({
			query: (roleMenu) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.ROLE_BASED_MENU,
				method: "POST",
				body: roleMenu,
			}),
			invalidatesTags: ["RoleBasedMenu"],
		}),
		updateRoleBasedMenu: builder.mutation({
			query: ({ id, ...roleMenu }) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.ROLE_BASED_MENU}/${id}`,
				method: "PATCH",
				body: roleMenu,
			}),
			invalidatesTags: ["RoleBasedMenu"],
		}),
		deleteRoleBasedMenu: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.ROLE_BASED_MENU}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["RoleBasedMenu"],
		}),
		getStaffMenuAccess: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.STAFF_MENU_ACCESS,
				params,
			}),
			providesTags: ["StaffMenuAccess"],
			transformResponse: (response) => response.data || response,
		}),
		updateStaffMenuAccess: builder.mutation({
			query: ({ staffId, menuAccess }) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.STAFF_MENU_ACCESS}/${staffId}`,
				method: "PATCH",
				body: menuAccess,
			}),
			invalidatesTags: ["StaffMenuAccess"],
		}),
		getCourseCoordinatorAssignments: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.COURSE_ASSIGNMENTS,
				params,
			}),
			providesTags: ["CourseAssignment"],
			transformResponse: (response) => response.data || response,
		}),
		assignCourseToCoordinator: builder.mutation({
			query: ({ staffId, courseIds }) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.COURSE_ASSIGNMENTS,
				method: "POST",
				body: { staffId, courseIds },
			}),
			invalidatesTags: ["CourseAssignment", "Staff"],
		}),
		updateCoordinatorCourseAssignment: builder.mutation({
			query: ({ assignmentId, courseIds }) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.COURSE_ASSIGNMENTS}/${assignmentId}`,
				method: "PATCH",
				body: { courseIds },
			}),
			invalidatesTags: ["CourseAssignment", "Staff"],
		}),
		removeCoordinatorAssignment: builder.mutation({
			query: ({ assignmentId }) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.COURSE_ASSIGNMENTS}/${assignmentId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["CourseAssignment", "Staff"],
		}),
		assignStaffToModule: builder.mutation({
			query: ({ moduleId, staffId }) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.MODULE_ASSIGNMENT,
				method: "POST",
				body: { moduleId, staffId },
			}),
			invalidatesTags: ["ModuleAssignments", "Staff"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response /*meta, arg*/) => response,
		}),
		removeStaffFromModule: builder.mutation({
			query: ({ moduleId, staffId }) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.MODULE_ASSIGNMENT,
				method: "DELETE",
				body: { moduleId, staffId },
			}),
			invalidatesTags: ["ModuleAssignments", "Staff"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response /*meta, arg*/) => response,
		}),
		getAvailableStaff: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.AVAILABLE_STAFF,
				params,
			}),
			providesTags: ["AvailableStaff"],
			transformResponse: (response) => response.data || response,
		}),
	}),
	overrideExisting: !1,
});
export const {
	useGetStaffQuery,
	useCreateStaffMutation,
	useUpdateStaffMutation,
	useDeleteStaffMutation,
	useGetMenuItemsQuery,
	useCreateMenuItemMutation,
	useUpdateMenuItemMutation,
	useDeleteMenuItemMutation,
	useGetRoleBasedMenuQuery,
	useCreateRoleBasedMenuMutation,
	useUpdateRoleBasedMenuMutation,
	useDeleteRoleBasedMenuMutation,
	useGetStaffMenuAccessQuery,
	useUpdateStaffMenuAccessMutation,
	useGetCourseCoordinatorAssignmentsQuery,
	useAssignCourseToCoordinatorMutation,
	useUpdateCoordinatorCourseAssignmentMutation,
	useRemoveCoordinatorAssignmentMutation,
	useAssignStaffToModuleMutation,
	useGetAvailableStaffQuery,
	useRemoveStaffFromModuleMutation,
} = staffApi;
