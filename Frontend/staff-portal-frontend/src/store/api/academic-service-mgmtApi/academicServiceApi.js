import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

export const academicServiceApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllCourseCoordinatorAssign: builder.query({
			query: (params = {}) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.GET_ALL_ASSIGNMENTS,
				params,
			}),
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		createCourseCoordinatorAssign: builder.mutation({
			query: ({ premiseId: _, ...payload }) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_ASSIGNMENT,
				method: "POST",
				body: payload,
			}),
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ premiseId, ...payload }, { dispatch, queryFulfilled }) {
				// Pessimistic patching
				try {
					const { data: newAssignmentId } = await queryFulfilled;

					// Construct the object to match what 'getAll' returns
					// IMPORTANT: payload MUST include premiseId for the UI lookup to work
					const newEntry = {
						assignmentId: newAssignmentId,
						staffId: payload.staffId,
						courseCode: payload.courseCode,
						// If premiseId is missing in payload, this will be undefined and UI won't update for that row
						premiseId: premiseId,
						courseCoordinatorAssignStatus: payload.assignCourseStatus || "ASSIGNED",
					};

					dispatch(
						academicServiceApi.util.updateQueryData("getAllCourseCoordinatorAssign", undefined, (draft) => {
							draft.push(newEntry);
						})
					);
				} catch {
					// do nothing
				}
			},
		}),
		updateCourseCoordinatorAssign: builder.mutation({
			query: ({ id, payload }) => {
				const { premiseId: _, ...restPayload } = payload;
				return {
					url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_ASSIGNMENT}/${id}`,
					method: "PUT",
					body: restPayload,
				};
			},
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ id, payload }, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceApi.util.updateQueryData("getAllCourseCoordinatorAssign", undefined, (draft) => {
						const index = draft.findIndex((item) => item.assignmentId === id);
						if (index !== -1) {
							// Map request keys to response keys
							draft[index] = {
								...draft[index],
								...payload, // Keep original payload properties just in case
								staffId: payload.staffId,
								courseCoordinatorAssignStatus: payload.assignCourseStatus,
							};
						}
					})
				);

				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		deleteCourseCoordinatorAssign: builder.mutation({
			query: (id) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_ASSIGNMENT}/${id}`,
				method: "DELETE",
			}),
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceApi.util.updateQueryData("getAllCourseCoordinatorAssign", undefined, (draft) => {
						const index = draft.findIndex((item) => item.assignmentId === id);
						if (index !== -1) {
							draft.splice(index, 1);
						}
					})
				);
				try {
					await queryFulfilled; // Wait for the network request to succeed
				} catch {
					// If the network request fails, revert the cache change
					patchResult.undo();
				}
			},
		}),
		getAssignCourseAndModules: builder.query({
			query: (params = {}) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.GET_COURSE_COORD_ASSIGN_COURSE_AND_MODULE_LIST}`,
				params,
			}),
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		// Staff id will be extracted from the token
		getAssignCourse: builder.query({
			query: (params = {}) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.GET_ASSIGN_COURSE}`,
				params,
			}),
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		// get modules belong to the course which is assigned to the coordinator
		// param = course_code (get from getAllCourseCoordinatorAssign in userApi.js)
		// Response: List<ModuleDTO>: module_id, title, module_router_id, subject list
		// this will show all the modules and module router if staff assigned to it (otherwise it will be empty)
		getModulesForCoordinator: builder.query({
			query: (params = {}) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.GET_MODULES_FOR_COORDINATOR}`,
				params,
			}),
			providesTags: ["Modules"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		// assign module to module router
		// param: module_id, module_router_id
		// response: status 200 OK
		assignModuleRouter: builder.mutation({
			query: (body) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.ASSIGN_MODULE}`,
				method: "POST",
				body,
			}),
			providesTags: ["Modules"],
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
	}),
});

export const {
	useGetAllCourseCoordinatorAssignQuery,
	useCreateCourseCoordinatorAssignMutation,
	useUpdateCourseCoordinatorAssignMutation,
	useDeleteCourseCoordinatorAssignMutation,
	useGetAssignCourseAndModulesQuery,
	useGetAssignCourseQuery,
	useGetModulesForCoordinatorQuery,
	useAssignModuleRouterMutation,
	useGetModuleRouterIdsQuery,
} = academicServiceApi;
