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
			transformResponse: (response) => response.apiResponse,
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
			transformResponse: (response) => response.apiResponse,
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
			query: ({ courseCode, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_MODULE}/${courseCode}`,
				method: "POST",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, payload }, { dispatch, queryFulfilled }) {
				// Pessimistic patching
				try {
					const { data: newId } = await queryFulfilled;
					const completeNewEntry = { id: newId, ...payload };
					console.log("New ID: ", newId);
					console.log("New Entry: ", completeNewEntry);
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
			query: ({ id, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_MODULE}/${id}`,
				method: "PUT",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				const { courseCode, id, payload } = arg;
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
						const module = draft.modules?.find((m) => m.id === id);
						if (module) {
							Object.assign(module, payload);
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
			query: ({ id }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_MODULE}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				const { courseCode, id } = arg;
				console.log("Deleting module from cache:", { courseCode, id });

				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
						if (!draft) return;

						// Find subject IDs under this module
						const subjectIds = draft.subjects.filter((s) => s.moduleId === id).map((s) => s.id);

						// Find section IDs under those subjects
						const sectionIds = draft.sections.filter((sec) => subjectIds.includes(sec.subjectId)).map((sec) => sec.id);

						// Delete topics under those sections
						draft.topics = draft.topics.filter((t) => !sectionIds.includes(t.sectionId));

						// Delete sections
						draft.sections = draft.sections.filter((sec) => !subjectIds.includes(sec.subjectId));

						// Delete subjects
						draft.subjects = draft.subjects.filter((s) => s.moduleId !== id);

						// Delete module
						draft.modules = draft.modules.filter((m) => m.id !== id);
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
			query: ({ moduleId, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_SUBJECT}/${moduleId}`,
				method: "POST",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, moduleId, payload }, { dispatch, queryFulfilled }) {
				// Pessimistic patching
				try {
					const { data: newId } = await queryFulfilled;
					const completeNewEntry = { ...payload, id: newId, moduleId };
					dispatch(
						academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
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
			query: ({ id, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_SUBJECT}/${id}`,
				method: "PUT",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ courseCode, id, payload }, { dispatch, queryFulfilled }) {
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
						const subject = draft.subjects?.find((s) => s.id === id);
						if (subject) {
							Object.assign(subject, payload);
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
			query: ({ id }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_SUBJECT}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				const { courseCode, id } = arg;
				console.log("Deleting subject from cache:", { courseCode, id });
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
						if (!draft) return;
						const sectionIds = draft.sections.filter((sec) => sec.subjectId === id).map((sec) => sec.id);
						// delete topics
						draft.topics = draft.topics.filter((t) => !sectionIds.includes(t.sectionId));
						// delete sections
						draft.sections = draft.sections?.filter((s) => s.subjectId !== id);
						// delete subject
						draft.subjects = draft.subjects.filter((s) => s.id !== id);
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
			query: ({ subjectId, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_SECTION}/${subjectId}`,
				method: "POST",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				const { courseCode, subjectId, payload } = args;
				// Pessimistic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse;
					const completeNewEntry = { id: newId, ...payload, subjectId };
					dispatch(
						academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
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
			query: ({ id, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_SECTION}/${id}`,
				method: "PUT",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				const { courseCode, id, payload } = args;
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
						const section = draft.sections?.find((s) => s.id === id);
						if (section) {
							section.title = payload.sectionName;
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
			query: ({ id }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_SECTION}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				const { courseCode, id } = args;
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
						if (!draft) return;
						// delete topics
						draft.topics = draft.topics.filter((t) => t.sectionId !== id);
						// delete section
						draft.sections = draft.sections.filter((s) => s.id !== id);
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
			query: ({ sectionId, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_TOPIC}/${sectionId}`,
				method: "POST",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				const { courseCode, payload, sectionId } = args
				// Pessimistic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse;
					const completeNewEntry = { id: newId, ...payload, sectionId };
					dispatch(
						academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
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
			query: ({ id, payload }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_TOPIC}/${id}`,
				method: "PUT",
				body: payload,
			}),
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				const { courseCode, id, payload } = args;
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
						const topic = draft.topics?.find((t) => t.topicId === id);
						if (topic) {
							Object.assign(topic, payload);
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
			query: ({ id }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_TOPIC}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(args, { dispatch, queryFulfilled }) {
				const { courseCode, id } = args;
				// Optimistic Patching
				const patchResult = dispatch(
					academicServiceCourseHierarchyApi.util.updateQueryData("getCourseHierarchy", courseCode, (draft) => {
						if (!draft) return;
						draft.topics = draft.topics.filter((t) => t.topicId !== id);
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
