export const EmptyState = ({ title, description, icon, action }) => (
	<div className=' text-center p-8'>
		<div className='flex justify-center text-gray-400 dark:text-gray-600 mb-4'>
			{icon}
		</div>
		<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
			{title}
		</h3>
		<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
			{description}
		</p>
		{action && <div className='mt-4'>{action}</div>}
	</div>
);
