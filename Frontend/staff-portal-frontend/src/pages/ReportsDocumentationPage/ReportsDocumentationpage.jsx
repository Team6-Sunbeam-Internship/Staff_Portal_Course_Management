import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router";
import { setBreadcrumbs } from "../../store";

const ReportsDocumentationPage = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/reports-documentation") {
			dispatch(
				setBreadcrumbs([
					{ title: "Home", path: "/dashboard", icon: "home" },
					{
						label: "Reports & Documentation",
						path: "/reports-documentation",
						icon: "document",
					},
				])
			);
		}
	}, [dispatch, location.pathname]);

	return <Outlet />;
};

export default ReportsDocumentationPage;
