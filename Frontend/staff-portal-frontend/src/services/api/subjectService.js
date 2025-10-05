import axiosInstance from "./axiosInstance";

const subjectService = {
  // Add Subject
  add: (data) => axiosInstance.post("/subjects/add", data),

  // Update Subject
  update: (id, data) => axiosInstance.put(`/subjects/update/${id}`, data),

  // Delete Subject
  remove: (id) => axiosInstance.delete(`/subjects/delete/${id}`),

  // Get All Subjects
  getAll: () => axiosInstance.get("/subjects"),

  // Get Subject by ID
  getById: (id) => axiosInstance.get(`/subjects/${id}`),

  // Filter Subjects by BatchCycle + CourseType + Course + Module
  filter: (batchCycleId, courseTypeId, courseId, moduleId) =>
    axiosInstance.get("/subjects/filter", {
      params: { batchCycleId, courseTypeId, courseId, moduleId },
    }),
};

export default subjectService;
