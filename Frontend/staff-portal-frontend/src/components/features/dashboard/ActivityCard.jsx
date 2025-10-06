export const ActivityCard = ({ title, children }) => (
	<div className='bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-md transition-shadow hover:shadow-lg col-span-1 overflow-auto-y scrollbar-none'>
		<h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>
			{title}
		</h3>
		<div className='space-y-4'>{children}</div>
	</div>
);
