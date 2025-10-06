import { Skeleton } from "./Skeleton";

export function SkeletonList({
	items = 5,
	spacing = "md",
	className = "",
	itemProps = {},
}) {
	const getSpacingClass = () => {
		const spacingOptions = {
			sm: "space-y-1",
			md: "space-y-2",
			lg: "space-y-3",
			xl: "space-y-4",
		};
		return spacingOptions[spacing] || spacingOptions.md;
	};

	return (
		<div className={`${getSpacingClass()} ${className}`}>
			{Array.from({ length: items }, (_, index) => (
				<div key={index} className='flex items-center space-x-3 p-3'>
					<Skeleton variant='avatar' {...itemProps} />
					<div className='flex-1 space-y-2'>
						<Skeleton variant='title' />
						<Skeleton variant='text' className='w-3/4' />
					</div>
				</div>
			))}
		</div>
	);
}
