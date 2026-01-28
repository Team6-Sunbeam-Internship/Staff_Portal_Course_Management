import { Skeleton } from "../dashboardSkeletons";

export const StatCardSkeleton = () => (
	<div className='w-full rounded-lg bg-white p-6 shadow-md dark:bg-zinc-800'>
		<div className='flex items-center justify-between'>
			<div className='flex-1'>
				<Skeleton className='mb-2 h-4 w-3/4' />
				<Skeleton className='h-8 w-1/2' />
			</div>
			<Skeleton className='h-12 w-12 rounded-full' />
		</div>
		<div className='mt-4 flex items-center'>
			<Skeleton className='mr-2 h-4 w-1/4' />
			<Skeleton className='h-4 w-1/3' />
		</div>
	</div>
);
