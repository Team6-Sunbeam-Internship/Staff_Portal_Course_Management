import { motion } from "motion/react";
import {
	LucideRocket,
	LucideSettings,
	LucideRefreshCcw,
	LucideDownload,
	LucideUpload,
	LucideSearch,
	LucideCopy,
	LucideShare2,
	LucideEye,
	LucidePlus,
} from "lucide-react";
export const Button = ({ children, variant = "primary", icon: Icon, className = "", onClick, ...props }) => {
	const variants = {
		primary: "bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-xl shadow-amber-500/20",
		secondary: "bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200",
		outline:
			"bg-transparent border-2 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-amber-500/50 hover:text-amber-500 dark:hover:text-amber-400",
		ghost: "bg-transparent text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-100",
		warning: "bg-rose-500 text-white shadow-xl shadow-rose-500/20 hover:bg-rose-600",
		success: "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 hover:bg-emerald-600",
		info: "bg-indigo-500 text-white shadow-xl shadow-indigo-500/20 hover:bg-indigo-600",

		// Improved Multi-Colour Gradients
		gradientAmber:
			"bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 text-zinc-950 shadow-xl shadow-orange-500/30 hover:shadow-orange-500/40",
		gradientEmerald:
			"bg-gradient-to-br from-emerald-500 to-blue-600 text-white shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/40",
		gradientIndigo:
			"bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/30 hover:shadow-purple-500/40",
		gradientRose: "bg-gradient-to-br from-rose-500 via-rose-600 to-orange-600 text-white shadow-xl shadow-rose-500/30 hover:shadow-rose-500/40",
		gradientCyan: "bg-linear-to-r from-cyan-700 to-green-500 text-white shadow-xl shadow-blue-500/30",
	};
	const getIconAnimation = () => {
		if (!Icon) return {};
		if (variant === "warning") return { x: [0, -2, 2, -2, 0], transition: { repeat: 4, repeatType: "mirror", duration: 0.4 } };
		if (Icon === LucideRocket) return { y: -3, x: 2 };
		if (Icon === LucideSettings || Icon === LucideRefreshCcw) return { rotate: 180 };
		if (Icon === LucideDownload) return { y: 3 };
		if (Icon === LucideUpload) return { y: -3 };
		if (Icon === LucideSearch) return { scale: 1.1 };
		if (Icon === LucideCopy) return { scale: 0.9, rotate: -5 };
		if (Icon === LucideShare2) return { x: 2, y: -2 };
		if (Icon === LucideEye) return { scale: 1.2, opacity: 0.8 };
		if (Icon === LucidePlus) return { rotate: 90, scale: 1.1 };
		return { x: 3 };
	};
	return (
		<motion.button
			onClick={onClick}
			whileHover='hover'
			whileTap={{ scale: 0.97 }}
			initial='rest'
			className={`group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl px-3 py-3 text-[10px] font-black tracking-widest uppercase transition-all cursor-pointer ${variants[variant] || variants.primary} ${className}`}
			{...props}>
			{/* Dynamic Shine effect for gradients */}
			{variant.startsWith("gradient") && (
				<motion.div
					className='absolute inset-0 -translate-x-full skew-x-[-25deg] bg-white/30 blur-sm'
					variants={{ hover: { translateX: "250%" } }}
					transition={{ duration: 0.7, ease: "circOut" }}
				/>
			)}

			{Icon && (
				<motion.span
					className='relative z-10'
					variants={{
						rest: { x: 0, y: 0, rotate: 0, scale: 1 },
						hover: getIconAnimation(),
					}}
					transition={{ type: "spring", stiffness: 400, damping: 12 }}>
					<Icon size={16} strokeWidth={2.5} />
				</motion.span>
			)}
		{children &&(<span className='relative z-10'>{children}</span>)}
		</motion.button>
	);
};
