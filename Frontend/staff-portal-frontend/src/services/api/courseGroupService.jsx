import httpClient from "./httpClient";

const CourseGroupService = {
  getAll: () => httpClient.get("/course-groups"),
  create: (data) => httpClient.post("/course-groups", data),
  update: (id, data) => httpClient.put(`/course-groups/${id}`, data),
  remove: (id) => httpClient.delete(`/course-groups/${id}`),
  getByBatch: (batchId) => httpClient.get(`/course-groups/by-batch/${batchId}`),
  getByCourse: (courseId) =>
    httpClient.get(`/course-groups/by-course/${courseId}`),
  getByStatus: (status) => httpClient.get(`/course-groups/by-status/${status}`),
};

export default CourseGroupService;
