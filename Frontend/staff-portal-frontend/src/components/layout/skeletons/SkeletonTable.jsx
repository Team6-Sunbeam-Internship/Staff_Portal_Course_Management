export const SkeletonTable = () => (
	<div className='animate-pulse'>
		<div className='bg-gray-200 dark:bg-gray-700 h-10 w-full rounded-md mb-2'></div>
		{[...Array(5)].map((_, i) => (
			<div key={i} className='flex items-center space-x-4 py-4'>
				<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4'></div>
				<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4'></div>
				<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4'></div>
				<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4'></div>
			</div>
		))}
	</div>
);
