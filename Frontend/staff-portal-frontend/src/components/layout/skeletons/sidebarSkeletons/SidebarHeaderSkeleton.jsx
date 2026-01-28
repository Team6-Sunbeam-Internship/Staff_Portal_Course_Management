import { motion } from "motion/react";

const SidebarHeaderSkeleton = ({ isCollapsed }) => {
	const baseColor = "bg-zinc-200 dark:bg-zinc-800";
	const highlightColor = "bg-zinc-100 dark:bg-zinc-700";

	// Shimmer animation logic
	const shimmerVariants = {
		animate: {
			// Moves a background gradient from left to right
			backgroundPosition: ["200% 0", "-200% 0"],
		},
	};

	return (
		<div className='relative flex h-20 shrink-0 items-center overflow-hidden'>
			<div className='flex w-16 shrink-0 items-center justify-center'>
				{/* Now using highlightColor in a gradient */}
				<motion.div
					variants={shimmerVariants}
					animate='animate'
					transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
					className={`h-11 w-11 rounded-full ${baseColor} bg-linear-to-r from-transparent via-white/10 to-transparent`}
					style={{ backgroundSize: "200% 100%" }}
				/>
			</div>

			{!isCollapsed && (
				<div className={`h-6 w-24 rounded-md ${baseColor} relative overflow-hidden`}>
					{/* Overlaying the highlight as a sliding beam */}
					<motion.div
						animate={{ x: ["-100%", "100%"] }}
						transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
						className={`absolute inset-0 ${highlightColor} opacity-30`}
						style={{ skewX: "-20deg" }}
					/>
				</div>
			)}
		</div>
	);
};

export default SidebarHeaderSkeleton;
