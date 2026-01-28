// import { useState } from "react";
// import { SidebarFooter, SidebarHeader, SidebarMenu } from "../sidebar";
// import { useLocation } from "react-router";
// import useFilteredMenu from "../../../hooks/apiHooks/useFilteredMenu";
// import { useSelector } from "react-redux";
// import { selectUserRole } from "../../../store";

// const Sidebar = ({ className = "", isCollapsed, onCollapsed, ...props }) => {
// 	// const [isCollapsed, setIsCollapsed] = useState(false);
// 	const { filteredMenu: menuItems = [] } = useFilteredMenu();
// 	const location = useLocation();
// 	const userRole = useSelector(selectUserRole);
// 	// const accessibleMenus = dummyAccessibleMenus;
// 	const [expandedGroups, setExpandedGroups] = useState(new Set(["dashboard"]));

// 	const handleCollapse = () => {
// 		if (!isCollapsed) {
// 			setExpandedGroups(() => new Set()); // close all groups
// 		}
// 		onCollapsed();
// 	};
// 	const toggleGroup = (groupKey) => {
// 		setExpandedGroups((prev) => {
// 			const newSet = new Set(prev);
// 			if (newSet.has(groupKey)) {
// 				newSet.delete(groupKey);
// 			} else {
// 				newSet.add(groupKey);
// 			}
// 			return newSet;
// 		});
// 	};

// 	const filteredMenu = useFilteredMenu();

// 	const baseClasses = [
// 		"fixed inset-y-0 left-0 transform transition-all duration-300 ease-in-out",
// 		"bg-neutral-100 dark:bg-neutral-800/60 shadow-xl", // Removed z-40 and md:translate-x-0
// 		// REMOVED: isMobile && !isOpen ? "-translate-x-full" : "translate-x-0 ",
// 		"flex flex-col h-screen transition-all ease-in-out duration-300 ",
// 		isCollapsed ? "w-16 items-center " : "w-80",
// 		className,
// 		// className will be applied here, containing the z-index and mobile translation logic
// 	]
// 		.filter(Boolean)
// 		.join(" ");
// 	return (
// 		<>
// 			<aside className={` ${baseClasses}`} {...props}>
// 				<SidebarHeader onCollapse={handleCollapse} isCollapsed={isCollapsed} />
// 				<nav
// 					className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-none pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8 `}
// 					//${isCollapsed	? "scrollbar-none": "scrollbar-none scrollbar-thumb-rounded scrollbar-track-rounded-full scrollbar-thumb-neutral-500 scrollbar-track-gray-800"}
// 				>
// 					<div className='h-full '>
// 						<SidebarMenu
// 							items={menuItems || filteredMenu}
// 							currentPath={location.pathname}
// 							isCollapsed={isCollapsed}
// 							expandedGroups={expandedGroups}
// 							onToggleGroup={toggleGroup}
// 							level={1}
// 						/>
// 					</div>
// 				</nav>
// 				{/* User role indicator */}
// 				<SidebarFooter isCollapsed={isCollapsed} userRole={userRole} />
// 			</aside>
// 		</>
// 	);
// };

// export default Sidebar;

import { motion, AnimatePresence } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import SidebarHeader from "./SidebarHeader";
import HorizonDivider from "./HorizonDivider";
import SidebarFooter from "./SidebarFooter";
import SidebarBody from "./SidebarBody";
import { useLocation } from "react-router";

const Sidebar = ({ loading, filteredMenu, isCollapsed, isMobileMenuOpen, isMobile, onToggleSidebar, onCloseMobileMenu }) => {
	const [activePath, setActivePath] = useState([]);
	const [activeId, setActiveId] = useState("");
	const location = useLocation();
	// if (loading) {
	// 	return <SidebarSkeleton isCollapsed={isCollapsed} isDark={isDark} />;
	// }

	const handleSetActivePath = useCallback((path) => {
		setActivePath(path);
	}, []);

	const handleSetActiveId = useCallback((id) => {
		setActiveId(id);
	}, []);

	useEffect(() => {
		const pathSegments = location.pathname.split("/").filter(Boolean);

		// If we are at root, set to dashboard defaults
		if (pathSegments.length === 0) {
			setActiveId("dashboard");
			setActivePath(["dashboard"]);
			return;
		}

		// set activeId to the full path
		setActiveId(location.pathname);

		// Build activePath (parents) based on URL segments
		setActivePath(pathSegments);
	}, [location.pathname]);

	const getSidebarAnimation = useMemo(() => {
		if (isMobile) {
			// Mobile: Sidebar is always full width (280px) when open
			return {
				width: 300,
				x: isMobileMenuOpen ? 0 : -300, // Slide in/out completely
			};
		} else {
			// Desktop: Toggle between collapsed (88px) and expanded (280px)
			return {
				width: isCollapsed ? 88 : 300,
				x: 0, // Always visible on desktop
			};
		}
	}, [isMobile, isMobileMenuOpen, isCollapsed]);
	return (
		<>
			<AnimatePresence>
				{isMobileMenuOpen && isMobile && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						onClick={onCloseMobileMenu}
						className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden'
					/>
				)}
			</AnimatePresence>
			<motion.aside
				initial={false}
				animate={getSidebarAnimation}
				transition={{ type: "spring", stiffness: 300, damping: 32 }}
				className={`fixed z-50 flex h-full border-collapse flex-col bg-white px-3 shadow-lg shadow-emerald-300 transition-colors duration-300 lg:relative dark:bg-black dark:shadow-amber-400`}
				role='navigation'
				aria-label='Main Sidebar'>
				<motion.div
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
					className='flex h-full w-full flex-col'>
					{/* Sidebar Header */}
					<SidebarHeader isCollapsed={isMobile ? false : isCollapsed} toggleSidebar={onToggleSidebar} />
					<div className='px-0.5'>
						<HorizonDivider />
					</div>
					<div className='relative scrollbar-none flex-1 overflow-y-auto py-2'>
						<nav className='space-y-1' role='menubar'>
							{filteredMenu?.map((item) => (
								<SidebarBody
									key={item?.key}
									item={item}
									depth={0}
									activePath={activePath}
									setActivePath={handleSetActivePath}
									isCollapsed={isMobile ? false : isCollapsed}
									activeId={activeId}
									setActiveId={handleSetActiveId}
								/>
							))}
						</nav>
					</div>
					<div className='px-0.5'>
						<HorizonDivider />
					</div>
					<SidebarFooter isCollapsed={isMobile ? false : isCollapsed} />
				</motion.div>
			</motion.aside>
		</>
	);
};

export default Sidebar;
