import { useTheme } from "../../../providers";

const HorizonDivider = () => {
	const { effectiveTheme, themes } = useTheme();
	const isDark = effectiveTheme === themes.DARK;
	const glowColor = isDark ? "rgba(245, 158, 11, 0.15)" : "rgba(14, 165, 233, 0.25)";
	const gradCenter = isDark ? "#fbbf24" : "#0ea5e9";
	const gradEdge = isDark ? "rgba(245, 158, 11, 0)" : "rgba(14, 165, 233, 0)";

	return (
		<div className='h-.5 relative my-3 flex w-full items-center justify-center'>
			<div className='absolute inset-0 h-full w-full rounded-full opacity-60 blur-sm' style={{ backgroundColor: glowColor }} />
			<div
				className='h-[1.5px] w-full rounded-full transition-all duration-500'
				style={{
					background: `radial-gradient(circle, ${gradCenter} 0%, ${gradEdge} 90%)`,
					clipPath: "polygon(0 50%, 50% 10%, 100% 50%, 50% 90%)",
				}}
			/>
		</div>
	);
};

export default HorizonDivider;
