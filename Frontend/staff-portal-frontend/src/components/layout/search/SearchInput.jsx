import { Search } from "lucide-react";

const SearchInput = ({ label, value, onChange, placeholder = "Search..." }) => {
	return (
		<div className='w-full'>
			{label && (
				<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
					{label}
				</label>
			)}
			<div className='relative'>
				<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
					<Search
						size={20}
						className='text-gray-400 dark:text-gray-500'
					/>
				</div>
				<input
					type='text'
					className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-lg shadow-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors h-[42px]'
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					aria-label={label || placeholder}
				/>
			</div>
		</div>
	);
};

export default SearchInput