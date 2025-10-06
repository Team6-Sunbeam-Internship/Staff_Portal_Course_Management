import { Home } from "lucide-react";
import React from "react";
import { Link } from "react-router";

export const BreadcrumbItem = React.forwardRef(
	(
		{
			children,
			href,
			isCurrentPage = false,
			isFirst = false,
			separator,
			icon,
			className = "",
			...props
		},
		ref
	) => {
		const baseClasses = ["flex items-center space-x-1", className]
			.filter(Boolean)
			.join(" ");

		const linkClasses = [
			"flex items-center space-x-3 transition-colors ",
			isCurrentPage
				? "text-primary-600 dark:text-primary-400 font-medium cursor-default"
				: "text-neutral-600 dark:text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-400 ",
		]
			.filter(Boolean)
			.join(" ");

		const content = (
			<>
				{isFirst && <Home className='w-4 h-4' />}
				{icon && !isFirst && typeof icon === "string" ? (
					<span className='w-4 h-4 text-center '>{icon}</span>
				) : icon && !isFirst ? (
					icon
				) : null}
				<span className='truncate'>{children}</span>
			</>
		);

		return (
			<li ref={ref} className={baseClasses} {...props}>
				{/* Use Link when a path is present and it is not the current page */}
				{href && !isCurrentPage ? (
					<Link
						to={href}
						className={linkClasses}
						aria-current={isCurrentPage ? "page" : undefined}
					>
						{content}
					</Link>
				) : (
					// Use a span for non-link items (current page or no path)
					<span
						className={linkClasses}
						aria-current={isCurrentPage ? "page" : undefined}
					>
						{content}
					</span>
				)}

				{separator && (
					<span
						className='text-gray-400 dark:text-gray-600'
						aria-hidden='true'
					>
						{separator}
					</span>
				)}
			</li>
		);
	}
);

BreadcrumbItem.displayName = "BreadcrumbItem";

// import { Home, ChevronRight } from "lucide-react";
// import React from "react";
// import { Link } from "react-router"; // Import the Link component

// export const BreadcrumbItem = React.forwardRef(
// 	(
// 		{
// 			children,
// 			href,
// 			isCurrentPage = false,
// 			isFirst = false,
// 			separator,
// 			icon,
// 			className = "",
// 			...props
// 		},
// 		ref
// 	) => {
// 		const baseClasses = ["flex items-center space-x-1", className]
// 			.filter(Boolean)
// 			.join(" ");

// 		const linkClasses = [
// 			"flex items-center space-x-1 transition-colors",
// 			isCurrentPage
// 				? "text-primary-600 dark:text-primary-400 font-medium"
// 				: "text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400",
// 		]
// 			.filter(Boolean)
// 			.join(" ");

// 		const content = (
// 			<>
// 				{isFirst && <Home className='w-4 h-4' />}
// 				{icon && !isFirst ? icon : null}
// 				<span className='truncate'>{children}</span>
// 			</>
// 		);

// 		return (
// 			<li ref={ref} className={baseClasses} {...props}>
// 				{/* Use Link when a path is present and it is not the current page */}
// 				{href && !isCurrentPage ? (
// 					<Link
// 						to={href}
// 						className={`${linkClasses} `}
// 						aria-current={isCurrentPage ? "page" : undefined}
// 					>
// 						{content}
// 					</Link>
// 				) : (
// 					// Use a span for non-link items (current page or no path)
// 					<span
// 						className={`${linkClasses} `}
// 						aria-current={isCurrentPage ? "page" : undefined}
// 					>
// 						{content}
// 					</span>
// 				)}

// 				{separator && (
// 					<span
// 						className='text-gray-400 dark:text-gray-200'
// 						aria-hidden='true'
// 					>
// 						{separator}
// 					</span>
// 				)}
// 			</li>
// 		);
// 	}
// );

// BreadcrumbItem.displayName = "BreadcrumbItem";
