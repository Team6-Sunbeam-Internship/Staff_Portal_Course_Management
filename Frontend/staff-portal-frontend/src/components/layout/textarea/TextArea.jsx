import { useState } from "react";
import { Label } from "../label";

export const TextArea = ({ label, value, onChange, ...props }) => {
	const [isFocused, setIsFocused] = useState(false);
	const isFloating = isFocused || value.length > 0;

	return (
		<div className='group relative mb-5 w-full'>
			<div
				className={`pointer-events-none absolute left-4 z-30 transition-all duration-300 ${isFloating ? "-top-2.5 origin-left scale-98" : "top-3.5 scale-100"}`}>
				<Label isFloating={isFloating}>{label}</Label>
			</div>
			<textarea
				{...props}
				value={value}
				onChange={onChange}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				placeholder=''
				className='outline-none relative z-10 scrollbar-none w-full resize-none overflow-y-auto rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 shadow transition-all duration-300 ease-in-out focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-amber-400'
			/>
		</div>
	);
};

/**
 * <textarea
			className={`mt-1 block w-full rounded-md border-none bg-gray-100 ${
				error ?
					"border-red-300 focus:border-red-500 focus:ring-red-500"
				:	"border-gray-300 placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-blue-950 dark:text-gray-400 "
			} px-3 py-2 shadow-sm transition-colors duration-200`}
			{...props}
		/>
 */
