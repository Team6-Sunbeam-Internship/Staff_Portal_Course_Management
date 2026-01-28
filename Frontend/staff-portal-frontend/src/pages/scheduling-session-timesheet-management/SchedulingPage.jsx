import { Route, Routes } from "react-router";
import {
	ScheduleCalendar,
	ScheduleReport,
	ScheduleTable,
} from "../../components/features";

const SchedulingPage = () => {
	return (
		<Routes>
			<Route path='create-schedule' element={<ScheduleTable />} />
			<Route path='view-schedule-report' element={<ScheduleReport />} />
			<Route path='schedule-calendar' element={<ScheduleCalendar />} />
		</Routes>
	);
};

export default SchedulingPage;
