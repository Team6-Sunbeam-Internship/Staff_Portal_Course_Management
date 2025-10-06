import React from "react";

export const Skeleton = React.forwardRef(function Skeleton(
	{
		className = "",
		variant = "rectangular",
		width,
		height,
		animation = "shimmer",
		rounded = "md",
		children,
		...props
	},
	ref
) {
	const getVariantClasses = () => {
		const variants = {
			text: "h-4 w-full",
			title: "h-6 w-3/4",
			subtitle: "h-4 w-1/2",
			circular: "rounded-full aspect-square",
			rectangular: "w-full h-full",
			button: "h-10 w-24",
			avatar: "w-10 h-10 rounded-full",
			card: "h-32 w-full",
			table: "h-8 w-full",
		};
		return variants[variant] || variants.rectangular;
	};

	const getRoundedClasses = () => {
		if (variant === "circular") return "rounded-full";

		const roundedOptions = {
			none: "",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
			full: "rounded-full",
		};
		return roundedOptions[rounded] || roundedOptions.md;
	};

	const getAnimationClasses = () => {
		const animations = {
			shimmer: "skeleton",
			pulse: "animate-pulse bg-gray-200 dark:bg-gray-800",
			wave: "skeleton",
			none: "bg-gray-200 dark:bg-gray-800",
		};
		return animations[animation] || animations.shimmer;
	};

	const baseClasses = [
		getVariantClasses(),
		getRoundedClasses(),
		getAnimationClasses(),
		"transition-smooth",
		className,
	]
		.filter(Boolean)
		.join(" ");

	const style = {
		...(width && {
			width: typeof width === "number" ? `${width}px` : width,
		}),
		...(height && {
			height: typeof height === "number" ? `${height}px` : height,
		}),
		...props.style,
	};

	return (
		<div
			ref={ref}
			className={baseClasses}
			style={style}
			role='status'
			aria-label='Loading content'
			aria-live='polite'
			{...props}
		>
			{children}
		</div>
	);
});

export default Skeleton;
