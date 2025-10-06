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

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export const SidebarHeader = ({ onCollapse, isCollapsed }) => {
	return (
		<div
			className={`flex items-center justify-between border-b border-gray-200 dark:border-gray-700  p-4 `}
		>
			<div
				className={`flex items-center space-x-3 transition-all duration-300 ${
					isCollapsed ? "hidden" : "opacity-100 visible"
				}`}
			>
				<div className='bg-gray-200 dark:bg-neutral-700/50 p-2 rounded-lg flex items-center justify-center'>
					<span className='text-gray-500 dark:text-white font-bold text-xl'>
						SB
					</span>
				</div>
				<div>
					<h2 className='text-xl font-bold text-gray-700 dark:text-gray-100 whitespace-nowrap'>
						Sunbeam
					</h2>
				</div>
			</div>

			{/* Collapse toggle button (desktop only) */}
			<button
				onClick={onCollapse}
				className=' md:flex w-12 h-12 cursor-pointer items-center justify-center rounded-full  hover:bg-neutral-300 dark:bg-neutral-700/50 dark:hover:bg-neutral-700'
				aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
			>
				{isCollapsed ? (
					<PanelLeftOpen className='' size={20} />
				) : (
					<PanelLeftClose className='' size={20} />
				)}
			</button>
		</div>
	);
};
