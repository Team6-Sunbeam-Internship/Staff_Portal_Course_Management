import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

export const Tooltip = ({ label, children, targetRef, onSelectActiveId }) => {
	const navigate = useNavigate();
	const [coords, setCoords] = useState({ top: 0, left: 0 });
	const contentRef = useRef(null);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (targetRef.current) {
			const rect = targetRef.current.getBoundingClientRect();
			setCoords({ top: rect.top, left: rect.right + 5 });
		}
		if (contentRef.current) {
			setDimensions({ width: contentRef.current.offsetWidth, height: contentRef.current.offsetHeight });
		}
	}, [targetRef]);

	const growthVariants = {
		hidden: { width: 0, height: 0, opacity: 0, clipPath: "inset(0% 100% 100% 0%)" },
		visible: {
			width: dimensions.width || "auto",
			height: dimensions.height || "auto",
			opacity: 1,
			clipPath: "inset(0% 0% 0% 0%)",
			transition: {
				width: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
				height: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
				opacity: { duration: 0.2 },
				clipPath: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
			},
		},
		exit: { width: 0, height: 0, opacity: 0, clipPath: "inset(0% 100% 100% 0%)", transition: { duration: 0.3, ease: "easeInOut" } },
	};

	return (
		<motion.div
			variants={growthVariants}
			initial='hidden'
			animate='visible'
			exit='exit'
			className={`border-1 border-[#e2e8f0] bg-[#ffffff] shadow-[0_25px_50px_-12px_rgba(148,163,184,0.3)] dark:border-[#262626] dark:bg-[#171717] dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]`}
			style={{
				position: "fixed",
				top: coords.top,
				left: coords.left,
				pointerEvents: "auto",
				zIndex: 9999,
				overflow: "hidden",
				borderRadius: "12px",
			}}>
			<div
				ref={contentRef}
				style={{
					width: "max-content",
					minWidth: "180px",
					padding: "16px",
					visibility: dimensions.width === 0 ? "hidden" : "visible",
				}}>
				<div
					className={`text-xs font-bold tracking-widest uppercase ${children ? "mb-2 text-left " : "flex flex-col justify-center"} text-sky-600 dark:text-amber-500`}>
					<span>{label}</span>
				</div>
				{children && children.length > 0 && (
					<div className={`mt-2 space-y-2 border-t border-slate-100 pt-3 dark:border-neutral-800`}>
						{children.map((child) => (
							<button
								key={child.id}
								onClick={() => {
									onSelectActiveId(child?.path);
									navigate(child?.path);     
								}}
								className={`cursor-pointer flex items-center gap-2 text-[13px] whitespace-nowrap text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white`}>
								{/** w-full rounded-md p-1.5*/}
								<div className={`h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500 dark:bg-amber-600`} />
								{child.label}
							</button>
						))}
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default Tooltip;
