import axiosInstance from "./axiosInstance";

const dropdownService = {
  getBatchCycles: () => axiosInstance.get("/dropdowns/batchcycles"),
  getCourseTypes: () => axiosInstance.get("/dropdowns/coursetypes"),
  getCourses: (batchCycleId, courseTypeId) =>
  axiosInstance.get("/dropdowns/courses", {
    params: { batchCycleId, courseTypeId },
  }),

  // getCourses: (courseTypeId) => axiosInstance.get(`/dropdowns/courses/${courseTypeId}`),
  getModules: (courseId) => axiosInstance.get(`/dropdowns/modules/${courseId}`),
  getSubjects: (moduleId) => axiosInstance.get(`/dropdowns/subjects/${moduleId}`),
  getSections: (subjectId) => axiosInstance.get(`/dropdowns/sections/${subjectId}`),
  getTopics: (sectionId) => axiosInstance.get(`/dropdowns/topics/${sectionId}`)
};

export default dropdownService;
