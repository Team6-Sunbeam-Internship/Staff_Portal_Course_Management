// import React from "react";
// import { useTheme } from "../../../providers/providerHook";
// import { Moon, SunIcon } from "lucide-react";
// const APP_VERSION = "v.1.0.0";
// export const SidebarFooter = ({ isCollapsed, userRole }) => {
// 	const { effectiveTheme, setTheme, themes } = useTheme();

// 	const toggleTheme = () => {
// 		const newTheme =
// 			effectiveTheme === themes.LIGHT ? themes.DARK : themes.LIGHT;
// 		setTheme(newTheme);
// 	};

// 	if (isCollapsed) {
// 		return (
// 			<div className='p-4 border-gray-200 dark:border-neutral-700 flex flex-col items-center justify-center space-y-4'>
// 				{/* User Icon/Initial */}
// 				<div className='w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center'>
// 					<span className='text-sm font-medium text-gray-600 dark:text-gray-200'>
// 						{userRole?.charAt(0) || "U"}
// 					</span>
// 				</div>

// 				{/* Theme Toggle Button (Collapsed) */}
// 				<button
// 					onClick={toggleTheme}
// 					className='p-2 cursor-pointer rounded-full text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors'
// 					aria-label='Toggle theme'
// 				>
// 					<div
// 						className={`w-5 h-5 transition-transform duration-500 ease-in-out ${
// 							effectiveTheme === themes.DARK
// 								? "rotate-180"
// 								: "rotate-0"
// 						}`}
// 					>
// 						{effectiveTheme === themes.LIGHT ? (
// 							<Moon className='w-full h-full' />
// 						) : (
// 							<SunIcon className='w-full h-full' />
// 						)}
// 					</div>
// 				</button>
// 			</div>
// 		);
// 	}
// 	return (
// 		<div className='p-4 border-t border-gray-200 dark:border-neutral-700 space-y-3'>
// 			{/* 1. User Role */}
// 			<div className='flex items-center space-x-3'>
// 				<div className='w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center'>
// 					<span className='text-sm font-medium text-gray-600 dark:text-gray-200'>
// 						{userRole?.charAt(0) || "U"}
// 					</span>
// 				</div>
// 				<div className='flex flex-col min-w-0'>
// 					<p className='text-sm font-medium text-neutral-900 dark:text-gray-200 truncate'>
// 						{userRole?.replace("_", " ") || "User"}
// 					</p>
// 					<p className='text-xs text-gray-500 dark:text-gray-300'>
// 						Role
// 					</p>
// 				</div>
// 			</div>

// 			{/* 2. Theme Toggle and Version */}
// 			<div className='flex justify-between items-center border-t border-dashed border-gray-200 dark:border-neutral-700 pt-2'>
// 				{/* System Version */}

// 				<p className='text-xs text-neutral-500 dark:text-neutral-400'>
// 					Version {APP_VERSION}
// 				</p>

// 				{/* Theme Toggle Button (Expanded) */}
// 				<button
// 					onClick={toggleTheme}
// 					className='p-2 cursor-pointer rounded-full text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors'
// 					aria-label='Toggle theme'
// 				>
// 					<div
// 						className={`w-5 h-5 transition-transform duration-500 ease-in-out ${
// 							effectiveTheme === themes.DARK
// 								? "rotate-180"
// 								: "rotate-0"
// 						}`}
// 					>
// 						{effectiveTheme === themes.LIGHT ? (
// 							<Moon className='w-full h-full' />
// 						) : (
// 							<SunIcon className='w-full h-full' />
// 						)}
// 					</div>
// 				</button>
// 			</div>
// 		</div>
// 	);
// };

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronRight, LogOut, Monitor, Moon, Shield, Sun, User } from "lucide-react";
// import { useModal } from "../../../providers";
import { selectAuthUser } from "../../../store";
import { useTheme } from "../../../providers/providerHook";
import { useSelector } from "react-redux";
import { ProfileMenu } from "./ProfileMenu";

export const SidebarFooter = memo(({ isCollapsed }) => {
	const { name, role } = useSelector(selectAuthUser);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { effectiveTheme, themes, setTheme } = useTheme();

	console.log(effectiveTheme);
	console.log(themes);
	console.log(effectiveTheme === themes.DARK);
	const toggleModal = useCallback(() => {
		setIsModalOpen((prev) => !prev);
	}, []);

	const closeModal = useCallback(() => {
		setIsModalOpen(false);
	}, []);

	// Default avatar URL with memoization
	const avatarUrl = useMemo(() => "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", []);
	useEffect(()=>{console.log("SidebarFooter")},[])
	return (
		<div className='relative mt-auto shrink-0 py-4'>
			<div className='px-2'>
				<button
					onClick={toggleModal}
					className={`group flex w-full cursor-pointer items-center gap-5 rounded-full ring-1 ring-teal-400 drop-shadow-md drop-shadow-teal-500 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:ring-amber-300 dark:drop-shadow-indigo-500 dark:focus-visible:ring-amber-500`}>
					<div className={`flex w-12 shrink-0 items-center justify-center`}>
						<img src={avatarUrl} alt={`${name}'s profile`} className={`h-12 w-12 rounded-full transition-all`} />
					</div>
					{!isCollapsed && (
						<div className='flex w-full items-center justify-between pr-2'>
							<div className='flex flex-col overflow-hidden pr-4 text-left'>
								<span className={`truncate text-sm font-semibold text-slate-700 dark:text-neutral-200`}>{name}</span>
								<span className={`truncate text-xs text-slate-600 dark:text-neutral-300`}>{role}</span>
							</div>
							<motion.div initial={{ rotate: 0 }} animate={{ rotate: isModalOpen ? -90 : 0 }} transition={{ duration: 0.3 }} className='dark:text-gray-600 opacity-75'>
								<ChevronDown size={24} />
							</motion.div>
						</div>
					)}
				</button>
			</div>

			<AnimatePresence>
				{isModalOpen && (
					<>
						<div className='fixed inset-0 z-60' onClick={closeModal} >
							<ProfileMenu isCollapsed={isCollapsed} onClose={closeModal} effectiveTheme={effectiveTheme} themes={themes} setTheme={setTheme} />
						</div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
});

export default SidebarFooter;
