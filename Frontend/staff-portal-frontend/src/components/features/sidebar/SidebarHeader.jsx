// import { ChevronLeft, ChevronRight } from "lucide-react";


// export const SidebarHeader = ({ onCollapse, isCollapsed }) => {
// 	return (
// 		<div className='flex items-center justify-between p-4 border-b border-gray-700 dark:border-gray-700'>
// 			{!isCollapsed && (
// 				<div className='flex items-center space-x-3'>
// 					<div
// 						className={`flex items-center space-x-3 transition-all ${
// 							isCollapsed
// 								? "opacity-0 invisible"
// 								: "opacity-100 visible"
// 						}`}
// 					>
// 						<div className='w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center'>
// 							<span className='text-white font-bold text-lg'>
// 								SP
// 							</span>
// 						</div>
// 						<div>
// 							<h2 className='text-lg font-semibold text-secondary-900 dark:text-gray-100'>
// 								Staff Portal
// 							</h2>
// 						</div>
// 					</div>
// 				</div>
// 			)}

// 			{/* Collapse toggle button (desktop only) */}
// 			<button
// 				onClick={onCollapse}
// 				className='hidden md:flex dark:bg-gray-400 items-center cursor-pointer justify-center p-2 rounded-lg  hover:bg-secondary-100 dark:hover:bg-gray-200'
// 				aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
// 			>
// 				{isCollapsed ? (
// 					<ChevronRight className='w-4 h-4' />
// 				) : (
// 					<ChevronLeft className='w-4 h-4' />
// 				)}
// 			</button>
// 		</div>
// 	);
// };

// import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

// export const SidebarHeader = ({ onCollapse, isCollapsed }) => {
// 	return (
// 		<div
// 			className={`flex items-center justify-between border-b border-gray-200 dark:border-gray-700  p-4 `}
// 		>
// 			<div
// 				className={`flex items-center space-x-3 transition-all duration-300 ${
// 					isCollapsed ? "hidden" : "opacity-100 visible"
// 				}`}
// 			>
// 				<div className='bg-gray-200 dark:bg-neutral-700/50 p-2 rounded-lg flex items-center justify-center'>
// 					<span className='text-gray-500 dark:text-white font-bold'>
// 						SB
// 					</span>
// 				</div>
// 				<div>
// 					<h2 className='font-bold text-gray-700 dark:text-gray-100 whitespace-nowrap'>
// 						Sunbeam
// 					</h2>
// 				</div>
// 			</div>

// 			{/* Collapse toggle button (desktop only) */}
// 			<button
// 				onClick={onCollapse}
// 				className=' md:flex w-12 h-12 cursor-pointer items-center justify-center rounded-full  hover:bg-neutral-300 dark:bg-neutral-700/50 dark:hover:bg-neutral-700'
// 				aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
// 			>
// 				{isCollapsed ? (
// 					<PanelLeftOpen className='' size={20} />
// 				) : (
// 					<PanelLeftClose className='' size={20} />
// 				)}
// 			</button>
// 		</div>
// 	);
// };
import { ChevronLeft, ChevronRight, CornerDownLeft, IterationCcwIcon, IterationCw, Layers } from "lucide-react";
import { motion } from "motion/react";
export const SidebarHeader = ({ isCollapsed, toggleSidebar }) => {
	return (
		<div className='relative flex h-15 shrink-0 items-center'>
			<div className='itmes-center flex w-16 shrink-0 justify-center'>
				<div
					className={`shadow-sky-200/20" flex h-11 w-11 items-center justify-center rounded-full bg-sky-600 shadow-lg transition-colors duration-500 ease-in-out dark:bg-amber-600 dark:shadow-amber-900/20`}>
					<Layers className='text-white' size={24} />
				</div>
			</div>
			{!isCollapsed && (
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					className={`text-xl font-bold tracking-tight whitespace-nowrap text-slate-800 dark:text-white`}>
					Sunbeam
				</motion.span>
			)}
			{/* Desktop toggle button */}
			<motion.button
				initial={{ rotate: 0 }}
				animate={{ rotate: isCollapsed ? 180 : 0 }}
				transition={{ duration: 0.3, ease: "easeIn" }}
				onClick={toggleSidebar}
				aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
				className={`absolute top-1/2 -right-6 z-50 hidden -translate-y-1/2 cursor-pointer rounded-full bg-white p-1.5 text-slate-400 shadow-md drop-shadow-2xl drop-shadow-teal-300 transition-transform outline-none focus-visible:ring-2 focus-visible:ring-sky-500 lg:flex dark:bg-neutral-900 dark:text-neutral-400 dark:drop-shadow-md dark:drop-shadow-amber-300 dark:focus-visible:ring-amber-500`}>
				<CornerDownLeft size={14} />
			</motion.button>
		</div>
	);
};

export default SidebarHeader;
