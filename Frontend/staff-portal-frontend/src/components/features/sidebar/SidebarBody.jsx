// import { SidebarMenuItem, SidebarDropdown } from "../sidebar";

// export const SidebarMenu = ({
// 	items = [],
// 	currentPath,
// 	isCollapsed,
// 	expandedGroups,
// 	onToggleGroup,
// 	className = "",
// 	level,
// 	...props
// }) => {
// 	return (
// 		<div className={`space-y-1 px-3 ${className}`} {...props}>
// 			{items.map((item) => {
// 				if (item?.single) {
// 					return (
// 						<SidebarMenuItem
// 							key={item?.key}
// 							item={item}
// 							currentPath={currentPath}
// 							isCollapsed={isCollapsed}
// 							level={level}
// 						/>
// 					);
// 				}

// 				return (
// 					<SidebarDropdown
// 						key={item?.key}
// 						item={item}
// 						currentPath={currentPath}
// 						isCollapsed={isCollapsed}
// 						isExpanded={expandedGroups.has(item?.key)}
// 						onToggle={() => onToggleGroup(item?.key)}
// 						expandedGroups={expandedGroups}
// 						onToggleGroup={onToggleGroup}
// 						level={level}
// 					/>
// 				);
// 			})}
// 		</div>
// 	);
// };

import { ChevronDown, Circle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Tooltip from "./Tooltip";
import * as Icons from "lucide-react";
import { memo, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

const getIcon = (icon) => {
	const IconComponent = Icons[icon] || Circle;
	return IconComponent;
};

const MenuItemLink = ({ to, onClick, className, children, isActive }) => {
	return (
		<Link
			to={to}
			onClick={onClick}
			className={className}
			aria-current={isActive ? "page" : undefined}
			style={{
				// Remove default link styles
				textDecoration: "none",
				color: "inherit",
			}}>
			{children}
		</Link>
	);
};

export const SidebarBody = memo(({ item, depth = 0, activePath, setActivePath, isCollapsed, activeId, setActiveId }) => {
	const [isHovered, setIsHovered] = useState(false);
	const hoverTimeoutRef = useRef(null);
	const containerRef = useRef(null);
	const location = useLocation();

	const hasChildren = item?.children && item?.children.length > 0;
	const isExpanded = activePath.includes(item?.key);
	const isActive = useMemo(() => {
		return item?.path === location.pathname || activeId === item?.key;
	}, [item?.path, location.pathname, activeId, item?.key]);

	const Icon = useMemo(() => getIcon(item?.icon), [item?.icon]);

	const handleMouseEnter = () => {
		if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		hoverTimeoutRef.current = setTimeout(() => {
			setIsHovered(false);
		}, 300);
	};

	const handleClick = (e) => {
		if (hasChildren) e.preventDefault();

		if (e) e.stopPropagation();

		setActiveId(item?.path);

		if (hasChildren) {
			if (isExpanded) {
				setActivePath(activePath.slice(0, depth));
			} else {
				setActivePath([...activePath.slice(0, depth), item?.key]);
			}
		}
	};

	const containerVariants = {
		open: {
			height: "auto",
			opacity: 1,
			transition: {
				height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
				staggerChildren: 0.08,
				delayChildren: 0.02,
			},
		},
		closed: {
			height: 0,
			opacity: 0,
			transition: {
				height: { duration: 0.3, ease: [0.4, 0, 1, 1] },
				staggerChildren: 0.08,
				staggerDirection: -1,
			},
		},
	};

	const childVariants = {
		open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
		closed: { opacity: 0, y: -4, transition: { duration: 0.2, ease: "easeIn" } },
	};
	const itemClasses = `group/btn relative flex h-11 w-full items-center rounded-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-amber-500 dark:focus-visible:ring-offset-black ${
		isActive ?
			"font-bold text-sky-600 dark:text-amber-400"
		:	"text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
	} `;

	const renderContent = () => (
		<>
			{isActive && (
				<motion.div
					layoutId='activeHighlight'
					className={`absolute inset-0 z-0 rounded-2xl border-b-2 border-l-2 border-b-sky-600 border-l-sky-600 bg-sky-50 shadow-[inset_0_0_12px_rgba(14,165,233,0.05)] dark:border-b-0 dark:border-l-2 dark:border-l-amber-400 dark:bg-amber-500/10 dark:shadow-[inset_0_0_12px_rgba(245,158,11,0.05)]`}
					transition={{ type: "spring", stiffness: 300, damping: 32 }}
				/>
			)}

			<div className='z-10 flex w-16 shrink-0 items-center justify-center'>
				<Icon
					size={18}
					strokeWidth={isActive ? 2.5 : 2}
					style={{ marginLeft: depth > 0 && !isCollapsed ? `${depth * 12}px` : "0px" }}
					className={`transition-all duration-300 ${
						isActive ? "text-sky-600 dark:text-amber-500" : "opacity-50 group-hover/btn:scale-110 group-hover/btn:opacity-100 dark:text-neutral-400"
					}`}
				/>
			</div>

			{!isCollapsed && (
				<motion.div
					initial={{ opacity: 0, x: -10 }}
					animate={{ opacity: 1, x: 0 }}
					className={`z-10 flex flex-1 items-center justify-between overflow-hidden pr-4 text-balance ${isActive ? " text-blue-800 transition-colors duration-300 ease-in text-shadow-2xs text-shadow-teal-400 dark:text-amber-500" : "dark:text-neutral-400 dark:hover:text-neutral-200"}`}>
					<span className='text-[14px] tracking-tight whitespace-nowrap'>
						{/* {item?.label.length > 15 ? item?.label.slice(0, 21) + "..." : item?.label} */} {item?.label}
					</span>
					{hasChildren && (
						<motion.div animate={{ rotate: isExpanded ? 180 : 0 }} className='opacity-30'>
							<ChevronDown size={14} />
						</motion.div>
					)}
				</motion.div>
			)}
		</>
	);
	return (
		<div
			ref={containerRef}
			className={`relative w-full ${depth === 0 ? "mb-1" : ""}`}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			{/* Conditional rendering: Link for leaf nodes with path, button for parent nodes */}
			{
				!hasChildren && item?.path ?
					// Leaf menu item with path - use Link
					<MenuItemLink to={item.path} onClick={handleClick} className={itemClasses} isActive={isActive}>
						{renderContent()}
					</MenuItemLink>
					// Parent menu item or item without path - use button
				:	<button onClick={handleClick} aria-expanded={hasChildren ? isExpanded : undefined} className={itemClasses}>
						{renderContent()}
					</button>

			}

			<AnimatePresence initial={false}>
				{hasChildren && isExpanded && !isCollapsed && (
					<motion.div variants={containerVariants} initial='closed' animate='open' exit='closed' className='overflow-hidden' role='group'>
						<div className={`my-1 ml-4 border-collapse rounded-2xl px-4 py-1 dark:bg-neutral-900/80`}>
							{item?.children.map((child) => (
								<motion.div key={child?.key} variants={childVariants} className='py-0.5'>
									<SidebarBody
										item={child}
										depth={depth + 1}
										activePath={activePath}
										setActivePath={setActivePath}
										isCollapsed={isCollapsed}
										activeId={activeId}
										setActiveId={setActiveId}
									/>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{isCollapsed && isHovered && (
					<Tooltip
						label={item?.label}
						children={item?.children}
						targetRef={containerRef}
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
						onSelectActiveId={setActiveId}
					/>
				)}
			</AnimatePresence>
		</div>
	);
});

export default SidebarBody;
