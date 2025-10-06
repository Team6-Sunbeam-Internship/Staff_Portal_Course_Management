import { Line, Bar } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import {
	Users,
	BookOpen,
	ClipboardCheck,
	Calendar,
	FileText,
	Bell,
	User,
	ChevronDown,
} from "lucide-react";

// Register Chart.js components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	Title,
	Tooltip,
	Legend
);

// --- Dummy Data ---
import {
	DUMMY_UPCOMING_EVENTS,
	DUMMY_ANNOUNCEMENTS,
	DUMMY_BAR_CHART_DATA,
	DUMMY_LINE_CHART_DATA,
	DUMMY_OVERVIEW_STATS,
	DUMMY_RECENT_ACTIVITIES,
} from "../../../utils";
import { StatCard } from "./StatCard";
import { ChartCard } from "./ChatCard";
import { ActivityCard } from "./ActivityCard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetBreadcrumbs, setHeaderInfo } from "../../../store";
const getEventColor = (type) => {
	switch (type) {
		case "enrollment":
			return "bg-blue-100 text-blue-800";
		case "course_update":
			return "bg-green-100 text-green-800";
		case "session_completed":
			return "bg-purple-100 text-purple-800";
		case "task_assigned":
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

const getAnnouncementColor = (type) => {
	switch (type) {
		case "maintenance":
			return "bg-red-100 text-red-800";
		case "holiday":
			return "bg-green-100 text-green-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

const ListItem = ({ children }) => (
	<div className='flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer'>
		{children}
	</div>
);

const Dashboard = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(
			setHeaderInfo({
				title: "Dashboard",
				subtitle: "A quick overview of your account and activities.",
			})
		);
		dispatch(resetBreadcrumbs());
	}, [dispatch]);
	return (
		<div className='flex flex-col h-screen bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-gray-100'>
			<main className=' flex-1'>
				<>
					<section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{DUMMY_OVERVIEW_STATS.map((stat) => (
							<StatCard key={stat.id} {...stat} />
						))}
					</section>

					<section className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
						<ChartCard title='Student Enrollments Over Time'>
							<Line data={DUMMY_LINE_CHART_DATA} />
						</ChartCard>
						<ChartCard title='Modules Completed by Course'>
							<Bar data={DUMMY_BAR_CHART_DATA} />
						</ChartCard>
					</section>

					<section className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
						<ActivityCard title='Recent Activity'>
							{DUMMY_RECENT_ACTIVITIES.map((activity) => (
								<ListItem key={activity.id}>
									<div
										className={`flex items-center justify-center w-8 h-8 rounded-full ${getEventColor(
											activity.type
										)}`}
									>
										<FileText className='w-4 h-4' />
									</div>
									<div className='ml-3 flex-1'>
										<p className='text-sm font-medium'>
											{activity.text}
										</p>
										<span className='text-xs text-gray-500 dark:text-gray-400'>
											{activity.timestamp}
										</span>
									</div>
								</ListItem>
							))}
						</ActivityCard>

						<ActivityCard title='Upcoming Events'>
							{DUMMY_UPCOMING_EVENTS.map((event) => (
								<ListItem key={event.id}>
									<div className='flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600'>
										<Calendar className='w-4 h-4' />
									</div>
									<div className='ml-3 flex-1'>
										<p className='text-sm font-medium'>
											{event.title}
										</p>
										<span className='text-xs text-gray-500 dark:text-gray-400'>
											{event.date} at {event.time}
										</span>
									</div>
								</ListItem>
							))}
						</ActivityCard>

						<ActivityCard title='Announcements'>
							{DUMMY_ANNOUNCEMENTS.map((announcement) => (
								<ListItem key={announcement.id}>
									<div
										className={`flex items-center justify-center w-8 h-8 rounded-full ${getAnnouncementColor(
											announcement.type
										)}`}
									>
										<Bell className='w-4 h-4' />
									</div>
									<div className='ml-3 flex-1'>
										<p className='text-sm font-medium'>
											{announcement.title}
										</p>
										<span className='text-xs text-gray-500 dark:text-gray-400'>
											{announcement.content}
										</span>
									</div>
								</ListItem>
							))}
						</ActivityCard>
					</section>
				</>
			</main>
		</div>
	);
};

export default Dashboard;
