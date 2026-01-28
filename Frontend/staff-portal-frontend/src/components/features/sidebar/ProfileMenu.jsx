import { ChevronRight, LogOut, Moon, Shield, Sun, User } from "lucide-react";
import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import ThemeMenu from "./ThemeMenu";

export const ProfileMenu = ({ isCollapsed, onClose, effectiveTheme, themes, setTheme }) => {
	const [showThemeMenu, setShowThemeMenu] = useState(false);

	const handleThemeMenuEnter = useCallback(() => setShowThemeMenu(true), []);
	const handleThemeMenuLeave = useCallback(() => setShowThemeMenu(false), []);

	const ThemeIcon = effectiveTheme === themes.DARK ? Moon : Sun;
	const modalVariants = {
		hidden: { opacity: 0, scale: 0, x: -40, y: 40 },
		visible: {
			opacity: 1,
			scale: 1,
			x: 10,
			y: 0,
			transition: { type: "spring", stiffness: 260, damping: 25, duration: 0.4 },
		},
		exit: { opacity: 0, scale: 0.5, x: -20, y: 20, transition: { duration: 0.2, ease: "easeIn" } },
	};
	const menuPositionClass = isCollapsed ? "left-[78px]" : "left-[260px]";
	return (
		<motion.div
			initial='hidden'
			animate='visible'
			exit='exit'
			variants={modalVariants}
			style={{ transformOrigin: "bottom left" }}
			className={`absolute bottom-5 ${menuPositionClass} z-70 min-w-45 rounded-[40px] border border-slate-200 bg-white p-2 text-slate-600 shadow-2xl shadow-slate-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:shadow-black/50`}>
			<div className='space-y-1'>
				{/* View/Edit Profile */}
				<button
					className='flex w-full cursor-pointer items-center gap-3 rounded-t-4xl rounded-b-xl p-2.5 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800'
					onClick={onClose}>
					<User size={16} className='opacity-50' />
					View/Edit Profile
				</button>

				{/* Auth Settings */}
				<button
					className='flex w-full cursor-pointer items-center gap-3 rounded-xl p-2.5 text-sm transition-colors hover:bg-slate-50 dark:hover:bg-neutral-800'
					onClick={onClose}>
					<Shield size={16} className='opacity-50' />
					Auth Setting
				</button>

				{/* Theme Menu */}
				<div className='relative' onMouseEnter={handleThemeMenuEnter} onMouseLeave={handleThemeMenuLeave}>
					<button
						className={`flex w-full items-center justify-between rounded-xl p-2.5 text-sm transition-colors ${
							showThemeMenu ? "bg-sky-50 text-sky-600 dark:bg-neutral-800 dark:text-amber-500" : "hover:bg-slate-50 dark:hover:bg-neutral-800"
						}`}>
						<div className='flex items-center gap-3'>
							<ThemeIcon size={16} />
							Appearance
						</div>
						<ChevronRight size={14} className='opacity-30' />
					</button>

					<AnimatePresence>{showThemeMenu && <ThemeMenu effectiveTheme={effectiveTheme} themes={themes} setTheme={setTheme} />}</AnimatePresence>
				</div>

				{/* Divider */}
				<div className='my-1 h-px bg-slate-100 dark:bg-neutral-800' />

				{/* Logout */}
				<button
					className='flex w-full items-center gap-3 rounded-t-xl rounded-b-4xl p-2.5 text-sm text-rose-500 transition-colors hover:bg-rose-500/10'
					onClick={onClose}>
					<LogOut size={16} />
					Logout
				</button>
			</div>
		</motion.div>
	);
};
