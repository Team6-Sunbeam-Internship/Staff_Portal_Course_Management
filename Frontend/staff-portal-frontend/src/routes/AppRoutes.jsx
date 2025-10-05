import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CourseTypePage from "../pages/courses/CourseTypePage";
import CoursePage from "../pages/courses/CoursePage";
import ModulePage from "../pages/courses/ModulePage";
import SubjectPage from "../pages/courses/SubjectPage";
import SectionPage from "../pages/courses/SectionPage";
import TopicPage from "../pages/courses/TopicPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/course-types" element={<CourseTypePage />} />
         {/* Course Routes */}
      <Route path="/courses" element={<CoursePage />} />
        {/* Module Management */}
        <Route path="/modules" element={<ModulePage />} />
        {/* Subject Management */}
         <Route path="/subjects" element={<SubjectPage />} />
         {/* Section Management (subjectId comes from URL param) */}
        <Route path="/sections/:subjectId" element={<SectionPage />} />
        {/* Topics Page */}
        <Route path="/topics/:sectionId" element={<TopicPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
