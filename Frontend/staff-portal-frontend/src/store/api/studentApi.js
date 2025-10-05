import baseApi from "./baseApi";
import API_CONFIG from "../../config/api.config";
export const studentApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getStudents: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STUDENTS.STUDENTS,
				params,
			}),
			providesTags: (result) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "Student",
								id,
							})),
							"Student",
					  ]
					: ["Student"],
			transformResponse: (response) => response.data || response,
		}),
		createStudent: builder.mutation({
			query: (student) => ({
				url: API_CONFIG.ENDPOINTS.STUDENTS.STUDENTS,
				method: "POST",
				body: student,
			}),
			invalidatesTags: ["Student"],
		}),
		updateStudent: builder.mutation({
			query: ({ id, ...student }) => ({
				url: `${API_CONFIG.ENDPOINTS.STUDENTS.STUDENTS}/${id}`,
				method: "PATCH",
				body: student,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "Student", id },
			],
		}),
		deleteStudent: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.STUDENTS.STUDENTS}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [{ type: "Student", id }],
		}),
		importStudents: builder.mutation({
			query: (file) => {
				const formData = new FormData();
				formData.append("file", file);
				return {
					url: API_CONFIG.ENDPOINTS.STUDENTS.IMPORT,
					method: "POST",
					body: formData,
					formData: true,
				};
			},
			invalidatesTags: ["Student"],
		}),
		getCourseGroups: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.STUDENTS.COURSE_GROUPS,
				params,
			}),
			providesTags: (result) =>
				result?.data
					? [
							...result.data.map(({ id }) => ({
								type: "CourseGroup",
								id,
							})),
							"CourseGroup",
					  ]
					: ["CourseGroup"],
			transformResponse: (response) => response.data || response,
		}),
		createCourseGroup: builder.mutation({
			query: (courseGroup) => ({
				url: API_CONFIG.ENDPOINTS.STUDENTS.COURSE_GROUPS,
				method: "POST",
				body: courseGroup,
			}),
			invalidatesTags: ["CourseGroup"],
		}),
		updateCourseGroup: builder.mutation({
			query: ({ id, ...courseGroup }) => ({
				url: `${API_CONFIG.ENDPOINTS.STUDENTS.COURSE_GROUPS}/${id}`,
				method: "PATCH",
				body: courseGroup,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: "CourseGroup", id },
			],
		}),
		deleteCourseGroup: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.STUDENTS.COURSE_GROUPS}/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: (result, error, id) => [
				{ type: "CourseGroup", id },
			],
		}),
		assignStudentToGroup: builder.mutation({
			query: ({ studentId, groupId }) => ({
				url: API_CONFIG.ENDPOINTS.STUDENTS.GROUP_ASSIGNMENTS,
				method: "POST",
				body: { studentId, groupId },
			}),
			invalidatesTags: ["Student", "CourseGroup"],
		}),
		removeStudentFromGroup: builder.mutation({
			query: ({ assignmentId }) => ({
				url: `${API_CONFIG.ENDPOINTS.STUDENTS.GROUP_ASSIGNMENTS}/${assignmentId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Student", "CourseGroup"],
		}),
	}),
	overrideExisting: false,
});
export const {
	useGetStudentsQuery,
	useCreateStudentMutation,
	useUpdateStudentMutation,
	useDeleteStudentMutation,
	useImportStudentsMutation,
	useGetCourseGroupsQuery,
	useCreateCourseGroupMutation,
	useUpdateCourseGroupMutation,
	useDeleteCourseGroupMutation,
	useAssignStudentToGroupMutation,
	useRemoveStudentFromGroupMutation,
} = studentApi;
