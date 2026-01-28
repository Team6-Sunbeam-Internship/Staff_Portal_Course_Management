export const TableRow = ({ children, isHeader = false }) => (
	<tr className={`${isHeader ? "" : "transition-colors hover:bg-gray-50 dark:hover:bg-zinc-900/50"}`}>{children}</tr>
);

// export const TableRow = ({ children }) => (
// 	<tr className='hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors text-center'>
// 		{children}
// 	</tr>
// );
