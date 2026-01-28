import { motion } from "motion/react";

const HorizonDividerSkeleton = () => {
	// We use the theme to determine how "bright" the glow is
	const baseColor = "bg-zinc-200 dark:bg-zinc-800";
	const pulseColor = "bg-zinc-100 dark:bg-zinc-700";

	return (
		<div className='relative my-3 flex h-1 w-full items-center justify-center overflow-hidden'>
			{/* Background "Glow" Placeholder */}
			<div className={`absolute inset-0 h-full w-full rounded-full opacity-20 blur-md ${baseColor}`} />

			{/* The Main Line */}
			<div
				className={`relative h-[1.5px] w-full rounded-full ${baseColor}`}
				style={{
					clipPath: "polygon(0 50%, 50% 0%, 100% 50%, 50% 100%)",
				}}>
				{/* Moving Pulse for the divider */}
				<motion.div
					animate={{
						x: ["-100%", "100%"],
						opacity: [0, 1, 0],
					}}
					transition={{
						duration: 2.5,
						repeat: Infinity,
						ease: "easeInOut",
					}}
					className={`absolute inset-0 w-1/2 ${pulseColor}`}
					style={{
						background: `linear-gradient(90deg, transparent, currentColor, transparent)`,
					}}
				/>
			</div>
		</div>
	);
};

export default HorizonDividerSkeleton;
