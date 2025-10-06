export const Card = ({ children, className = "" }) => (
	<div
		className={`bg-white dark:bg-neutral-800  rounded-2xl p-4 ${className}`}
	>
		{children}
	</div>
);