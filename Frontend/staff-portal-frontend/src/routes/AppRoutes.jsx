import React from "react";
import { Route, Routes } from "react-router";

import { Profile } from "../components/features";
import AppLayout from "../layout/appLayout/AppLayout";
import DashboardPage from "../pages/dashboard/DashboardPage";
import {
	AcademicManagementPage,
	InfrastructureManagementPage,
	SystemAdministrationPage,
} from "../pages";
import { StaffManagementPage } from "../pages/staff-management-page";
const AppRoutes = () => {
	return (
		<Routes>
			<Route path='/' element={<AppLayout />}>
				<Route index element={<DashboardPage />} />
				<Route path='dashboard' element={<DashboardPage />} />
				<Route path='profile' element={<Profile />} />
				<Route
					path='academic-management/*'
					element={<AcademicManagementPage />}
				/>
				<Route
					path='infrastructure-management/*'
					element={<InfrastructureManagementPage />}
				/>
				<Route
					path='system-administration/*'
					element={<SystemAdministrationPage />}
				/>
				<Route
					path='staff-management/*'
					element={<StaffManagementPage />}
				/>
			</Route>
		</Routes>
	);
};

export default AppRoutes;
