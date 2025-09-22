import httpClient from "./httpClient";

const CourseGroupFilterService = {
  getCourses: () => httpClient.get("/course-group-filter/courses"),
  getBatchCycles: () => httpClient.get("/course-group-filter/batch-cycles"),
  getStatuses: () => httpClient.get("/course-group-filter/status"),
};

export default CourseGroupFilterService;
