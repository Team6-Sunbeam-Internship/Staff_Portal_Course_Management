import {Skeleton} from "../dashboardSkeletons";

export const ActivityItemSkeleton = () => (
	<div className='flex items-center p-3 rounded-lg w-full'>
		<Skeleton className='w-8 h-8 rounded-full flex-shrink-0' />
		<div className='ml-3 flex-1 space-y-2'>
			<Skeleton className='h-4 w-3/4' />
			<Skeleton className='h-3 w-1/2' />
		</div>
	</div>
);
