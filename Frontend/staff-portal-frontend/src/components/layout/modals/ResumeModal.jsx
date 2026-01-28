import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { ModalHeader } from "./ModalHeader";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { AlertTriangle, ClipboardCheck } from "lucide-react";
import { Button } from "../buttons";

const formatRemaining = (expiresAt) => {
	const diff = new Date(expiresAt).getTime() - Date.now();
	if (diff <= 0) return "Expired";
	const minutes = Math.floor(diff / 60000);
	const seconds = Math.floor((diff % 60000) / 1000);
	return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const summarizePayload = (payload) => {
	if (!payload || typeof payload !== "object") return "-";

	return Object.entries(payload)
		.slice(0, 3)
		.map(([key, value]) => `${key}: ${String(value)}`)
		.join(", ");
};

const ResumeModal = ({ isOpen, commands = [], onResume, onDiscard }) => {
	const [, forceTick] = useState();

	useEffect(() => {
		if (!isOpen) return;

		const interval = setInterval(() => {
			forceTick((x) => x + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, [isOpen]);

	if (!isOpen) return null;
	return (
		<Modal isOpen={isOpen} onClose={onDiscard} size='lg'>
			<ModalHeader title={"Resume previous actions"} subtitle={"You were logged out while performing the following actions"} onClose={onDiscard} />
			<ModalBody className='space-y-4 bg-white p-6 dark:bg-slate-900'>
				{commands.map((cmd) => {
					const expired = new Date(cmd.expiresAt) < Date.now();
					return (
						<div
							key={cmd.commandId}
							className={`flex items-start justify-between gap-4 rounded-xl border p-4 ${
								expired ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-900/30" : "border-gray-200 dark:border-gray-700"
							}`}>
							{/* Left section */}
							<div className='flex-1 space-y-1'>
								<div className='flex items-center gap-2'>
									<ClipboardCheck className='h-4 w-4 text-blue-600 dark:text-blue-400' />
									<h4 className='font-medium text-gray-900 dark:text-gray-100'>{cmd.commandId}</h4>
									{expired && (
										<span className='flex items-center gap-1 text-xs text-red-600 dark:text-red-400'>
											<AlertTriangle className='h-3 w-3' />
											Expired
										</span>
									)}
								</div>

								<p className='text-sm text-gray-600 dark:text-gray-400'>{summarizePayload(cmd.payload)}</p>

								<div className='flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
									<Clock className='h-3 w-3' />
									{expired ? "This action can no longer be resumed" : `Expires in ${formatRemaining(cmd.expiresAt)}`}
								</div>
							</div>
							{/* Right Section */}
							{!expired && (
								<Button variant='primary' size='sm' onClick={() => onResume(cmd)}>
									Resume
								</Button>
							)}
						</div>
					);
				})}
				<div className='flex justify-end border-t border-gray-200 pt-4 dark:border-gray-700'>
					<Button variant='secondary' onClick={onDiscard}>
						Discard All
					</Button>
				</div>
			</ModalBody>
		</Modal>
	);
};

export default ResumeModal;
