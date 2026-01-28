import { motion } from "motion/react";

const SidebarBodySkeleton = ({ isCollapsed, count = 5 }) => {
	const baseColor = "bg-zinc-200 dark:bg-zinc-800";
	const shimmerColor = "via-white/15 dark:via-zinc-700/15";

	// Shimmer animation for the parent items
	const shimmerVariants = {
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
		<div className='flex w-full flex-col space-y-1'>
			{Array.from({ length: count }).map((_, index) => (
				<div key={index} className='relative flex h-11 w-full items-center overflow-hidden rounded-xl'>
					{/* Icon Skeleton */}
					<div className='flex w-16 shrink-0 items-center justify-center'>
						<div className={`relative h-5 w-5 overflow-hidden rounded-full ${baseColor}`}>
							<motion.div
								variants={shimmerVariants}
								animate='animate'
								className={`absolute inset-0 bg-linear-to-r from-transparent ${shimmerColor} to-transparent`}
							/>
						</div>
					</div>

					{/* Label Skeleton */}
					{!isCollapsed && (
						<div className='flex flex-1 items-center pr-4'>
							<div className={`relative h-3.5 w-28 overflow-hidden rounded-md ${baseColor}`}>
								<motion.div
									variants={shimmerVariants}
									animate='animate'
									className={`absolute inset-0 bg-linear-to-r from-transparent ${shimmerColor} to-transparent`}
								/>
							</div>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default SidebarBodySkeleton;
