import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
	Home,
	BookOpen,
	Users,
	Calendar,
	Settings,
	FileText,
	Building,
	GraduationCap,
	CalendarDays,
	CogIcon,
	ChevronRight,
	ChevronDown,
	ChartBar,
	HousePlus,
} from "lucide-react";

export const SidebarDropdown = ({
	item,
	currentPath,
	isCollapsed,
	isExpanded,
	onToggle,
	className = "",
	level = 0,
	...props
}) => {
	const [hasActiveChild, setHasActiveChild] = useState(false);
	const [internalExpandedState, setInternalExpandedState] = useState(
		new Set()
	);
	useEffect(() => {
		const checkActiveChild = (children, path) => {
			return children?.some((child) => {
				const isDirectMatch =
					path === child.path || path.startsWith(`${child.path}/`);
				if (isDirectMatch) return true;
				if (child.children) {
					return checkActiveChild(child.children, path);
				}
				return false;
			});
		};

		const activeChild = checkActiveChild(item.children, currentPath);
		setHasActiveChild(activeChild);
	}, [currentPath, item.children]);

	const getIcon = (iconName) => {
		const iconProps = { className: "w-5 h-5" };

		const icons = {
			home: <Home {...iconProps} />,
			"academic-cap": <GraduationCap {...iconProps} />,
			"book-open": <BookOpen {...iconProps} />,
			users: <Users {...iconProps} />,
			"building-office": <HousePlus {...iconProps} />,
			calendar: <Calendar {...iconProps} />,
			"calendar-days": <CalendarDays {...iconProps} />,
			"cog-6-tooth": <CogIcon {...iconProps} />,
			"document-chart-bar": <ChartBar {...iconProps} />,
			"file-text": <FileText {...iconProps} />,
			settings: <Settings {...iconProps} />,
		};

		return icons[iconName] || <FileText {...iconProps} />;
	};

	const handleToggle = (e) => {
		e.preventDefault();
		onToggle();
	};

	const handleNestedToggle = (nestedKey) => {
		setInternalExpandedState((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(nestedKey)) {
				newSet.delete(nestedKey);
			} else {
				newSet.add(nestedKey);
			}
			return newSet;
		});
	};

	const leftMargin = level > 0 ? { marginLeft: `${level * 16}px` } : {};

	const headerClasses = [
		`flex items-center w-[90%] px-3 py-4  dark:hover:bg-gray-700  rounded-md transition-colors cursor-pointer`,
		hasActiveChild
			? "bg-slate-300/50 text-gray-900 hover:bg-slate-500/20 dark:bg-gray-500/20 dark:text-gray-300"
			: "text-gray-600 dark:text-gray-200 hover:bg-gray-500/20 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-gray-100",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const renderChildren = (children, childLevel) => {
		return children.map((child) => {
			const hasChildren = child.children?.length > 0;
			const childLeftMargin = {
				marginLeft: `${(childLevel + 1) * 28}px`,
			};

			if (hasChildren) {
				const nestedKey = `${item.key}-${child.key}`;
				const isNestedExpanded = internalExpandedState.has(nestedKey);

				return (
					<div key={child.key}>
						<SidebarDropdown
							item={child}
							currentPath={currentPath}
							isCollapsed={isCollapsed}
							isExpanded={isNestedExpanded}
							onToggle={() => handleNestedToggle(nestedKey)}
							// expandedGroups={internalExpandedState}
							// onToggleGroup={handleNestedToggle}
							level={childLevel + 1}
						/>
					</div>
				);
			}

			const isActive =
				currentPath === child.path ||
				currentPath.startsWith(`${child.path}/`);
			const childClasses = [
				"flex items-center w-[70%] px-3 py-4 rounded-md transition-colors",
				isActive
					? "bg-slate-300/50 text-gray-900 hover:bg-slate-500/20 dark:bg-violet-500/20 dark:text-gray-50"
					: "text-gray-600 dark:text-gray-300 hover:bg-gray-500/20 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
			].join(" ");

			return (
				<div key={child.key}>
					<Link
						to={child.path || "#"}
						className={childClasses}
						style={childLeftMargin}
					>
						<span className='truncate'>
							{child.label}
						</span>
					</Link>
				</div>
			);
		});
	};

	if (isCollapsed) {
		// Show tooltip with children on hover for collapsed state
		return (
			<div {...props}>
				<div
					className={`${headerClasses} group `} // Apply group here
				>
					<span className='flex-shrink-0 transition-all ease-in-out duration-300'>
						{getIcon(item.icon)}
					</span>

					{/* Tooltip with children */}
					<div className='absolute left-full top-auto ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all ease-in-out duration-200 z-[9999]'>
						<div className=' dark:bg-gray-800  border-gray-200 dark:border-gray-700 rounded-lg shadow-lg  min-w-48'>
							<div className='bg-blue-800 rounded-t-md px-3 py-2  text-gray-50 dark:text-gray-100  border-gray-200 dark:border-gray-700'>
								{item.label}
							</div>
							<div className='bg-blue-300 rounded-b-md'>
								{item.children?.map((child) => {
									const isChildActive =
										currentPath === child.path ||
										currentPath.startsWith(
											`${child.path}/`
										);
									return (
										<Link
											key={child.key}
											to={child.path}
											className={`block px-3 py-2 transition-colors dark:hover:rounded-b-md ${
												isChildActive
													? " text-blue-700 dark:bg-blue-800 dark:rounded-b-md dark:text-gray-50"
													: "text-gray-700 dark:text-gray-800 hover:bg-gray-100 dark:hover:bg-blue-500"
											}`}
										>
											{child.label}
										</Link>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div
			className={`
                ${className}
                ${
					isExpanded
						? "py-4 bg-gradient-to-tl from-teal-300/20 to-black/5  dark:bg-gradient-to-r dark:from-violet-400/30 dark:to-black/20 rounded-lg transition-transform ease-in-out duration-500"
						: ""
				}
            `}
		>
			{/* Dropdown header */}
			<div
				className={headerClasses}
				onClick={handleToggle}
				style={leftMargin}
			>
				<span className='flex-shrink-0'>{getIcon(item.icon)}</span>
				<span className='ml-3 flex-1 truncate'>
					{item.label}
				</span>
				<span className='flex-shrink-0 ml-2'>
					{isExpanded ? (
						<ChevronDown className='w-4 h-4' />
					) : (
						<ChevronRight className='w-4 h-4' />
					)}
				</span>
			</div>

			{/* Dropdown children */}
			{isExpanded && (
				<div className='mt-1 space-y-2 py-4'>
					{renderChildren(item.children, level)}
				</div>
			)}
		</div>
	);
};
