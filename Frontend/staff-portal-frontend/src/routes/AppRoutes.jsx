import React from "react";
import { Routes, Route } from "react-router-dom";
import CourseGroupPage from "../pages/coursegroup/CourseGroupPage";

const AppRoutes = () => (
  <Routes>
    <Route path="/course-groups" element={<CourseGroupPage />} />
  </Routes>
);

export default AppRoutes;
