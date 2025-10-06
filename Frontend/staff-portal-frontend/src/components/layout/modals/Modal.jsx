export const Modal = ({ isOpen, onClose, children, size = "lg" }) => {
	if (!isOpen) return null;

	const sizeClasses = {
		sm: "max-w-sm",
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
		"2xl": "max-w-2xl",
	};

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/45 overflow-y-auto'
			onClick={onClose}
		>
			<div
				className={`relative w-full rounded-2xl shadow-2xl transition-all transform-gpu scale-100 opacity-100 border-none dark:bg-none mx-auto ${sizeClasses[size]}`}
				onClick={(e) => e.stopPropagation()}
			>
				{children}
			</div>
		</div>
	);
};
