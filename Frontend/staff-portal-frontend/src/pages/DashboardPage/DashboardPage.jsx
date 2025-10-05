import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/selectors/authSelectors";
import { setBreadcrumbs } from "../../store";
import {
	DashboardStats,
	QuickActions,
	RecentActivity,
	Grid,
	GridItem,
} from "../../components";

const DashboardPage = () => {
	const dispatch = useDispatch();
	const user = useSelector(selectCurrentUser);

	useEffect(() => {
		dispatch(
			setBreadcrumbs([
				{ title: "Dashboard", path: "/dashboard", icon: "home" },
			])
		);
	}, [dispatch]);

	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-2xl font-bold text-secondary-900 dark:text-secondary-100'>
					Welcome back, {user?.firstName || user?.name || "User"}
				</h1>
				<p className='text-secondary-600 dark:text-secondary-400 mt-1'>
					Here's what's happening in your staff portal today
				</p>
			</div>

			<DashboardStats />

			<Grid columns={{ base: 1, lg: 2 }} gap='lg'>
				<GridItem>
					<QuickActions />
				</GridItem>
				<GridItem>
					<RecentActivity />
				</GridItem>
			</Grid>
		</div>
	);
};

export default DashboardPage;
