import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router";
import { setBreadcrumbs } from "../../store";
import { StaffList } from "../../components";

const StaffManagementPage = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/staff-management") {
			dispatch(
				setBreadcrumbs([
					{ title: "Home", path: "/dashboard", icon: "home" },
					{
						label: "Staff Management",
						path: "/staff-management",
						icon: "users",
					},
				])
			);
		}
	}, [dispatch, location.pathname]);

	return (
		<Routes>
			<Route path='staff' element={<StaffList />} />
			<Route path='course_coordinator_assign'element={<CourseCoordinatorAssignmentList/>} />
		</Routes>
	);
};

export default StaffManagementPage;
