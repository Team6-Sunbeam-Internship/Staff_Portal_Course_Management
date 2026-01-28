import baseApi from "../baseApi";
import API_CONFIG from "../../../config/api.config";

export const systemAdministrationApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getSidebarMenuItems: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.SYSTEM_ADMINISTRATION.GET_SIDEBAR_MENU_ITEMS,
				params,
			}),
			providesTags: ["SidebarMenuItems"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		//--------------------------------MENU ITEMS CRUD OPERATIONS--------------------------------
		getAllMenuItems: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.SYSTEM_ADMINISTRATION.GET_ALL_MENU_ITEMS,
				params,
			}),
			providesTags: ["MenuItems"],
			transformResponse: (response) => response?.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		createMenuItem: builder.mutation({
			query: (request) => ({
				url: API_CONFIG.ENDPOINTS.SYSTEM_ADMINISTRATION.CREATE_MENU_ITEM,
				method: "POST",
				body: request,
			}),
			providesTags: ["MenuItems"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newMenuItem, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { ...newMenuItem, id: newId };
					dispatch(
						systemAdministrationApi.util.updateQueryData("getAllMenuItems", {}, (draft) => {
							draft.unshift(completeNewEntry);
						})
					);
				} catch (error) {}
			},
		}),
		updateMenuItem: builder.mutation({
			query: ({ id, updateMenuItem }) => ({
				url: `${API_CONFIG.ENDPOINTS.SYSTEM_ADMINISTRATION.UPDATE_MENU_ITEM}/${id}`,
				method: "PUT",
				body: updateMenuItem,
			}),
			providesTags: ["MenuItems"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ id, newMenuItem }, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					systemAdministrationApi.util.updateQueryData("getAllMenuItems", {}, (draft) => {
						const index = draft.findIndex((item) => item.id === id);
						if (index !== -1) {
							draft[index] = newMenuItem;
						}
					})
				);

				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		deleteMenuItem: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.SYSTEM_ADMINISTRATION.DELETE_MENU_ITEM}/${id}`,
				method: "DELETE",
			}),
			providesTags: ["MenuItems"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					systemAdministrationApi.util.updateQueryData("getAllMenuItems", {}, (draft) => {
						const index = draft.findIndex((item) => item.id === id);
						if (index !== -1) {
							draft.splice(index, 1);
						}
					})
				);

				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),

		getAllRoleBasedMenu: builder.query({
			query: () => ({
				url: API_CONFIG.ENDPOINTS.SYSTEM_ADMINISTRATION.GET_ALL_ROLE_MENU_ACCESS_ITEMS,
			}),
			providesTags: ["RoleBasedMenu"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		getRoleBasedMenu: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.ROLE_BASED_MENU,
				params,
			}),
			providesTags: ["RoleBasedMenu"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		updateRoleBasedMenuItem: builder.mutation({
			query: (updatePayload) => ({
				url: API_CONFIG.ENDPOINTS.SYSTEM_ADMINISTRATION.UPDATE_ROLE_MENU_ACCESS_ITEM,
				method: "PATCH",
				body: updatePayload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(updatePayload, { dispatch, queryFulfilled }) {
				// Pessimistic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					console.log("ServerResponse", serverResponse);
					const { updateAccessIds = [] } = serverResponse;
					dispatch(
						systemAdministrationApi.util.updateQueryData("getAllRoleBasedMenu", undefined, (draft) => {
							updateAccessIds.forEach((id) => {
								const item = draft.find((rbm) => rbm.id === id);
								if (item) {
									item.status = updatePayload.status;
								}
							});
						})
					);
				} catch (error) {}
			},
		}),
		getStaffAccessMenu: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.STAFF_MENU_ACCESS,
				params,
			}),
			providesTags: ["StaffMenuAccess"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		getAllStaffAccessMenu: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.GET_ALL_STAFF_MENU_ACCESS_EXCEPTION,
				params,
			}),
			providesTags: ["StaffMenuAccess"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		createUpdateStaffMenuAccess: builder.mutation({
			query: (body) => ({
				url: API_CONFIG.ENDPOINTS.STAFF.CREATE_UPDATE_STAFF_MENU_ACCESS_EXCEPTION,
				method: "POST",
				body,
			}),
			providesTags: ["StaffMenuAccess"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		deleteStaffMenuAccess: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.STAFF.DELETE_STAFF_MENU_ACCESS_EXCEPTION}/${id}`,
				method: "DELETE",
			}),
			providesTags: ["StaffMenuAccess"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
	}),
});

export const {
	useGetSidebarMenuItemsQuery,
	useGetAllMenuItemsQuery,
	useCreateMenuItemMutation,
	useUpdateMenuItemMutation,
	useDeleteMenuItemMutation,
	useGetAllRoleBasedMenuQuery,
	useGetRoleBasedMenuQuery,
	useUpdateRoleBasedMenuItemMutation,
	useGetStaffAccessMenuQuery,
	useGetAllStaffAccessMenuQuery,
	useCreateUpdateStaffMenuAccessMutation,
	useDeleteStaffMenuAccessMutation,
} = systemAdministrationApi;
