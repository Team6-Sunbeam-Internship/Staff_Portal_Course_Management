export const Footer = ({ className = "", ...props }) => {
	const currentYear = new Date().getFullYear();

	return (
		<footer
			className={`bg-white dark:bg-black ${className}`}
			{...props}
		>
			<div className='px-4 sm:px-6 lg:px-8 py-4'>
				<div className='flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0'>
					{/* Left side - Copyright */}
					<div className='flex items-center space-x-4'>
						<p className='text-sm text-gray-500 dark:text-gray-400'>
							© {currentYear} Staff Portal. All rights reserved.
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
