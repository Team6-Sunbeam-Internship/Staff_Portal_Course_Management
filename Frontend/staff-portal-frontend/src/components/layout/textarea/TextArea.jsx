export const TextArea = ({ error, ...props }) => (
	<textarea
		className={`mt-1 block w-full rounded-md border-none bg-gray-100 ${
			error
				? "border-red-300 focus:border-red-500 focus:ring-red-500"
				: "border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-blue-950 dark:text-gray-400 placeholder:text-gray-400 "
		} shadow-sm px-3 py-2 transition-colors duration-200`}
		{...props}
	/>
);
