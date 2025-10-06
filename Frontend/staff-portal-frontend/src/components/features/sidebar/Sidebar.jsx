import { useState } from "react";
import { menuStructure } from "../../../utils";
import { dummyAccessibleMenus } from "../../../utils";
import { dummyUserRole } from "../../../utils";
import { SidebarFooter, SidebarHeader, SidebarMenu } from "../sidebar";
import { useLocation } from "react-router";
import useFilteredMenu from "../../../hooks/apiHooks/useFilteredMenu";

const Sidebar = ({ className = "", isCollapsed, onCollapsed, ...props }) => {
	// const [isCollapsed, setIsCollapsed] = useState(false);
	const { filteredMenu: menuItems = [] } = useFilteredMenu();
	const location = useLocation();
	const userRole = dummyUserRole;
	const accessibleMenus = dummyAccessibleMenus;
	const [expandedGroups, setExpandedGroups] = useState(
		new Set(["dashboard"])
	);

	const handleCollapse = () => {
		if (!isCollapsed) {
			setExpandedGroups(() => new Set()); // close all groups
		}
		onCollapsed();
	};
	const toggleGroup = (groupKey) => {
		setExpandedGroups((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(groupKey)) {
				newSet.delete(groupKey);
			} else {
				newSet.add(groupKey);
			}
			return newSet;
		});
	};

	const getMenuStructure = () => {
		const hasAccessiblePath = (menu) => {
			if (
				accessibleMenus.some(
					(accessibleMenu) => accessibleMenu.path === menu.path
				)
			) {
				return true;
			}
			if (menu.children && menu.children.length > 0) {
				return menu.children.some((child) => hasAccessiblePath(child));
			}
			return false;
		};

		const filterChildren = (children) => {
			if (!children) return [];
			return children
				.filter((child) => hasAccessiblePath(child))
				.map((child) => ({
					...child,
					children: filterChildren(child.children),
				}));
		};

		return menuStructure
			.filter((menu) => hasAccessiblePath(menu))
			.map((menu) => ({
				...menu,
				children: filterChildren(menu.children),
			}));
	};
	const filteredMenu = getMenuStructure();
	// const baseClasses = [
	// 	"fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out",
	// 	"bg-gray-200 dark:bg-neutral-800/60 shadow-xl md:translate-x-0 z-40",
	// 	isMobile && !isOpen ? "-translate-x-full" : "translate-x-0 ",
	// 	"flex flex-col h-screen transition-all ease-in-out duration-300 ",
	// 	isCollapsed ? "w-16 items-center " : "w-80",
	// 	className,
	// ]
	// 	.filter(Boolean)
	// 	.join(" ");
	const baseClasses = [
		"fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out",
		"bg-neutral-100 dark:bg-neutral-800/60 shadow-xl", // Removed z-40 and md:translate-x-0
		// REMOVED: isMobile && !isOpen ? "-translate-x-full" : "translate-x-0 ",
		"flex flex-col h-screen transition-all ease-in-out duration-300 ",
		isCollapsed ? "w-16 items-center " : "w-80",
		className,
		// className will be applied here, containing the z-index and mobile translation logic
	]
		.filter(Boolean)
		.join(" ");
	return (
		<>
			<aside className={` ${baseClasses}`} {...props}>
				<SidebarHeader
					onCollapse={handleCollapse}
					isCollapsed={isCollapsed}
				/>
				<nav
					className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8 `}
					//${isCollapsed	? "scrollbar-none": "scrollbar-none scrollbar-thumb-rounded scrollbar-track-rounded-full scrollbar-thumb-neutral-500 scrollbar-track-gray-800"}
				>
					<div className='h-full '>
						<SidebarMenu
							items={menuItems || filteredMenu}
							currentPath={location.pathname}
							isCollapsed={isCollapsed}
							expandedGroups={expandedGroups}
							onToggleGroup={toggleGroup}
							level={1}
						/>
					</div>
				</nav>
				{/* User role indicator */}
				<SidebarFooter isCollapsed={isCollapsed} userRole={userRole} />
			</aside>
		</>
	);
};

export default Sidebar;
