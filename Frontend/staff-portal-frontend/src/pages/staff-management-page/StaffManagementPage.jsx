import React from "react";
import { Route, Routes } from "react-router";
import {
	CourseCoordinatorAssignment,
	StaffList,
} from "../../components/features";

const StaffManagementPage = () => {
	return (
		<Routes>
			<Route path='staff' element={<StaffList />} />
			<Route
				path='coordinator-assignment'
				element={<CourseCoordinatorAssignment />}
			/>
		</Routes>
	);
};

export default StaffManagementPage;
