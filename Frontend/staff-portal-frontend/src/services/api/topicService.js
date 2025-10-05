import axiosInstance from "./axiosInstance";

const topicService = {
  // Add Topic
  add: (data) => axiosInstance.post("/topics/add", data),

  // Update Topic
  update: (id, data) => axiosInstance.put(`/topics/update/${id}`, data),

  // Delete Topic
  remove: (id) => axiosInstance.delete(`/topics/delete/${id}`),

  // Get All Topics
  getAll: () => axiosInstance.get("/topics"),

  // Get Topic by ID
  getById: (id) => axiosInstance.get(`/topics/${id}`),

  // Get Topics by Section (like SectionController)
  getBySection: (sectionId) => axiosInstance.get(`/topics/bySection/${sectionId}`),

  // Filter Topics by BatchCycle + CourseType + Course + Module + Subject + Section
  filter: (
    batchCycleId,
    courseTypeId,
    courseId,
    moduleId,
    subjectId,
    sectionId
  ) =>
    axiosInstance.get("/topics/filter", {
      params: {
        batchCycleId,
        courseTypeId,
        courseId,
        moduleId,
        subjectId,
        sectionId,
      },
    }),
};

export default topicService;
