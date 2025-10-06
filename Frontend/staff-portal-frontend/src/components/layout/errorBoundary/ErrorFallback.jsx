/**
 * A functional component to display a custom error message.
 * This component acts as a "fallback" UI when an error state is detected.
 * @param {{ errorMessage: string }} props
 */
export const ErrorFallback = ({ errorMessage }) => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-red-50 text-red-800 p-8'>
			<div className='text-center p-6 border border-red-300 rounded-lg shadow-lg bg-white max-w-md'>
				<h2 className='text-2xl font-bold mb-4'>
					Oops! Something went wrong.
				</h2>
				<p className='text-lg mb-2'>
					We're having trouble loading the application.
				</p>
				{errorMessage && (
					<p className='text-sm font-mono text-red-600 bg-red-100 p-2 rounded mt-4'>
						Error: {errorMessage}
					</p>
				)}
				<p className='mt-4'>
					Please try refreshing the page or contact support if the
					problem persists.
				</p>
			</div>
		</div>
	);
};

