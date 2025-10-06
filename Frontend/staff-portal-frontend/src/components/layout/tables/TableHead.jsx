export const TableHead = ({ children }) => (
	<thead className=' bg-blue-50  dark:bg-blue-900/60 text-center'>{children}</thead>
);

import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";

// export const TableHead = ({ children }) => (
// 	<thead className='bg-blue-50 dark:bg-blue-900/60 text-center'>
// 		{children}
// 	</thead>
// );

// export const TableHead = ({ columns }) => {
// 	if (!Array.isArray(columns) || columns.length === 0) {
// 		return null;
// 	}

// 	return (
// 		<thead className='bg-blue-50 dark:bg-blue-900/60 border-b border-gray-200 dark:border-neutral-700/70'>
// 			<TableRow>
// 				{columns.map((column, index) => {
// 					if (!column) return null;

// 					const roundingClass =
// 						index === 0
// 							? "rounded-tl-2xl"
// 							: index === columns.length - 1
// 							? "rounded-tr-2xl"
// 							: "";
// 					return (
// 						<TableHeader
// 							key={column.key}
// 							// The class name, including width, is now passed in via the column object
// 							className={`${roundingClass} ${
// 								column.className || ""
// 							}`}
// 						>
// 							{column.header}
// 						</TableHeader>
// 					);
// 				})}
// 			</TableRow>
// 		</thead>
// 	);
// };
