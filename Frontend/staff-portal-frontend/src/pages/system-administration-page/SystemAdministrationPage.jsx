import React from "react";
import {
	MenuManagement,
	RoleBasedMenuMgmt,
	StaffMenuException,
} from "../../components/features";
import { Route, Routes } from "react-router";

const SystemAdministrationPage = () => {
	return (
		<Routes>
			<Route path='menus' element={<MenuManagement />} />
			<Route path='role-menus' element={<RoleBasedMenuMgmt />} />
			<Route path='staff-menu-access' element={<StaffMenuException />} />
		</Routes>
	);
};

export default SystemAdministrationPage;
