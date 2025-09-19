import axiosInstance from "./axiosInstance";

const moduleService = {
  // Add Module
  add: (data) => axiosInstance.post("/modules/add", data),

  // Update Module
  update: (id, data) => axiosInstance.put(`/modules/update/${id}`, data),

  // Delete Module
  remove: (id) => axiosInstance.delete(`/modules/delete/${id}`),

  // Get All Modules
  getAll: () => axiosInstance.get("/modules"),

  // Get Module by ID
  getById: (id) => axiosInstance.get(`/modules/${id}`),

  // Filter by BatchCycle + CourseType + Course
  filter: (batchCycleId, courseTypeId, courseId) =>
    axiosInstance.get("/modules/filter", {
      params: { batchCycleId, courseTypeId, courseId },
    }),
};

export default moduleService;
