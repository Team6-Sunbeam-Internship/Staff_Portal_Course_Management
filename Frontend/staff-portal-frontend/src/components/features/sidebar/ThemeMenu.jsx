import { Monitor, Moon, Sun } from "lucide-react";
import { useMemo } from "react";
import { motion } from "motion/react";

export const ThemeMenu = ({ effectiveTheme, themes, setTheme }) => {
	const themeOptions = useMemo(
		() => [
			{ id: themes.SYSTEM, icon: Monitor, label: "System" },
			{ id: themes.DARK, icon: Moon, label: "Dark" },
			{ id: themes.LIGHT, icon: Sun, label: "Light" },
		],
		[themes]
	);

	return (
		<motion.div
			initial={{ opacity: 0, x: 10, scale: 0.9 }}
			animate={{ opacity: 1, x: 0, scale: 1 }}
			exit={{ opacity: 0, x: 10, scale: 0.9 }}
			transition={{ duration: 0.15 }}
			className='absolute -bottom-15 left-[105%] z-80 ml-2 w-40 rounded-4xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900'>
			{themeOptions.map((theme) => {
				const Icon = theme.icon;
				const isActive = effectiveTheme === theme.id;

				return (
					<button
						key={theme.id}
						onClick={(e) => {
							e.stopPropagation();
							setTheme(theme.id);
						}}
						className={`mb-2 flex w-full cursor-pointer items-center gap-3 rounded-4xl p-2.5 text-sm transition-colors last:mb-0 ${
							isActive ?
								"bg-sky-100 text-sky-600 dark:bg-neutral-700 dark:text-amber-400"
							:	"text-slate-600 hover:bg-slate-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
						}`}>
						<Icon size={16} />
						{theme.label}
					</button>
				);
			})}
		</motion.div>
	);
};

export default ThemeMenu;
