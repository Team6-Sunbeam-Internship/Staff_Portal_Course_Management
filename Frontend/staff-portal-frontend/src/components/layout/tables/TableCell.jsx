export const TableCell = ({ children, className = "", handleClick }) => (
	<td
		className={` px-6 py-4 whitespace-break-spaces text-sm text-gray-800 dark:text-gray-200 align-middle ${className}`}
		onClick={()=> handleClick && handleClick(children)}
	>
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
