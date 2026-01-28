import { Route, Routes } from "react-router";

// import { Profile } from "../components/features";

import { AppLayout } from "../layout/appLayout";
import {
	AcademicManagementPage,
	DashboardPage,
	InfrastructureManagementPage,
	SchedulingPage,
	StaffManagementPage,
	SystemAdministrationPage,
	TimesheetPage,
} from "../pages";

const AppRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<AppLayout />}>
				<Route index element={<DashboardPage />} />
				<Route path='dashboard' element={<DashboardPage />} />
				{/* <Route path='profile' element={<Profile />} /> */}
				<Route path='academic-management/*' element={<AcademicManagementPage />} />
				<Route path='infrastructure-management/*' element={<InfrastructureManagementPage />} />
				<Route path='system-administration/*' element={<SystemAdministrationPage />} />
				<Route path='staff-management/*' element={<StaffManagementPage />} />
				<Route path='scheduling/*' element={<SchedulingPage />} />
				<Route path='timesheet/*' element={<TimesheetPage />} />
			</Route>
		</Routes>
	);
};

export default AppRoutes;
