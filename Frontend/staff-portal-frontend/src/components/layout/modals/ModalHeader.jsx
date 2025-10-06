import { Plus } from "lucide-react";

export const ModalHeader = ({ title, subtitle, onClose }) => (
	<div className='flex justify-between items-center p-6 border-none bg-gray-300 dark:bg-blue-950/95 rounded-t-2xl'>
		<div>
			<h3 className='text-xl font-semibold text-gray-900 dark:text-blue-300'>
				{title}
			</h3>
			{subtitle && (
				<p className='mt-1 text-sm text-gray-500 dark:text-sky-400'>
					{subtitle}
				</p>
			)}
		</div>
		{onClose && (
			<button
				onClick={onClose}
				className='text-gray-400 hover:text-gray-600 dark:hover:text-rose-500 cursor-pointer'
				aria-label='Close modal'
			>
				<Plus size={24} className='transform rotate-45 ' />
			</button>
		)}
	</div>
);
