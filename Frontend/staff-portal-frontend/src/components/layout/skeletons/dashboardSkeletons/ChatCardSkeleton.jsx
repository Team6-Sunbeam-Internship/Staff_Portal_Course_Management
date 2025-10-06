import { Skeleton } from "../dashboardSkeletons";

export const ChartCardSkeleton = () => (
	<div className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-md col-span-1 lg:col-span-2 w-full'>
		<Skeleton className='h-6 w-1/3 mb-4' />
		<Skeleton className='h-64 w-full' />
	</div>
);
