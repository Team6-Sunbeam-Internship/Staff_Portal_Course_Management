import axiosInstance from "./axiosInstance";

const sectionService = {
  // Add Section
  add: (data) => axiosInstance.post("/sections/add", data),

  // Update Section
  update: (id, data) => axiosInstance.put(`/sections/update/${id}`, data),

  // Delete Section
  remove: (id) => axiosInstance.delete(`/sections/delete/${id}`),

  // Get All Sections
  getAll: () => axiosInstance.get("/sections"),

  // Get Section by ID
  getById: (id) => axiosInstance.get(`/sections/${id}`),

  // Filter Sections by BatchCycle + CourseType + Course + Module + Subject
  filter: (batchCycleId, courseTypeId, courseId, moduleId, subjectId) =>
    axiosInstance.get("/sections/filter", {
      params: { batchCycleId, courseTypeId, courseId, moduleId, subjectId },
    }),

  
//   getBySubject: (subjectId) => axiosInstance.get(`/dropdowns/sections/${subjectId}`),

  getBySubject: (subjectId) => axiosInstance.get(`/sections/by-subject/${subjectId}`),


  // Get Topics by Section (DropdownController)
  getTopics: (sectionId) => axiosInstance.get(`/dropdowns/topics/${sectionId}`),
};

export default sectionService;
