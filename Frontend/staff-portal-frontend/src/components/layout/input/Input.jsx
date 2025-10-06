export const Input = ({ error, ...props }) => (
	<input
		className={`mt-1 block w-full rounded-md border-none bg-gray-100${
			error
				? " focus:ring-red-500 dark:bg-sky-600/50 dark:text-black"
				: " focus:border-blue-500 focus:ring-blue-500 dark:bg-blue-950 dark:text-gray-100  "
		} shadow-sm px-3 py-2 transition-colors duration-200`}
		{...props}
	/>
);
