import { motion } from "motion/react";
import HorizonDividerSkeleton from "./HorizonDividerSkeleton";
import SidebarBodySkeleton from "./SidebarBodySkeleton";
import SidebarFooterSkeleton from "./SidebarFooterSkeleton";
import SidebarHeaderSkeleton from "./SidebarHeaderSkeleton";

// Simple divider skeleton
// const HorizonDividerSkeleton = ({ isDark }) => <div className={`my-1 h-px w-full ${isDark ? "bg-neutral-800" : "bg-slate-100"}`} />;

const SidebarSkeleton = ({ isCollapsed }) => {
	return (
		<motion.aside
			initial={false}
			animate={{ width: isCollapsed ? 88 : 280 }}
			className={`fixed z-50 flex h-full flex-col bg-white px-3 shadow-lg shadow-slate-200 lg:relative dark:bg-zinc-950 dark:shadow-zinc-900/20`}>
			{/* 1. Header Section */}
			<SidebarHeaderSkeleton isCollapsed={isCollapsed} />

			<div className='px-0.5'>
				<HorizonDividerSkeleton />
			</div>

			{/* 2. Body Section (Parent Items Only) */}
			<div className='flex-1 overflow-hidden py-2'>
				<div className='space-y-1'>
					<SidebarBodySkeleton isCollapsed={isCollapsed} count={7} />
				</div>
			</div>

			<div className='px-0.5'>
				<HorizonDividerSkeleton />
			</div>

			{/* 3. Footer Section */}
			<SidebarFooterSkeleton isCollapsed={isCollapsed} />
		</motion.aside>
	);
};

export default SidebarSkeleton;
