import { Link, useLocation } from "react-router";
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
	ChartBar,
} from "lucide-react";

export const SidebarMenuItem = ({
	item,
	currentPath,
	isCollapsed,
	className = "",
	...props
}) => {
	const location = useLocation();

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

	const isActive =
		currentPath === item.path || currentPath.startsWith(`${item.path}/`);

	const baseClasses = [
		"flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
		isActive
			? "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300"
			: "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 hover:text-secondary-900 dark:hover:text-secondary-100",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Link
			to={item.path}
			className={baseClasses}
			title={isCollapsed ? item.label : undefined}
			{...props}
		>
			<span className='flex-shrink-0'>{getIcon(item.icon)}</span>
			{!isCollapsed && (
				<span className='ml-3 truncate'>{item.label}</span>
			)}
		</Link>
	);
};
