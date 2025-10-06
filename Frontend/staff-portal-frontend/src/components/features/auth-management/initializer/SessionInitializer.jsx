import { useEffect, useState } from "react";
import { useFilteredMenu } from "../../../../hooks";
import { DashboardSkeleton, SidebarSkeleton } from "../components/layout";
import { ErrorFallback } from "../components/layout/errorBoundary";

export const SessionInitializer = ({ children }) => {
	const [showSkeletons, setShowSkeletons] = useState(true);
	// 1. Check Session Validity
	// if session is not valid, then redirect to login page (window.location.href=bff login endpoint="http://localhost:8002/login")
	
	// 2. Fetch Dashboard statistics for the current logged in user.
	
	// 3. Fetch Menus (MenuItem, RoleBasedMenuAccess, StaffMenuAccess)
	const { isSidebarLoading, isSidebarLoadingError, error } =
		useFilteredMenu();

	// 4. Fetch Batch Cycle
	
	// 5. Fetch Premises
	
	// 6. Fetch Infrastructure
	
	// 7. Fetch All Staff if user is Admin
	
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowSkeletons(false);
		}, [2000]);
		return () => clearTimeout(timer);
	}, []);
	if (isSidebarLoading || showSkeletons) {
		return (
			<>
				<div className='h-screen bg-gray-200 dark:bg-neutral-900'>
					<div className='flex h-screen overflow-hidden'>
						{/* **FIX: Apply fixed width and flex-shrink to the SidebarSkeleton** */}
						<SidebarSkeleton className='w-80' />
						{/* **FIX: Apply flex-1 to the DashboardSkeleton** */}
						<DashboardSkeleton className='flex-1' />
					</div>
				</div>
			</>
		);
	}
	if (isSidebarLoadingError) {
		return <ErrorFallback errorMessage={error} />;
	}
	return <>{children}</>;
};
