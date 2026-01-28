import React from "react";
import { Route, Routes } from "react-router";
import { CourseGroup, CourseTypesList, ModuleRouter, ModuleSubjectManager, SectionTopicManager } from "../../components/features";
import { CourseList } from "../../components/features";

const AcademicManagementPage = () => {
	return (
		<Routes>
			<Route path='course-types' element={<CourseTypesList />} />
			<Route path='course-groups' element={<CourseGroup />} />
			<Route path='courses' element={<CourseList />} />
			<Route path='modules-subjects' element={<ModuleSubjectManager />} />
			<Route path='module-router' element={<ModuleRouter />} />
			<Route path='sections-topics' element={<SectionTopicManager />} />
		</Routes>
	);
};

export default AcademicManagementPage;
