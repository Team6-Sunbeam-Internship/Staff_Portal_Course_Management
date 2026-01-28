import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import API_CONFIG from "../../../../config/api.config";
import { useFilteredMenu } from "../../../../hooks";
import {
	setAuthUser,
	useCheckSessionQuery,
	useGetAllCourseTypesQuery,
	useGetAllInfrastructureQuery,
	useGetAllMenuItemsQuery,
	useGetAllRoleBasedMenuQuery,
	useGetAllStaffAccessMenuQuery,
	useGetAllStaffQuery,
	useGetBatchCycleQuery,
	useGetPremisesQuery,
} from "../../../../store";
import { DashboardSkeleton, SidebarSkeleton } from "../../../layout";
import { ErrorFallback } from "../../../layout/errorBoundary";

export const SessionInitializer = ({ children }) => {
	const [showSkeletons, setShowSkeletons] = useState(true);
	const dispatch = useDispatch();
	// 1. Check Session Validity = call /bff/session
	// if session is not valid, then redirect to login page (window.location.href=bff login endpoint="http://localhost:8001/login")
	const { data: sessionData, currentData, isLoading: isSessionLoading, isError: isSessionError, error: sessionError } = useCheckSessionQuery();

	const isAuthenticated = sessionData?.authenticated || false;

	const skipQueries = !isAuthenticated || isSessionLoading || isSessionError;

	const isAdmin = isAuthenticated && sessionData?.role === "ADMIN";
	console.log("Session Data:", currentData);
	useEffect(() => {
		if (isAuthenticated) {
			dispatch(setAuthUser(sessionData));
		}
	}, [isAuthenticated, sessionData, dispatch]);

	useEffect(() => {
		if (!isSessionLoading && sessionData && !sessionData.authenticated) {
			window.location.href = API_CONFIG.BFF_BASE_URL + API_CONFIG.ENDPOINTS.AUTH.LOGIN;
		}
	}, [isSessionLoading, sessionData]);
	// 2. Fetch Dashboard statistics for the current logged in user.

	// 3. Fetch Menus (MenuItem, RoleBasedMenuAccess, StaffMenuAccess)
	const { isSidebarLoading, isSidebarLoadingError, error } = useFilteredMenu();

	// 4. Fetch Batch Cycle
	useGetBatchCycleQuery(undefined, { skip: skipQueries || !isAuthenticated });
	// 5. Fetch Premises
	useGetPremisesQuery(undefined, { skip: skipQueries || !isAuthenticated });
	// 6. Fetch Infrastructure
	useGetAllInfrastructureQuery(undefined, { skip: skipQueries || !isAuthenticated });

	// 7. Fetch All Menu Items
	useGetAllMenuItemsQuery(undefined, { skip: skipQueries || !isAdmin });
	// 8. Fetch All RoleMenuAccess Data
	useGetAllRoleBasedMenuQuery(undefined, { skip: skipQueries || !isAdmin });
	// 9. Fetch All StaffMenuAccess Data

	// 10. Fetch All Staff if user is Admin
	useGetAllStaffAccessMenuQuery(undefined, { skip: skipQueries || !isAdmin });
	// 11. Fetch All Course Types
	useGetAllCourseTypesQuery(undefined, { skip: skipQueries || !isAuthenticated });
	// 12. Fetch All Staff
	useGetAllStaffQuery({}, { skip: skipQueries || !isAdmin });
	useEffect(() => {
		const timer = setTimeout(() => {
			setShowSkeletons(false);
		}, [2000]);
		return () => clearTimeout(timer);
	}, []);
	if (isSidebarLoading || showSkeletons) {
		return (
			<>
				<div className='flex h-screen overflow-hidden bg-gray-100 md:flex-row dark:bg-zinc-950'>
					{/* Sidebar Skeleton */}
					<SidebarSkeleton isCollapsed={false} />

					{/* Main Content Area Skeleton */}
					<div className={`z-10 flex flex-1 flex-col overflow-hidden transition-all duration-300`}>
						{/* Header Skeleton Placeholder if needed, or just padding */}
						<div className='scrollbar-none flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8'>
							<DashboardSkeleton />
						</div>
					</div>
				</div>
			</>
		);
	}
	if (isSessionError || isSidebarLoadingError) {
		const errorMessage = isSessionError ? sessionError : error;
		return <ErrorFallback errorMessage={errorMessage} />;
	}
	return <>{children}</>;
};
