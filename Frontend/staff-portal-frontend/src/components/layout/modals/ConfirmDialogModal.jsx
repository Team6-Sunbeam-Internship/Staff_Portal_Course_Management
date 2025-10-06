import { AlertTriangle, ClipboardCheck } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "../buttons";

export const ConfirmDialog = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText,
	type = "danger",
}) => {
	if (!isOpen) return null;

	const isDanger = type === "danger";

	return (
		<Modal isOpen={isOpen} onClose={onClose} size='sm'>
			<div className='p-8 bg-red-300 rounded-t-2xl'>
				<div className="flex justify-center items-start space-x-2">
					{isDanger ? (
						<div className=' flex h-12 w-12 items-center justify-center rounded-full bg-red-100'>
							<AlertTriangle className='h-6 w-6 text-red-600' />
						</div>
					) : (
						<div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100'>
							<ClipboardCheck className='h-6 w-6 text-yellow-600' />
						</div>
					)}
					<h3 className='mt-4 text-lg font-semibold text-gray-900 dark:text-red-500'>
						{title}
					</h3>
				</div>

				<div className='mt-2 text-sm text-gray-500 dark:text-rose-900'>
					<p>{message}</p>
				</div>
			</div>
			<div className='flex justify-end p-4 bg-gray-50 dark:bg-slate-900 gap-3 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl'>
				<Button variant='secondary' onClick={onClose}>
					Cancel
				</Button>
				<Button
					variant={isDanger ? "danger" : "blue"}
					onClick={onConfirm}
				>
					{confirmText}
				</Button>
			</div>
		</Modal>
	);
};
