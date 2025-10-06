import React from "react";
import { Skeleton } from "../Skeleton";

export const SidebarSkeleton = () => {
	return (
		<aside className='absolute flex flex-col w-80 h-screen bg-white dark:bg-black/90 border-r border-gray-200 dark:border-gray-700 animate-pulse'>
			{/* Header section skeleton */}
			<div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
				<div className='flex items-center space-x-3'>
					<Skeleton variant='circular' width={32} height={32} />
					<Skeleton variant='title' width={120} />
				</div>
			</div>

			{/* Menu items section skeleton */}
			<nav className='flex-1 overflow-y-auto py-4'>
				<div className='px-3 space-y-2'>
					{/* Skeleton for single menu items like Dashboard and Profile */}
					<div className='flex items-center space-x-3 p-3'>
						<Skeleton variant='avatar' width={20} height={20} />
						<Skeleton variant='text' width={100} />
					</div>
					{/* Skeleton for dropdown menu items */}
					<div className='space-y-2'>
						{Array.from({ length: 4 }).map((_, index) => (
							<div key={index} className='p-3'>
								<div className='flex items-center space-x-3'>
									<Skeleton
										variant='avatar'
										width={20}
										height={20}
									/>
									<Skeleton variant='text' width={150} />
								</div>
								<div className='ml-4 mt-2 space-y-1'>
									<Skeleton variant='text' width={120} />
									<Skeleton variant='text' width={140} />
								</div>
							</div>
						))}
					</div>
				</div>
			</nav>

			{/* User role section skeleton */}
			<div className='p-4 border-t border-gray-200 dark:border-neutral-700'>
				<div className='flex items-center space-x-3'>
					<Skeleton variant='avatar' width={32} height={32} />
					<div className='flex-1 space-y-1'>
						<Skeleton variant='text' width={100} />
						<Skeleton variant='text' width={50} />
					</div>
				</div>
			</div>
		</aside>
	);
};
