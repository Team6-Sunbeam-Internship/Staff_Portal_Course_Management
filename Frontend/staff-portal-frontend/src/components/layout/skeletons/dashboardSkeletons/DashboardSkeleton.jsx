import { StatCardSkeleton } from "./StatCardSkeleton";
import { ChartCardSkeleton } from "./ChatCardSkeleton";
import { ActivityItemSkeleton } from "./ActivityItemSkeleton";
import { ActivityCard } from "../../../features/dashboard";

export const DashboardSkeleton = () => {
	return (
		<>
			<section className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{[...Array(4)].map((_, i) => (
					<StatCardSkeleton key={i} />
				))}
			</section>

			<section className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
				<ChartCardSkeleton />
				<ChartCardSkeleton />
			</section>

			<section className='grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6'>
				<ActivityCard title='Recent Activity'>
					{[...Array(4)].map((_, i) => (
						<ActivityItemSkeleton key={i} />
					))}
				</ActivityCard>
				<ActivityCard title='Upcoming Events'>
					{[...Array(2)].map((_, i) => (
						<ActivityItemSkeleton key={i} />
					))}
				</ActivityCard>
				<ActivityCard title='Announcements'>
					{[...Array(2)].map((_, i) => (
						<ActivityItemSkeleton key={i} />
					))}
				</ActivityCard>
			</section>
		</>
	);
};
