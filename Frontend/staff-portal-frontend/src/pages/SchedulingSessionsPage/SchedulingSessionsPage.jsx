import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, Route, Routes, useLocation } from "react-router";
import { setBreadcrumbs } from "../../store";

const SchedulingSessionsPage = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/scheduling-sessions") {
			dispatch(
				setBreadcrumbs([
					{ title: "Home", path: "/dashboard", icon: "home" },
					{
						label: "Scheduling & Sessions",
						path: "/scheduling-sessions",
						icon: "calendar",
					},
				])
			);
		}
	}, [dispatch, location.pathname]);

	return (
		<Routes>
			<Route path='sessions' element={<SessionList />} />
			<Route path='scheduling' element={<SchedulingList />} />
			<Route path='timesheet' element={<TimesheetList />} />
		</Routes>
	);
};

export default SchedulingSessionsPage;
