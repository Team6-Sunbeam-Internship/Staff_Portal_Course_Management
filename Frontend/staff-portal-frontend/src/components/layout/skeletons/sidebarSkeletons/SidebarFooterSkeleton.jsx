import { motion } from "motion/react";

const SidebarFooterSkeleton = ({ isCollapsed }) => {
	const baseColor = "bg-zinc-200 dark:bg-zinc-800";

	const shimmer = {
		animate: {
			x: ["-100%", "100%"],
			transition: {
				repeat: Infinity,
				duration: 2,
				ease: "linear",
			},
		},
	};

	return (
		<div className='relative mt-auto shrink-0 py-4'>
			<div className='px-2'>
				<div className={`flex w-full items-center gap-5 rounded-full border border-transparent p-0.5`}>
					{/* Avatar Circle Skeleton */}
					<div className='flex w-12 shrink-0 items-center justify-center'>
						<div className={`relative h-12 w-12 overflow-hidden rounded-full ${baseColor}`}>
							<motion.div {...shimmer} className='absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent' />
						</div>
					</div>

					{/* User Info Skeleton */}
					{!isCollapsed && (
						<div className='flex w-full items-center justify-between pr-2'>
							<div className='flex flex-col space-y-2 overflow-hidden text-left'>
								{/* Name Line */}
								<div className={`relative h-3.5 w-24 overflow-hidden rounded ${baseColor}`}>
									<motion.div {...shimmer} className='absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent' />
								</div>
								{/* Role Line (Static/Slower) */}
								<div className={`h-2.5 w-12 rounded ${baseColor} opacity-60`} />
							</div>

							{/* Chevron Placeholder */}
							<div className={`h-5 w-5 rounded-full ${baseColor} opacity-30`} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SidebarFooterSkeleton;
