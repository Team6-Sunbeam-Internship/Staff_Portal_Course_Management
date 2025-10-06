import React from "react";

export const HStack = (
	(
		{
			children,
			spacing = "md",
			align = "center",
			justify = "start",
			wrap = false,
			divider,
			className = "",
			...props
		},
		ref
	) => {
		const getSpacingClasses = () => {
			if (divider) return "";

			const spacings = {
				none: "space-x-0",
				xs: "space-x-1",
				sm: "space-x-2",
				md: "space-x-4",
				lg: "space-x-6",
				xl: "space-x-8",
			};
			return spacings[spacing] || spacings.md;
		};

		const getAlignClasses = () => {
			const alignments = {
				start: "items-start",
				center: "items-center",
				end: "items-end",
				stretch: "items-stretch",
				baseline: "items-baseline",
			};
			return alignments[align] || alignments.center;
		};

		const getJustifyClasses = () => {
			const justifications = {
				start: "justify-start",
				center: "justify-center",
				end: "justify-end",
				between: "justify-between",
				around: "justify-around",
				evenly: "justify-evenly",
			};
			return justifications[justify] || justifications.start;
		};

		const baseClasses = [
			"flex",
			wrap ? "flex-wrap" : "",
			getAlignClasses(),
			getJustifyClasses(),
			getSpacingClasses(),
			className,
		]
			.filter(Boolean)
			.join(" ");

		if (divider) {
			const childArray = React.Children.toArray(children);
			return (
				<div ref={ref} className={baseClasses} {...props}>
					{childArray.map((child, index) => (
						<React.Fragment key={index}>
							{child}
							{index < childArray.length - 1 && (
								<div className='flex items-center'>
									{divider}
								</div>
							)}
						</React.Fragment>
					))}
				</div>
			);
		}

		return (
			<div ref={ref} className={baseClasses} {...props}>
				{children}
			</div>
		);
	}
);

HStack.displayName = "HStack";
