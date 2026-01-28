// export const Card = ({ children, className = "" }) => <div className={`rounded-2xl bg-white p-4 dark:bg-black shadow-2xl dark:shadow-amber-300  ${className}`}>{children}</div>;

export const Card = ({ children, className = "" }) => (
	<div className='rounded-2xl shadow-2xs dark:shadow-sky-500'>
		<div className={`rounded-2xl bg-white p-4 dark:bg-black ${className}`}>{children}</div>
	</div>
);
