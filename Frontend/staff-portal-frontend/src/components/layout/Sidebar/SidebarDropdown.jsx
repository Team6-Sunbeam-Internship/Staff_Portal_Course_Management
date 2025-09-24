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
} from "lucide-react";

export const SidebarDropdown = ({
	item,
	currentPath,
	isCollapsed,
	isExpanded,
	onToggle,
	className = "",
	...props
}) => {
	const [hasActiveChild, setHasActiveChild] = useState(false);

	useEffect(() => {
		const activeChild = item.children?.some(
			(child) =>
				currentPath === child.path ||
				currentPath.startsWith(`${child.path}/`)
		);
		setHasActiveChild(activeChild);

		// Auto-expand if has active child
		if (activeChild && !isExpanded && !isCollapsed) {
			onToggle();
		}
	}, [currentPath, item.children, isExpanded, isCollapsed, onToggle]);

	const getIcon = (iconName) => {
		const iconProps = { className: "w-5 h-5" };

		const icons = {
			home: <Home {...iconProps} />,
			"academic-cap": <GraduationCap {...iconProps} />,
			"book-open": <BookOpen {...iconProps} />,
			users: <Users {...iconProps} />,
			"building-office": <Building {...iconProps} />,
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
		if (!isCollapsed) {
			onToggle();
		}
	};

	const headerClasses = [
		"flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer",
		hasActiveChild
			? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
			: "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const childClasses = [
		"flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ml-6",
		"text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100",
	].join(" ");

	const activeChildClasses = [
		"flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ml-6",
		"bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300",
	].join(" ");

	if (isCollapsed) {
		// Show tooltip with children on hover for collapsed state
		return (
			<div className='relative group' {...props}>
				<div className={headerClasses} title={item.label}>
					<span className='flex-shrink-0'>{getIcon(item.icon)}</span>
				</div>

				{/* Tooltip with children */}
				<div className='absolute left-full top-0 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50'>
					<div className='bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-lg py-2 min-w-48'>
						<div className='px-3 py-2 text-sm font-medium text-secondary-900 dark:text-secondary-100 border-b border-secondary-200 dark:border-secondary-700'>
							{item.label}
						</div>
						{item.children?.map((child) => {
							const isChildActive =
								currentPath === child.path ||
								currentPath.startsWith(`${child.path}/`);
							return (
								<Link
									key={child.key}
									to={child.path}
									className={`block px-3 py-2 text-sm transition-colors ${
										isChildActive
											? "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300"
											: "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700"
									}`}
								>
									{child.label}
								</Link>
							);
						})}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div {...props}>
			{/* Dropdown header */}
			<div className={headerClasses} onClick={handleToggle}>
				<span className='flex-shrink-0'>{getIcon(item.icon)}</span>
				<span className='ml-3 flex-1 truncate'>{item.label}</span>
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
				<div className='mt-1 space-y-1'>
					{item.children?.map((child) => {
						const isChildActive =
							currentPath === child.path ||
							currentPath.startsWith(`${child.path}/`);

						return (
							<Link
								key={child.key}
								to={child.path}
								className={
									isChildActive
										? activeChildClasses
										: childClasses
								}
							>
								<span className='truncate'>{child.label}</span>
							</Link>
						);
					})}
				</div>
			)}
		</div>
	);
};
