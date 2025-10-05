// import { useEffect } from "react";
// import { Outlet, useLocation } from "react-router";
// import { useBreadcrumb } from "../../hooks";
// import { RoleGuard } from "../../components";

// const AcademicManagementPage = () => {
// 	const { setBreadcrumbs } = useBreadcrumb();
// 	const location = useLocation();

// 	useEffect(() => {
// 		if (location.pathname === "/academic-management") {
// 			setBreadcrumbs([
// 				{ label: "Academic Management", path: "/academic-management" },
// 			]);
// 		}
// 	}, [setBreadcrumbs, location]);

// 	return (
// 		<RoleGuard allowedRoles={["ADMIN", "COURSE_COORDINATOR"]}>
// 			<Outlet />
// 		</RoleGuard>
// 	);
// };

// export default AcademicManagementPage;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Outlet, Route, Routes, useLocation } from "react-router";
import { setBreadcrumbs } from "../../store";
import {
	CourseList,
	CourseTypeList,
	ModuleList,
	SectionList,
	SubjectList,
	TopicList,
} from "../../components";

const AcademicManagementPage = () => {
	const dispatch = useDispatch();
	const location = useLocation();

	useEffect(() => {
		if (location.pathname === "/academic-management") {
			dispatch(
				setBreadcrumbs([
					{ title: "Home", path: "/dashboard", icon: "home" },
					{
						label: "Academic Management",
						path: "/academic-management",
						icon: "academic-cap",
					},
				])
			);
		}
	}, [dispatch, location.pathname]);
	return (
		<Routes>
			<Route path='course-types' element={<CourseTypeList />} />
			<Route path='courses' element={<CourseList />} />
			<Route path='course/:courseId/modules' element={<ModuleList />} />
			<Route
				path='modules/:moduleId/subjects'
				element={<SubjectList />}
			/>
			<Route
				path='subjects/:subjectId/sections'
				element={<SectionList />}
			/>
			<Route path='sections/:sectionId/topics' element={<TopicList />} />
		</Routes>
	);
};

export default AcademicManagementPage;
