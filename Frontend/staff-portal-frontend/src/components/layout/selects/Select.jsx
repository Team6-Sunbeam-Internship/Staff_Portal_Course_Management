export const Select = ({ options, error, ...props }) => (
	<div className="w-full px-2 bg-gray-100 rounded-lg focus:outline-green-200"> 
		<select
			className={`block w-full bg-transparent border-collapse border-none rounded-lg ${
				error
					? " focus:ring-red-500 dark:bg-cyan-600"
					: " focus:border-blue-500 focus:ring-blue-500 dark:bg-blue-950 dark:text-gray-200"
			}  px-3 py-2 transition-colors duration-200`}
			{...props}
		>
			{options.map((option) => (
				<option
					className='border-none rounded-2xl dark:text-gray-200'
					key={option.value}
					value={option.value}
				>
					{option.label}
				</option>
			))}
		</select>
	</div>
);
