export const ModalBody = ({ children, className = "" }) => (
	<div className={`relative z-10 flex-1 scrollbar-none overflow-y-auto bg-white px-5 py-6 dark:bg-zinc-950 ${className}`}>
		{children}
	</div>
);
