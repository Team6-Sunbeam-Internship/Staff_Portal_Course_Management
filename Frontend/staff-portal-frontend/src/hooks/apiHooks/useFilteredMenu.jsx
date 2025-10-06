import { useEffect, useState } from "react";
import { menuStructure } from "../../utils";
import {
	useGetMenuItemsQuery,
	useGetRoleBasedMenuQuery,
	useGetStaffAccessMenuQuery,
} from "../../store";

// A dummy function to simulate getting staffId and role from an auth context or URL
// This should ideally be moved to a context or utility file in a real application.
export const getStaffInfo = () => ({
	staffId: "b90545bf-e16e-4343-a9fa-854cc397069d",
	roleName: "ADMIN",
});

/**
 * Custom hook to fetch menu permissions and build the filtered navigation menu.
 * @returns {{
 * filteredMenu: Array,
 * isLoading: boolean,
 * isError: boolean
 * }}
 */
export const useFilteredMenu = () => {
	const [filteredMenu, setFilteredMenu] = useState([]);
	const { roleName, staffId } = getStaffInfo();

	// Fetch all menu items from the backend (for mapping path to menu_item_id)
	const {
		data: menuItemsData,
		isLoading: isLoadingMenuItems,
		isError: isErrorMenuItems,
		error: menuItemsError,
	} = useGetMenuItemsQuery();

	// Fetch default permissions for the staff's role
	const {
		data: roleMenuAccessData,
		isLoading: isLoadingRoleAccess,
		isError: isErrorRoleAccess,
		error: roleAccessError,
	} = useGetRoleBasedMenuQuery({ roleName });

	// Fetch specific permissions for the staff member
	const {
		data: staffMenuAccessData,
		isLoading: isLoadingStaffAccess,
		isError: isErrorStaffAccess,
		error: staffAccessError,
	} = useGetStaffAccessMenuQuery({ staffId });

	// Combine all loading and error states for a single return value
	const isSidebarLoading =
		isLoadingMenuItems || isLoadingRoleAccess || isLoadingStaffAccess;
	const isSidebarLoadingError = isErrorMenuItems || isErrorRoleAccess || isErrorStaffAccess;
	const error = menuItemsError || roleAccessError || staffAccessError;
	useEffect(() => {
		// Only run this logic when all necessary data has been successfully fetched
		if (menuItemsData && roleMenuAccessData && staffMenuAccessData) {
			// Create a path-to-menuItemId map from the backend menu items for quick lookup
			const pathIdMap = menuItemsData.reduce((map, item) => {
				map[item.path] = item.menuItemId;
				return map;
			}, {});

			// Create maps for quick lookups of permissions
			const roleAccessMap = roleMenuAccessData.reduce((map, item) => {
				map[item.menuItemId] = item.status;
				return map;
			}, {});

			const staffAccessMap = staffMenuAccessData.reduce((map, item) => {
				map[item.menuItemId] = item.status;
				return map;
			}, {});

			// Function to recursively build the filtered menu
			const buildMenu = (items) => {
				return items.reduce((acc, item) => {
					let isAllowed = false;

					if (item.path) {
						// Logic for single menu items with a path
						const itemId = pathIdMap[item.path];
						if (itemId) {
							const isRoleAllowed =
								roleAccessMap[itemId] === "ALLOWED";
							const staffOverride = staffAccessMap[itemId];
							isAllowed = staffOverride
								? staffOverride === "ALLOWED"
								: isRoleAllowed;
						}
					} else if (item.children) {
						// Logic for parent menu items (dropdowns)
						const filteredChildren = buildMenu(item.children);
						if (filteredChildren.length > 0) {
							// A parent is allowed if any of its children are allowed
							acc.push({ ...item, children: filteredChildren });
						}
						return acc;
					}

					if (isAllowed) {
						acc.push(item);
					}

					return acc;
				}, []);
			};

			const finalMenu = buildMenu(menuStructure);
			setFilteredMenu(finalMenu);
		}
	}, [menuItemsData, roleMenuAccessData, staffMenuAccessData]);

	return { filteredMenu, isSidebarLoading, isSidebarLoadingError, error};
};

export default useFilteredMenu;
