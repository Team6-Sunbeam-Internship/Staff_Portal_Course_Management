export const Grid = ({
	children,
	className = "",
	columns = { base: 1, md: 2, lg: 3 },
	
}) => {
	const getGridClasses = () => {
		let classes = `grid-cols-${columns.base}`;
		if (columns.sm) classes += ` sm:grid-cols-${columns.sm}`;
		if (columns.md) classes += ` md:grid-cols-${columns.md}`;
		if (columns.lg) classes += ` lg:grid-cols-${columns.lg}`;
		if (columns.xl) classes += ` xl:grid-cols-${columns.xl}`;
		if (columns["2xl"]) classes += ` 2xl:grid-cols-${columns["2xl"]}`;
		return `grid ${classes}`;
	};
	return (
		<div className={`${getGridClasses()} gap-4 ${className} gap-10 overflow-x-hidden overflow-y-auto p-2`}>
			{children}
		</div>
	);
};
