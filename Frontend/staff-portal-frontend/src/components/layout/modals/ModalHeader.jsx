import { LucideX } from "lucide-react";

export const ModalHeader = ({ title, description, onClose, icon: Icon, variant = "primary" }) => (
	<div className='z-40 flex shrink-0 items-start justify-between rounded-t-[2.5rem] border-b border-zinc-200/60 bg-zinc-50 px-10 py-6 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.02)] dark:border-zinc-800/80 dark:bg-zinc-900/80'>
		<div className='flex gap-5'>
			{Icon && (
				<div
					className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${
						variant === "warning" ?
							"border border-rose-200 bg-rose-100 text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-500"
						:	"border border-amber-200 bg-amber-100 text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-500"
					}`}>
					<Icon size={24} />
				</div>
			)}
			<div>
				<h2 className='text-xl leading-tight font-black tracking-tight text-zinc-900 dark:text-white'>{title}</h2>
				{description && <p className='mt-1 text-[13px] leading-relaxed font-medium text-zinc-500 dark:text-zinc-400'>{description}</p>}
			</div>
		</div>
		<button
			onClick={onClose}
			className='rounded-xl border border-transparent p-2 text-zinc-400 shadow-sm transition-all hover:border-zinc-200 hover:bg-white hover:text-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-white'>
			<LucideX size={20} />
		</button>
	</div>
);
