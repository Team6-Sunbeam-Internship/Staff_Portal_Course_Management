export const FormField = ({ label, children, required, error }) => (
	<div className='space-y-1'>
		<label className='text-sm font-medium text-gray-700 dark:text-gray-950'>
			{label}
			{required && <span className='text-red-500'> *</span>}
		</label>
		{children}
		{error && <p className='mt-1 text-sm text-red-500/90 dark:text-green-500'>{error}</p>}
	</div>
);
