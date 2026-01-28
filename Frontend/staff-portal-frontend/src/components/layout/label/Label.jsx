import React from "react";

export const Label = ({ children, variant = "default", isFloating = false }) => (
	<label className={`block font-black uppercase tracking-[0.2em] transition-all duration-200 pointer-events-none ${isFloating ? 'text-[10px] bg-white dark:bg-zinc-950 px-2' : 'text-[12px]'} ${variant === 'error' ? 'text-rose-500' : 'text-zinc-500 dark:text-amber-500/60'}`}>{children}</label>
);
