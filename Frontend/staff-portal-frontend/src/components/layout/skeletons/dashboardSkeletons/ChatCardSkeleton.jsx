import { Skeleton } from "../dashboardSkeletons";

export const ChartCardSkeleton = () => (
	<div className='col-span-1 w-full rounded-lg bg-white p-6 shadow-md lg:col-span-2 dark:bg-zinc-800'>
		<Skeleton className='mb-4 h-6 w-1/3' />
		<Skeleton className='h-64 w-full' />
	</div>
);
