export const TableHeader = ({ children, className = "" }) => (
	<th
		className={` px-6 py-3 text-xs font-semibold uppercase text-center  text-blue-600 dark:text-blue-400 ${className}`}
	>
		{children}
	</th>
);

// export const TableHeader = ({ children, className = "" }) => (
// 	<th
// 		className={`px-6 py-3 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 ${className}`}
// 	>
// 		{children}
// 	</th>
// );
