export const Button = ({
	children,
	onClick,
	variant = "blue",
	size = "md",
	...props
}) => {
	let baseClasses =
		"font-semibold h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 cursor-pointer";
	let variantClasses = "";
	let sizeClasses = "";

	switch (variant) {
		case "blue":
			variantClasses =
				"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 flex items-center justify-center gap-2 bg-gradient-to-l from-cyan-500 to-sky-600 dark:bg-gradient-to-r dark:from-sky-500 dark:to-cyan-900 cursor-pointer";
			break;
		case "secondary":
			variantClasses =
				"bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-indigo-950/95 dark:text-sky-500 dark:hover:bg-sky-900 flex items-center justify-center gap-2";
			break;
		case "ghost":
			variantClasses =
				"text-gray-600 hover:bg-sky-200/50 dark:text-gray-400 dark:hover:bg-gray-700 flex items-center justify-center gap-2";
			break;
		case "danger":
			variantClasses =
				"text-red-500 hover:bg-red-100 focus:ring-red-500 flex items-center justify-center gap-2  dark:hover:bg-red-500/45 dark:text-rose-500 ";
			break;
		case "create":
			variantClasses =
				"text-white hover:bg-green-700 focus:ring-green-500 flex items-center justify-center gap-2 dark:bg-gradient-to-l dark:from-green-600 dark:to-emerald-950 dark:hover:bg-slate-700 dark:text-rose-100 ";
			break;
		case "cancel":
			variantClasses =
				"text-white hover:bg-red-700 focus:ring-red-500 flex items-center justify-center gap-2 dark:bg-gradient-to-l dark:from-rose-500 dark:to-rose-800 dark:hover:bg-red-900 dark:text-rose-100 ";
			break;
		default:
			break;
	}
	switch (size) {
		case "sm":
			sizeClasses = "px-3 py-1.5 text-sm";
			break;
		case "md":
		default:
			sizeClasses = "px-4 py-2 text-sm";
			break;
	}
	return (
		<button
			className={`${baseClasses} ${variantClasses} ${sizeClasses}`}
			onClick={onClick}
			{...props}
		>
			{children}
		</button>
	);
};
