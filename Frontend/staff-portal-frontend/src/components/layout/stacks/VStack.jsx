import React from "react";

export const VStack = (
	(
		{
			children,
			spacing = "md",
			align = "stretch",
			justify = "start",
			divider,
			className = "",
			...props
		},
		ref
	) => {
		const getSpacingClasses = () => {
			if (divider) return "";

			const spacings = {
				none: "space-y-0",
				xs: "space-y-1",
				sm: "space-y-2",
				md: "space-y-4",
				lg: "space-y-6",
				xl: "space-y-8",
			};
			return spacings[spacing] || spacings.md;
		};

		const getAlignClasses = () => {
			const alignments = {
				start: "items-start",
				center: "items-center",
				end: "items-end",
				stretch: "items-stretch",
			};
			return alignments[align] || alignments.stretch;
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
			"flex flex-col",
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
							{index < childArray.length - 1 && divider}
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

VStack.displayName = "VStack";
