import { Skeleton } from "../dashboardSkeletons";

export const StatCardSkeleton = () => (
	<div className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-md w-full'>
		<div className='flex items-center justify-between'>
			<div className='flex-1'>
				<Skeleton className='h-4 w-3/4 mb-2' />
				<Skeleton className='h-8 w-1/2' />
			</div>
			<Skeleton className='w-12 h-12 rounded-full' />
		</div>
		<div className='mt-4 flex items-center'>
			<Skeleton className='h-4 w-1/4 mr-2' />
			<Skeleton className='h-4 w-1/3' />
		</div>
	</div>
);
