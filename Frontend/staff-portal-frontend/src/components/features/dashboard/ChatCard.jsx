export const ChartCard = ({ title, children }) => (
	<div className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-md transition-shadow hover:shadow-lg col-span-1 lg:col-span-2'>
		<h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>
			{title}
		</h3>
		{children}
	</div>
);
