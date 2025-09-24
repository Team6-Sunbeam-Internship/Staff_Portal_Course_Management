import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router";
import { setBreadcrumbs } from "../../store";

const StudentOperationsPage = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/student-operations") {
			dispatch(
				setBreadcrumbs([
					{ title: "Home", path: "/dashboard", icon: "home" },
					{
						title: "Student Operations",
						path: "/student-operations",
						icon: "user-group",
					},
				])
			);
		}
	}, [dispatch, location.pathname]);

	return <Outlet />;
};

export default StudentOperationsPage;