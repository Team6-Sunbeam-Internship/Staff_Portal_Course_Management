import baseApi from "../baseApi";

export const academicServiceApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getCourseCoordinatorAssign: builder.query({
			query: (params = {}) => ({
				url: "/academic-service/assign-course",
				params,
			}),
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		createCourseCoordinatorAssign: builder.mutation({
			query: (newCourseCoordinatorAssign) => ({
				url: "/academic-service/assign-course",
				method: "POST",
				body: newCourseCoordinatorAssign,
			}),
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(newCourseCoordinatorAssign, { dispatch, queryFulfilled }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const newId = serverResponse.id;
					const completeNewEntry = { ...newCourseCoordinatorAssign, id: newId };
					dispatch(
						academicServiceApi.util.updateQueryData("getCourseCoordinatorAssign", {}, (draft) => {
							draft.unshift(completeNewEntry);
						})
					);
				} catch (error) {
					// do nothing
				}
			},
		}),
		updateCourseCoordinatorAssign: builder.mutation({
			query: (updatedData) => ({
				url: "/academic-service/assign-course",
				method: "PUT",
				body: updatedData,
			}),
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(updatedData, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceApi.util.updateQueryData("getCourseCoordinatorAssign", {}, (draft) => {
						const index = draft.findIndex((item) => item.id === updatedData.id);
						if (index !== -1) {
							draft[index] = { ...draft[index], ...updatedData };
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
		deleteCourseCoordinatorAssign: builder.mutation({
			query: (id) => ({
				url: `/academic-service/assign-course/${id}`,
				method: "DELETE",
			}),
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			async onQueryStarted(id, { dispatch, queryFulfilled }) {
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceApi.util.updateQueryData("getCourseCoordinatorAssign", {}, (draft) => {
						const index = draft.findIndex((item) => item.id === id);
						if (index !== -1) {
							draft.splice(index, 1);
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
		// Staff id will be extracted from the token
		getAssignCourse: builder.query({
			query: (params = {}) => ({
				url: "/academic-service/assign-course",
				params,
			}),
			providesTags: ["AssignCourse"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		// get modules belong to the course which is assigned to the coordinator
		// param = course_code (get from getCourseCoordinatorAssign in userApi.js)
		// Response: List<ModuleDTO>: module_id, title, module_router_id, subject list
		// this will show all the modules and module router if staff assigned to it (otherwise it will be empty)
		getModulesForCoordinator: builder.query({
			query: (params = {}) => ({
				url: "/academic-service/modules",
				params,
			}),
			providesTags: ["Modules"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		// assign module to module router
		// param: module_id, module_router_id
		// response: status 200 OK
		assignModuleRouter: builder.mutation({
			query: (body) => ({
				url: "/academic-service/assign-module",
				method: "POST",
				body,
			}),
			providesTags: ["Modules"],
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
		}),
		
	}),
});

export const { useGetCourseCoordinatorAssignQuery, useCreateCourseCoordinatorAssignMutation, useUpdateCourseCoordinatorAssignMutation, useDeleteCourseCoordinatorAssignMutation, useGetAssignCourseQuery, useGetModulesForCoordinatorQuery, useAssignModuleRouterMutation } = academicServiceApi;
