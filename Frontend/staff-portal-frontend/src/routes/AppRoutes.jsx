import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CourseTypePage from "../pages/courses/CourseTypePage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/course-types" element={<CourseTypePage />} />
        {/* other routes */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
