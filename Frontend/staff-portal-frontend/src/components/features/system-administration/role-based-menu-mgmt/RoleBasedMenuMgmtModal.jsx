import { ClipboardCheck } from "lucide-react";
import { forwardRef, useImperativeHandle } from "react";

export const RoleBasedMenuMgmtModal = forwardRef(({ roleBasedMenuItem, onSubmit }, ref) => {
	const { id, title, roleName, status } = roleBasedMenuItem || {};

	useImperativeHandle(ref, () => ({
		submit: () => {
			onSubmit({
				id,
				status: status === "ALLOWED" ? "BLOCKED" : "ALLOWED",
			});
		},
		reset: () => {}, // No-op
		isDirty: () => true, // Always allow submit
	}));

	if (!roleBasedMenuItem) return null;

	return (
		<div className='flex flex-col items-center justify-center p-6 text-center'>
			<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100'>
				<ClipboardCheck className='h-8 w-8 text-yellow-600' />
			</div>
			<h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-amber-500'>Change Role's Menu Access Status</h3>
			<p className='max-w-sm text-sm text-gray-500 dark:text-zinc-400'>
				<span className='font-bold text-gray-700 dark:text-gray-300'>{title}</span> is currently
				<span className={`mx-1 font-bold ${status === "ALLOWED" ? "text-green-600" : "text-red-500"}`}>{status}</span>
				for <span className='font-bold text-gray-700 dark:text-gray-300'>{roleName}</span>.
			</p>
			<p className='mt-2 text-sm text-gray-500 dark:text-zinc-400'>
				Clicking "Save" will change the status to{" "}
				<span className={`font-bold ${status === "ALLOWED" ? "text-red-500" : "text-green-600"}`}>
					{status === "ALLOWED" ? "BLOCKED" : "ALLOWED"}
				</span>
				.
			</p>
		</div>
	);
});

RoleBasedMenuMgmtModal.displayName = "RoleBasedMenuMgmtModal";
