import { useMemo } from "react";
import { selectIsAuthenticated, useGetSidebarMenuItemsQuery } from "../../store";
import { ErrorFallback } from "../../components/layout/errorBoundary";
import { useSelector } from "react-redux";
/**
 * Custom hook to fetch menu permissions and build the filtered navigation menu.
 * @returns {{
 * filteredMenu: Array,
 * isLoading: boolean,
 * isError: boolean
 * }}
 */
export const useFilteredMenu = () => {
	const isAuthenticated = useSelector(selectIsAuthenticated);
	// Fetch all menu items from the backend (for mapping path to menu_item_id)
	const {
		data: menuItemsData,
		isLoading: isSidebarLoading,
		isError: isSidebarLoadingError,
		error: sidebarMenuItemsError,
		refetch: refetchSidebarMenuItems,
	} = useGetSidebarMenuItemsQuery(undefined, {
		skip: !isAuthenticated,
	});

	const filteredMenu = useMemo(() => menuItemsData || [], [menuItemsData]);
	const pathSet = useMemo(() => {
		const set = new Set();
		const traverse = (items) => {
			items.forEach((item) => {
				set.add(item.path);
				if (item.children) {
					traverse(item.children);
				}
			});
		};
		traverse(filteredMenu);
		return set;
	}, [filteredMenu]);

	return useMemo(
		() => ({ filteredMenu, pathSet, isSidebarLoading, isSidebarLoadingError, sidebarMenuItemsError, refetchSidebarMenuItems }),
		[filteredMenu, pathSet, isSidebarLoading, isSidebarLoadingError, sidebarMenuItemsError, refetchSidebarMenuItems]
	);
};

export default useFilteredMenu;
