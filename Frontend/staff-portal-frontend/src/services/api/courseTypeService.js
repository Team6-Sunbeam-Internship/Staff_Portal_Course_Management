// src/api/courseTypeService.js
// src/api/courseTypeService.js
import axiosInstance from "./axiosInstance";

const CourseTypeService = {
  // Get all course types
  getAll: () => axiosInstance.get("/coursetypes"),

  // Get a course type by ID
  getById: (id) => axiosInstance.get(`/coursetypes/${id}`),

  // Add new course type
  add: (data) => axiosInstance.post("/coursetypes/add", data),

  // Update course type
  update: (id, data) => axiosInstance.put(`/coursetypes/update/${id}`, data),

  // Delete course type
 remove: (id) => axiosInstance.delete(`/coursetypes/delete/${id}`),

};

export default CourseTypeService;
