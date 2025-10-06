import React from "react";
import { ChevronRight } from "lucide-react";
import { selectBreadcrumbItems } from "../../../store/selectors/breadcrumbSelectors";
import { BreadcrumbItem } from "./BreadcrumbItem";
import { useSelector } from "react-redux";
import { getIcon } from "../../../utils";



const Breadcrumb = React.forwardRef(
	(
		{
			separator = <ChevronRight className='w-4 h-4' />,
			maxItems = 8,
			showHome = true,
			className = "",
			...props
		},
		ref
	) => {
		const breadcrumbItems  = useSelector(selectBreadcrumbItems);
		
		if (!breadcrumbItems || breadcrumbItems.length === 0) return null;

		const displayBreadcrumbs = breadcrumbItems.slice(0, maxItems);

		const baseClasses = ["flex items-center space-x-2 text-md", className]
			.filter(Boolean)
			.join(" ");

		return (
			<nav
				ref={ref}
				className={baseClasses}
				aria-label='Breadcrumb'
				{...props}
			>
				<ol className='flex items-center space-x-2'>
					{displayBreadcrumbs.map((breadcrumb, index) => (
						<BreadcrumbItem
							key={breadcrumb.path || index}
							href={breadcrumb.path}
							// isCurrentPage={isCurrentPath(breadcrumb.path)}
							isFirst={index === 0 && showHome}
							separator={
								index < displayBreadcrumbs.length - 1
									? separator
									: null
							}
							icon={getIcon(breadcrumb.icon)}
						>
							{breadcrumb.title}
						</BreadcrumbItem>
					))}
				</ol>
			</nav>
		);
	}
);

Breadcrumb.displayName = "Breadcrumb";

export default Breadcrumb;