// export const Modal = ({ isOpen, onClose, children, size = "lg" }) => {
// 	if (!isOpen) return null;

// 	const sizeClasses = {
// 		sm: "max-w-sm",
// 		md: "max-w-md",
// 		lg: "max-w-lg",
// 		xl: "max-w-xl",
// 		"2xl": "max-w-2xl",
// 	};

// 	return (
// 		<div
// 			className='fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/45 overflow-y-auto'
// 			onClick={onClose}
// 		>
// 			<div
// 				className={`relative w-full rounded-2xl shadow-2xl transition-all transform-gpu scale-100 opacity-100 border-none dark:bg-none mx-auto ${sizeClasses[size]}`}
// 				onClick={(e) => e.stopPropagation()}
// 			>
// 				{children}
// 			</div>
// 		</div>
// 	);
// };

import { motion, AnimatePresence } from "motion/react";
export const Modal = ({ isOpen, onClose, size = "md", children }) => {
	const sizeClasses = {
		sm: "max-w-md",
		md: "max-w-2xl",
		lg: "max-w-4xl",
		xl: "max-w-5xl",
		"2xl": "max-w-6xl",
		"3xl": "max-w-7xl",
		full: "max-w-full mx-4",
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className='absolute inset-0 z-50 flex items-center justify-center overflow-hidden p-4 sm:p-6'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className='fixed inset-0 bg-zinc-950/60 backdrop-blur-md dark:bg-black/80'
					/>

					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						transition={{ type: "spring", damping: 25, stiffness: 350 }}
						className={`relative w-full ${sizeClasses[size]} flex max-h-[min(90vh,100%)] flex-col overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-2xl dark:border-yellow-500 dark:bg-zinc-950`}>
						{children}
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
