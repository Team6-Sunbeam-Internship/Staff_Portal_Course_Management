export const TableHeader = ({ children, className = "" }) => (
	<th
		className={`px-2 py-3 text-center text-xs font-semibold wrap-break-word whitespace-break-spaces text-blue-600 uppercase dark:text-amber-500/50 ${className}`}>
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
