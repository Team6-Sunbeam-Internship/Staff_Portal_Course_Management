/*eslint-disable */
import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

export const academicServiceCourseHierarchyApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getCourseHierarchy: builder.query({
			query: (courseCode) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.GET_COURSE_HIERARCHY}/${courseCode}`,
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			}),
			providesTags: (result, error, courseCode) => [{ type: "CourseHierarchy", id: courseCode }],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),

		importCourseHierarchy: builder.mutation({
			query: ({ courseCode, importFile }) => {
				const formData = new FormData();
				formData.append("importFile", importFile);
				return {
					url: `${API_CONFIG.ENDPOINTS.ACADEMIC.IMPORT_COURSE_HIERARCHY}/${courseCode}`,
					method: "POST",
					body: formData,
					// headers: {
					// 	'Content-Type': 'multipart/form-data'
					// }
				};
			},
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			providesTags: (result, error, courseCode) => {
				return [{ type: "CourseHierarchy", id: courseCode }];
			},
			async onQueryStarted({ courseCode }, { dispatch, queryFulfilled }) {
				// Pessimistic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					dispatch(academicServiceCourseHierarchyApi.util.upsertQueryData("getCourseHierarchy", courseCode, serverResponse));
				} catch (error) {
					// do nothing
				}
			},
		}),
		//--------------------Module Api--------------------
		createModule: builder.mutation({
			query: ({ courseCode, newModule }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_MODULE}/${courseCode}`,
				method: "POST",
				body: newModule,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, newModule }, { dispatch, queryFulfilled }) {
				// Pessimistic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { id: newId, ...newModule };
					dispatch(
						academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
							if (draft.modules) {
								draft.modules.unshift(completeNewEntry);
							}
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		}),
		updateModule: builder.mutation({
			query: ({ courseCode, moduleId, updateModule }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_MODULE}/${courseCode}/${moduleId}`,
				method: "PUT",
				body: updateModule,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, moduleId, updateModule }, { dispatch, queryFulfilled }) {
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
						const index = draft.modules?.findIndex((item) => item.id === moduleId);
						if (index !== -1) {
							draft.modules[index] = updateModule;
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		deleteModule: builder.mutation({
			query: ({ courseCode, moduleId }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_MODULE}/${courseCode}/${moduleId}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, moduleId }, { dispatch, queryFulfilled }) {
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
						const index = draft.modules.findIndex((item) => item.moduleId === moduleId);
						if (index !== -1) {
							draft.modules.splice(index, 1);
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		//--------------------Subject Api--------------------
		createSubject: builder.mutation({
			query: ({ courseCode, moduleId, newSubject }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_SUBJECT}/${courseCode}/${moduleId}`,
				method: "POST",
				body: newSubject,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, newSubject }, { dispatch, queryFulfilled }) {
				// Pessimistic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { ...newSubject, id: newId };
					dispatch(
						academicServiceCourseHierarchyApi.util.updateQueryData("getAcademicServiceCourseHierarchy", courseCode, (draft) => {
							if (draft.subjects) {
								draft.subjects.unshift(completeNewEntry);
							}
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		}),
		updateSubject: builder.mutation({
			query: ({ courseCode, moduleId, subjectId, updatedSubject }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_SUBJECT}/${courseCode}/${moduleId}/${subjectId}`,
				method: "PUT",
				body: updatedSubject,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, subjectId, updatedSubject }, { dispatch, queryFulfilled }) {
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getAcademicServiceCourseHierarchy", courseCode, (draft) => {
						const index = draft.subjects?.findIndex((s) => s.subjectId === subjectId);
						if (index !== -1) {
							draft.subjects[index] = updatedSubject;
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		deleteSubject: builder.mutation({
			query: ({ subjectId }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_SUBJECT}/${subjectId}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, subjectId }, { dispatch, queryFulfilled }) {
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getAcademicServiceCourseHierarchy", courseCode, (draft) => {
						const index = draft.subjects.findIndex((item) => item.subjectId === subjectId);
						if (index !== -1) {
							draft.subjects.splice(index, 1);
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		//--------------------Section Api--------------------
		createSection: builder.mutation({
			query: ({ courseCode, subjectId, newSection }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_SECTION}/${courseCode}/${subjectId}`,
				method: "POST",
				body: newSection,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, newSection }, { dispatch, queryFulfilled }) {
				// Pessimistic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { id: newId, ...newSection };
					dispatch(
						academicServiceCourseHierarchyApi.util.updateQueryData("getAcademicServiceCourseHierarchy", courseCode, (draft) => {
							if (draft.sections) {
								draft.sections.unshift(completeNewEntry);
							}
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		}),
		updateSection: builder.mutation({
			query: ({ courseCode, subjectId, sectionId, updatedSection }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_SECTION}/${courseCode}/${subjectId}/${sectionId}`,
				method: "PUT",
				body: updatedSection,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, sectionId, updatedSection }, { dispatch, queryFulfilled }) {
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getAcademicServiceCourseHierarchy", courseCode, (draft) => {
						const index = draft.sections?.findIndex((s) => s.sectionId === sectionId);
						if (index !== -1) {
							draft.sections[index] = updatedSection;
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		deleteSection: builder.mutation({
			query: ({ courseCode, subjectId, sectionId }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_SECTION}/${courseCode}/${subjectId}/${sectionId}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, sectionId }, { dispatch, queryFulfilled }) {
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getAcademicServiceCourseHierarchy", courseCode, (draft) => {
						const index = draft.sections.findIndex((item) => item.sectionId === sectionId);
						if (index !== -1) {
							draft.sections.splice(index, 1);
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		//--------------------Topic Api--------------------
		createTopic: builder.mutation({
			query: ({ courseCode, subjectId, sectionId, newTopic }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_TOPIC}/${courseCode}/${subjectId}/${sectionId}`,
				method: "POST",
				body: newTopic,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, newTopic }, { dispatch, queryFulfilled }) {
				// Pessimistic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { id: newId, ...newTopic };
					dispatch(
						academicServiceCourseHierarchyApi.util.updateQueryData("getAcademicServiceCourseHierarchy", courseCode, (draft) => {
							if (draft.topics) {
								draft.topics.unshift(completeNewEntry);
							}
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		}),
		updateTopic: builder.mutation({
			query: ({ courseCode, subjectId, sectionId, topicId, updatedTopic }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_TOPIC}/${courseCode}/${subjectId}/${sectionId}/${topicId}`,
				method: "PUT",
				body: updatedTopic,
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, topicId, updatedTopic }, { dispatch, queryFulfilled }) {
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getAcademicServiceCourseHierarchy", courseCode, (draft) => {
						const index = draft.topics?.findIndex((t) => t.topicId === topicId);
						if (index !== -1) {
							draft.topics[index] = updatedTopic;
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		deleteTopic: builder.mutation({
			query: ({ courseCode, subjectId, sectionId, topicId }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_TOPIC}/${courseCode}/${subjectId}/${sectionId}/${topicId}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, topicId }, { dispatch, queryFulfilled }) {
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getAcademicServiceCourseHierarchy", courseCode, (draft) => {
						const index = draft.topics.findIndex((item) => item.topicId === topicId);
						if (index !== -1) {
							draft.topics.splice(index, 1);
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch (error) {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
	}),
});

export const {
	useGetCourseHierarchyQuery,
	useImportCourseHierarchyQuery,
	useCreateModuleMutation,
	useUpdateModuleMutation,
	useDeleteModuleMutation,
	useCreateSubjectMutation,
	useUpdateSubjectMutation,
	useDeleteSubjectMutation,
	useCreateSectionMutation,
	useUpdateSectionMutation,
	useDeleteSectionMutation,
	useCreateTopicMutation,
	useUpdateTopicMutation,
	useDeleteTopicMutation,
} = academicServiceCourseHierarchyApi;
