export const ContentHeader = ({
	title,
	description,
	actions,
	breadcrumbs,
	className = "",
	...props
}) => {
	return (
		<div
			className={`bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 ${className}`}
			{...props}
		>
			<div className='px-4 sm:px-6 lg:px-8'>
				{/* Breadcrumbs */}
				{breadcrumbs && (
					<div className='py-3 border-b border-secondary-200 dark:border-secondary-700'>
						{breadcrumbs}
					</div>
				)}

				{/* Header content */}
				<div className='py-6'>
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
						<div className='flex-1 min-w-0'>
							{title && (
								<h1 className='text-2xl font-bold text-secondary-900 dark:text-secondary-100 sm:truncate'>
									{title}
								</h1>
							)}
							{description && (
								<p className='mt-2 text-sm text-secondary-600 dark:text-secondary-400'>
									{description}
								</p>
							)}
						</div>

						{actions && (
							<div className='mt-4 sm:mt-0 sm:ml-4 flex-shrink-0'>
								<div className='flex items-center space-x-3'>
									{actions}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
