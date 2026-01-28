import Breadcrumb from "../../../../../../staff-portal-course-mgmt-frontend/src/components/layout/Breadcrumb/Breadcrumb";
import { MainContentHeader } from "./MainContentHeader";
import { selectBreadcrumbItems } from "../../../../../../staff-portal-course-mgmt-frontend/src/store/selectors/breadcrumbSelectors";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
const MainContent = ({
	children,

	className = "",
	...props
}) => {
	const breadcrumbItems = useSelector(selectBreadcrumbItems);
	const location = useLocation();
	if (location.pathname === "dashboard") {
		breadcrumbItems.length = 0;
	}
	const baseClasses = [
		"flex flex-col flex-1 min-h-0 bg-gray-100 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 p-4 sm:p-6 lg:p-8 gap-2",
		className,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<main className={baseClasses} {...props}>
			{/* Breadcrumb navigation */}
			{breadcrumbItems && breadcrumbItems.length > 0 && (
				<div className='bg-white dark:bg-black rounded-lg px-4 sm:px-6 lg:px-8 py-3'>
					<Breadcrumb />
				</div>
			)}
			{/* content header */}
			<MainContentHeader />
			{/* Main content area */}
			<div className='flex-1 overflow-y-auto scrollbar-none mt-1 relative'>
				<div>{children}</div>
			</div>
		</main>
	);
};

export default MainContent;
