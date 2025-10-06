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
	ChartBar,
} from "lucide-react";

export const SidebarMenuItem = ({
	item,
	currentPath,
	isCollapsed,
	className = "",
	level = 0,
	...props
}) => {
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

	const isDashboard = item.path === "/dashboard";
	const isActive = isDashboard
		? currentPath === "/" ||
		  currentPath === item.path ||
		  currentPath.startsWith(`${item.path}/`)
		: currentPath.startsWith(item.path);

	const leftMargin = level > 0 ? { marginLeft: `${level * 16}px` } : {};

	const baseClasses = [
		`flex items-center w-[90%] px-3 py-4 rounded-md transition-colors`,
		isActive
			? "bg-slate-300/50 text-gray-900 hover:bg-slate-500/20 dark:bg-neutral-700/50 dark:text-gray-100"
			: "text-gray-600 dark:text-gray-200 hover:bg-gray-500/20 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-black",
		className,
	]
		.filter(Boolean)
		.join(" ");

	if (isCollapsed) {
		return (
			<div className=' group' {...props}>
				<Link to={item.path} className={baseClasses}>
					<span className='flex-shrink-0 transition-all ease-in-out duration-300'>
						{getIcon(item.icon)}
					</span>
				</Link>
				{/* Custom tooltip for collapsed state */}
				<div className='absolute left-full -mt-10 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[1000]'>
					<div className='bg-blue-800 dark:bg-gray-800  border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-2 px-3 min-w-48'>
						<span className='text-sm font-medium text-gray-50 dark:text-gray-100'>
							{item.label}
						</span>
					</div>
				</div>
			</div>
		);
	}

	return (
		<Link
			to={item.path}
			className={baseClasses}
			{...props}
			style={leftMargin}
		>
			<span className='flex-shrink-0'>{getIcon(item.icon)}</span>
			<span className='ml-3 truncate font-extrabold text-lg'>
				{item.label}
			</span>
		</Link>
	);
};
