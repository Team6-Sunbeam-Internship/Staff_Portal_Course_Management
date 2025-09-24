export const Footer = ({ className = "", ...props }) => {
	const currentYear = new Date().getFullYear();

	return (
		<footer
			className={`bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 ${className}`}
			{...props}
		>
			<div className='px-4 sm:px-6 lg:px-8 py-4'>
				<div className='flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0'>
					{/* Left side - Copyright */}
					<div className='flex items-center space-x-4'>
						<p className='text-sm text-secondary-500 dark:text-secondary-400'>
							© {currentYear} Staff Portal. All rights reserved.
						</p>
					</div>

					{/* Right side - Links */}
					<div className='flex items-center space-x-4'>
						<a
							href='/help'
							className='text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
						>
							Help
						</a>
						<a
							href='/privacy'
							className='text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
						>
							Privacy
						</a>
						<a
							href='/terms'
							className='text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
						>
							Terms
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
