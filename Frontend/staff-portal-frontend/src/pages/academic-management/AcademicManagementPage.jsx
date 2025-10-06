import React from "react";
import { Route, Routes } from "react-router";
import {
	CourseGroup,
	CourseTypesList,
	ModuleSubjectList,
	SectionTopicManager,
} from "../../components/features";
import { CourseList } from "../../components/features";

const AcademicManagementPage = () => {
	return (
		<Routes>
			<Route path='course-types' element={<CourseTypesList />} />
			<Route path='courses' element={<CourseList />} />
			<Route path='modules' element={<ModuleSubjectList />} />
			<Route path='sections' element={<SectionTopicManager />} />
			<Route path='course_groups' element={<CourseGroup />} />
		</Routes>
	);
};

export default AcademicManagementPage;
