import { Route, Routes } from "react-router";
import { TimesheetAddEntry, TimesheetApproveLogs, TimesheetMyEntries, TimesheetVerifyLogs } from "../../components/features";

const TimesheetPage = () => {
	return (
		<Routes>
			<Route path='add-entry' element={<TimesheetAddEntry />} />
			<Route path='view-my-logs' element={<TimesheetMyEntries />} />
			<Route path='approved-logs' element={<TimesheetApproveLogs />} />
			<Route path='verify-logs' element={<TimesheetVerifyLogs />} />
		</Routes>
	);
};

export default TimesheetPage;
