export const TableCell = ({ children, className = "", handleClick }) => (
	<td
		className={`py-3 align-middle text-sm wrap-break-word whitespace-break-spaces text-gray-800 dark:text-gray-200 ${className}`}
		onClick={() => handleClick && handleClick(children)}>
		{children}
	</td>
);

// export const TableCell = ({ children, className = "" }) => (
// 	<td
// 		className={`px-6 py-4  text-sm text-gray-800 dark:text-gray-200 text-center ${className}`}
// 	>
// 		{children}
// 	</td>
// );
