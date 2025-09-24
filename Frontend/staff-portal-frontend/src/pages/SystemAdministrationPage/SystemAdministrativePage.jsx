import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router";
import { setBreadcrumbs } from "../../store";

const SystemAdministrativePage = () => {
	const dispatch = useDispatch();
	const location = useLocation();
	
	useEffect(()=>{
		if (location.pathname === "/system-administrative") {
			dispatch(
				setBreadcrumbs([
					{ title: "Home", path: "/dashboard", icon: "home" },
					{
						label: "System Administrative",
						path: "/system-administrative",
						icon: "cog",
					},
				])
			);
		}
	}, [dispatch, location.pathname]);
	return <Outlet />;
};

export default SystemAdministrativePage;
