import axiosInstance from "./axiosInstance";

const CourseService = {
  // Get all courses
  getAll: () => axiosInstance.get("/courses"),

  // Get course by ID
  getById: (id) => axiosInstance.get(`/courses/${id}`),

  // Add new course
  add: (data) => axiosInstance.post("/courses/add", data),

  // Update existing course
  update: (id, data) => axiosInstance.put(`/courses/update/${id}`, data),

  // Delete course
  remove: (id) => axiosInstance.delete(`/courses/delete/${id}`),

  // Filter courses by batchCycleId and courseTypeId
  filterByIds: (batchCycleId, courseTypeId) =>
    axiosInstance.get("/courses/filterByIds", {
      params: { batchCycleId, courseTypeId },
    }),
};

export default CourseService;
