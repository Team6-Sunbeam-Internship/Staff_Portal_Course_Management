import baseApi from "./baseApi";
import API_CONFIG from "../../config/api.config";
export const academicApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getCourseTypes: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.COURSE_TYPES,
				params,
			}),
			providesTags: (result) =>
				result
					? [
							...result.map(({ id }) => ({
								type: "CourseType",
								id,
							})),
							"CourseType",
					  ]
					: ["CourseType"],
			transformResponse: (result) => result.data || result,
		}),
		createCourseType: builder.mutation({
			query: (courseType) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.COURSE_TYPES,
				method: "POST",
				body: courseType,
			}),
			invalidatesTags: ["CourseType"],
		}),
		updateCourseType: builder.mutation({
			query: ({ id, ...courseType }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.COURSE_TYPES}/${id}`,
				method: "PUT",
				body: courseType,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "CourseType", id },
			],
		}),
		deleteCourseType: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.COURSE_TYPES}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (r, e, id) => [{ type: "CourseType", id }],
		}),
		getCourses: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.COURSES,
				params,
			}),
			providesTags: (result) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "Course",
								id,
							})),
							"Course",
					  ]
					: ["Course"],
			transformResponse: (result) => result.data || result,
		}),
		createCourse: builder.mutation({
			query: (course) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.COURSES,
				method: "POST",
				body: course,
			}),
			invalidatesTags: ["Course", "CourseType"],
		}),
		updateCourse: builder.mutation({
			query: ({ id, ...course }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.COURSES}/${id}`,
				method: "PATCH",
				body: course,
			}),
			invalidatesTags: (r, e, { id }) => [{ type: "Course", id }],
		}),
		deleteCourse: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.COURSES}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Course", id }],
		}),
		getModules: builder.query({
			query: ({ courseId, ...params }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.COURSES}/${courseId}/modules`,
				params,
			}),
			providesTags: (result, error, { courseId }) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "Module",
								id,
							})),
							{ type: "Course", id: courseId },
					  ]
					: [{ type: "Course", id: courseId }],
			transformResponse: (response) => response.data || response,
		}),
		getModulesDetails: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.MODULES,
				params,
			}),
			providesTags: (result) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "Module",
								id,
							})),
							"Module",
					  ]
					: ["Module"],
			transformResponse: (response) => response.data || response,
		}),
		createModule: builder.mutation({
			query: ({ courseId, ...modules }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.COURSES}/${courseId}/modules`,
				method: "POST",
				body: modules,
			}),
			invalidatesTags: (result, error, { courseId }) => [
				"Module",
				{ type: "Course", id: courseId },
			],
		}),
		updateModule: builder.mutation({
			query: ({ id, ...modules }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.MODULES}/${id}`,
				method: "PATCH",
				body: modules,
			}),
			invalidatesTags: (r, e, { id }) => [{ type: "Module", id }],
		}),
		deleteModule: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.MODULES}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (r, e, id) => [{ type: "Module", id }],
		}),
		getSubjects: builder.query({
			query: ({ moduleId, ...params }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.MODULES}/${moduleId}/subjects`,
				params,
			}),
			providesTags: (result, error, { moduleId }) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "Subject",
								id,
							})),
							{ type: "Module", id: moduleId },
					  ]
					: [{ type: "Module", id: moduleId }],
			transformResponse: (response) => response.data || response,
		}),
		createSubject: builder.mutation({
			query: ({ moduleId, ...subjects }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.MODULES}/${moduleId}/subjects`,
				method: "POST",
				body: subjects,
			}),
			invalidatesTags: (result, error, { moduleId }) => [
				"Subject",
				{ type: "Module", id: moduleId },
			],
		}),
		updateSubject: builder.mutation({
			query: ({ id, ...subjects }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.SUBJECTS}/${id}`,
				method: "PATCH",
				body: subjects,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Subject", id },
			],
		}),
		deleteSubject: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.SUBJECTS}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Subject", id }],
		}),
		getSections: builder.query({
			query: ({ subjectId, ...params }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.SUBJECTS}/${subjectId}/sections`,
				params,
			}),
			providesTags: (result, error, { subjectId }) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "Section",
								id,
							})),
							{ type: "Subject", id: subjectId },
					  ]
					: [{ type: "Subject", id: subjectId }],
			transformResponse: (response) => response.data || response,
		}),
		createSection: builder.mutation({
			query: ({ subjectId, ...sections }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.SUBJECTS}/${subjectId}/sections`,
				method: "POST",
				body: sections,
			}),
			invalidatesTags: (result, error, { subjectId }) => [
				"Section",
				{ type: "Subject", id: subjectId },
			],
		}),
		updateSection: builder.mutation({
			query: ({ id, ...sections }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.SECTIONS}/${id}`,
				method: "PATCH",
				body: sections,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Section", id },
			],
		}),
		deleteSection: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.SECTIONS}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Section", id }],
		}),
		getTopics: builder.query({
			query: ({ sectionId, ...params }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.SECTIONS}/${sectionId}/topics`,
				params,
			}),
			providesTags: (result, error, { sectionId }) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "Topic",
								id,
							})),
							{ type: "Section", id: sectionId },
					  ]
					: [{ type: "Section", id: sectionId }],
			transformResponse: (response) => response.data || response,
		}),
		createTopic: builder.mutation({
			query: ({ sectionId, ...topics }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.SECTIONS}/${sectionId}/topics`,
				method: "POST",
				body: topics,
			}),
			invalidatesTags: (result, error, { sectionId }) => [
				"Topic",
				{ type: "Section", id: sectionId },
			],
		}),
		updateTopic: builder.mutation({
			query: ({ id, ...topics }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.TOPICS}/${id}`,
				method: "PATCH",
				body: topics,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: "Topic", id }],
		}),
		deleteTopic: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.TOPICS}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Topic", id }],
		}),
	}),
});
export const {
	useGetCourseTypesQuery,
	useCreateCourseTypeMutation,
	useUpdateCourseTypeMutation,
	useDeleteCourseTypeMutation,
	useGetCoursesQuery,
	useCreateCourseMutation,
	useUpdateCourseMutation,
	useDeleteCourseMutation,
	useGetModulesQuery,
	useGetModulesDetailsQuery,
	useCreateModuleMutation,
	useUpdateModuleMutation,
	useDeleteModuleMutation,
	useGetSubjectsQuery,
	useCreateSubjectMutation,
	useUpdateSubjectMutation,
	useDeleteSubjectMutation,
	useGetSectionsQuery,
	useCreateSectionMutation,
	useUpdateSectionMutation,
	useDeleteSectionMutation,
	useGetTopicsQuery,
	useCreateTopicMutation,
	useUpdateTopicMutation,
	useDeleteTopicMutation,
} = academicApi;
