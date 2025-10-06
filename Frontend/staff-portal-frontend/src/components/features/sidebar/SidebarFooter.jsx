import React from "react";
import { useTheme } from "../../../providers/providerHook";
import { Moon, SunIcon } from "lucide-react";
const APP_VERSION = "v.1.0.0";
export const SidebarFooter = ({ isCollapsed, userRole }) => {
	const { effectiveTheme, setTheme, themes } = useTheme();

	const toggleTheme = () => {
		const newTheme =
			effectiveTheme === themes.LIGHT ? themes.DARK : themes.LIGHT;
		setTheme(newTheme);
	};

	if (isCollapsed) {
		return (
			<div className='p-4 border-gray-200 dark:border-neutral-700 flex flex-col items-center justify-center space-y-4'>
				{/* User Icon/Initial */}
				<div className='w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center'>
					<span className='text-sm font-medium text-gray-600 dark:text-gray-200'>
						{userRole?.charAt(0) || "U"}
					</span>
				</div>

				{/* Theme Toggle Button (Collapsed) */}
				<button
					onClick={toggleTheme}
					className='p-2 cursor-pointer rounded-full text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors'
					aria-label='Toggle theme'
				>
					<div
						className={`w-5 h-5 transition-transform duration-500 ease-in-out ${
							effectiveTheme === themes.DARK
								? "rotate-180"
								: "rotate-0"
						}`}
					>
						{effectiveTheme === themes.LIGHT ? (
							<Moon className='w-full h-full' />
						) : (
							<SunIcon className='w-full h-full' />
						)}
					</div>
				</button>
			</div>
		);
	}
	return (
		<div className='p-4 border-t border-gray-200 dark:border-neutral-700 space-y-3'>
			{/* 1. User Role */}
			<div className='flex items-center space-x-3'>
				<div className='w-8 h-8 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center'>
					<span className='text-sm font-medium text-gray-600 dark:text-gray-200'>
						{userRole?.charAt(0) || "U"}
					</span>
				</div>
				<div className='flex flex-col min-w-0'>
					<p className='text-sm font-medium text-neutral-900 dark:text-gray-200 truncate'>
						{userRole?.replace("_", " ") || "User"}
					</p>
					<p className='text-xs text-gray-500 dark:text-gray-300'>
						Role
					</p>
				</div>
			</div>

			{/* 2. Theme Toggle and Version */}
			<div className='flex justify-between items-center border-t border-dashed border-gray-200 dark:border-neutral-700 pt-2'>
				{/* System Version */}

				<p className='text-xs text-neutral-500 dark:text-neutral-400'>
					Version {APP_VERSION}
				</p>

				{/* Theme Toggle Button (Expanded) */}
				<button
					onClick={toggleTheme}
					className='p-2 cursor-pointer rounded-full text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors'
					aria-label='Toggle theme'
				>
					<div
						className={`w-5 h-5 transition-transform duration-500 ease-in-out ${
							effectiveTheme === themes.DARK
								? "rotate-180"
								: "rotate-0"
						}`}
					>
						{effectiveTheme === themes.LIGHT ? (
							<Moon className='w-full h-full' />
						) : (
							<SunIcon className='w-full h-full' />
						)}
					</div>
				</button>
			</div>
		</div>
	);
};
