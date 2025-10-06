import {
	BookOpen,
	Building,
	Calendar,
	CalendarDays,
	ChartBar,
	CogIcon,
	FileText,
	GraduationCap,
	Home,
	HousePlugIcon,
	HousePlus,
	Landmark,
	RefreshCcwDot,
	Settings,
	Users,
} from "lucide-react";

export const getIcon = (iconName) => {
	const iconProps = { className: "w-4 h-4" };

	const icons = {
		home: <Home {...iconProps} />,
		"house-plus": <HousePlus {...iconProps} />,
		"house-plug": <HousePlugIcon {...iconProps} />,
		"academic-cap": <GraduationCap {...iconProps} />,
		"book-open": <BookOpen {...iconProps} />,
		users: <Users {...iconProps} />,
		"building-office": <Building {...iconProps} />,
		calendar: <Calendar {...iconProps} />,
		"calendar-days": <CalendarDays {...iconProps} />,
		"cog-6-tooth": <CogIcon {...iconProps} />,
		"document-chart-bar": <ChartBar {...iconProps} />,
		"file-text": <FileText {...iconProps} />,
		landmark: <Landmark {...iconProps} />,
		"refresh-ccw-dot": <RefreshCcwDot {...iconProps} />,
		settings: <Settings {...iconProps} />,
	};
	return icons[iconName] || <FileText {...iconProps} />;
};
