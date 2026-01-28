import { createSelector } from "@reduxjs/toolkit";
import { initialState, staffAdapter, userApi } from "../api";
import { selectUserRole } from "./authSelectors";

const selectStaffResult = userApi.endpoints.getAllStaff.select({});

export const selectStaffData = createSelector([selectStaffResult, selectUserRole], (staffResult, role) => {
	if (role !== "ADMIN") return initialState;
	console.log("StaffResult in selector:", staffResult);
	return staffResult?.data ?? initialState;
});

export const { selectAll: selectAllStaff, selectById: selectStaffById } = staffAdapter.getSelectors((state) => selectStaffData(state));

export const selectCourseCoordinators = createSelector(selectAllStaff, (staff) => staff.filter((s) => s.role === "COURSE_COORDINATOR"));
