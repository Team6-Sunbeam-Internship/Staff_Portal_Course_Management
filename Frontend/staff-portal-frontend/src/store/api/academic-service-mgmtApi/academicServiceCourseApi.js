/*eslint-disable */
import API_CONFIG from "../../../config/api.config";
import { applyEntityPatch } from "../../../utils/rtkQueryApiPatch/applyEntityPatch";
import { deriveCourseFields } from "../../../utils/rtkQueryApiPatch/courseDerivation";
import baseApi from "../baseApi";
import { batchCycleMgmtApi, premiseMgmtApi } from "../infrastructure-premise-batchcycle-mgmtApi";
import { academicServiceCourseTypeApi } from "./academicServiceCourseTypeApi";

const cleanQueryArgs = (queryArgs) => {
	const cleaned = {};
	for (const key in queryArgs) {
		if (queryArgs[key] !== null && queryArgs[key] !== undefined && queryArgs[key] !== "") {
			cleaned[key] = queryArgs[key];
		}
	}
	return cleaned;
};

export const academicServiceCourseApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getPaginatedCourses: builder.query({
			query: (queryArgs) => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.GET_PAGINATED_COURSES,
				params: cleanQueryArgs(queryArgs),
			}),
			serializeQueryArgs: ({ endpointName, queryArgs }) => {
				const { page, size, ...filters } = queryArgs;
				return endpointName + JSON.stringify(cleanQueryArgs(filters));
			},
			merge: (currentCache, newResponse, { arg }) => {
				if (!newResponse?.content) return newResponse;

				if (arg.page === 0 || !currentCache?.content) return newResponse;

				const existingIds = new Set(currentCache.content.map((c) => c.id));

				const newItems = newResponse.content.filter((c) => !existingIds.has(c.id));
				currentCache.content.push(...newItems);
				currentCache.totalElements = newResponse.totalElements;
				currentCache.totalElements = newResponse.totalPages;
			},
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			providesTags: (result) =>
				result?.content ?
					[...result.content.map(({ id }) => ({ type: "Course", id })), { type: "Course", id: "LIST" }]
				:	[{ type: "Course", id: "LIST" }],
		}),

		createCourse: builder.mutation({
			query: (courseData) => {
				const { payload } = courseData;
				return {
					url: API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_COURSE,
					method: "POST",
					body: payload,
				};
			},
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ currentFilters, payload }, { dispatch, queryFulfilled, getState }) {
				// Pessimitic patching
				try {
					const { data: serverResponse } = await queryFulfilled;
					const state = getState();
					const targetFilters = cleanQueryArgs(currentFilters || {});
					const newEntity = { id: serverResponse };
					const premises = premiseMgmtApi.endpoints.getPremises.select()(state)?.data || [];
					const batchCycles = batchCycleMgmtApi.endpoints.getBatchCycle.select()(state)?.data || [];
					const courseTypes = academicServiceCourseTypeApi.endpoints.getAllCourseTypes.select()(state)?.data || [];
					applyEntityPatch({
						entity: newEntity,
						payload,
						derive: deriveCourseFields(premises, batchCycles, courseTypes),
					});
					dispatch(
						academicServiceCourseApi.util.updateQueryData("getPaginatedCourses", targetFilters, (draft) => {
							if (!draft?.content) return;

							draft.content.push(newEntity);

							draft.totalElements += 1;
						})
					);
				} catch {}
			},
		}),
		updateCourse: builder.mutation({
			query: (updatePayload) => {
				const { id, payload } = updatePayload;
				return {
					url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_COURSE}/${id}`,
					method: "PUT",
					body: payload,
				};
			},
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
			async onQueryStarted(updatePayload, { dispatch, queryFulfilled, getState }) {
				const { id, currentFilters, payload } = updatePayload;
				// Clean the filters
				const targetFilters = cleanQueryArgs(currentFilters || {});

				// Optimistic patching
				const patchResult = dispatch(
					academicServiceCourseApi.util.updateQueryData("getPaginatedCourses", targetFilters, (draft) => {
						const list = draft.content;
						const entity = list.find((course) => course.id === id);
						if (!entity) return;
						const state = getState();
						const premises = premiseMgmtApi.endpoints.getPremises.select()(state)?.data || [];
						const batchCycles = batchCycleMgmtApi.endpoints.getBatchCycle.select()(state)?.data || [];
						const courseTypes = academicServiceCourseTypeApi.endpoints.getAllCourseTypes.select()(state)?.data || [];
						applyEntityPatch({
							entity,
							payload,
							derive: deriveCourseFields(premises, batchCycles, courseTypes),
						});
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
		deleteCourse: builder.mutation({
			query: ({ id }) => ({
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_COURSE}/${id}`,
				method: "DELETE",
			}),
			transformResponse: (response) => response,
			transformErrorResponse: (response) => response,
			async onQueryStarted({ id, currentFilters }, { dispatch, queryFulfilled }) {
				// Clean the filters
				const targetFilters = cleanQueryArgs(currentFilters || {});
				// Optimistic patching
				const patchResult = dispatch(
					academicServiceCourseApi.util.updateQueryData("getPaginatedCourses", targetFilters, (draft) => {
						const list = draft.content;
						const index = list.findIndex((course) => course.id === id);
						if (index !== -1) {
							list.splice(index, 1);
							draft.totalElements -= 1;
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
		// will return courseCode, courseName, batchCycleid: flat object
		// or nested object: {batchCycleId: {courseCode, courseName, batchCycleName, courseTypeId, courseTypeName}}
		getCourses: builder.query({
			query: () => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.GET_ALL_COURSES,
				method: "GET",
			}),
			providesTags: (result) => {
				if (!result) {
					return [{ type: "Course", id: "LIST" }];
				}

				// Flatten the nested object structure to get all courses
				const allCourses = Object.values(result).flatMap((courseTypeObj) => Object.values(courseTypeObj).flat());

				// Create tags for each course plus the LIST tag
				return [...allCourses.map(({ courseCode }) => ({ type: "Course", id: courseCode })), { type: "Course", id: "LIST" }];
			},
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
		getUniqueCourseNames: builder.query({
			query: () => ({
				url: API_CONFIG.ENDPOINTS.ACADEMIC.GET_UNIQUE_COURSE_NAMES,
				method: "GET",
			}),
			providesTags: (result) => {
				if (!result) {
					return [{ type: "Course", id: "LIST" }];
				}

				// Result is a Map<UUID, List<String>> (object with UUID keys)
				// Flatten all course names from all course types
				const allCourseNames = Object.values(result).flatMap((courseNames) => courseNames);

				// Create tags for each unique course name plus the LIST tag
				return [...allCourseNames.map((courseName) => ({ type: "Course", id: courseName })), { type: "Course", id: "LIST" }];
			},
			transformResponse: (response) => response.apiResponse,
			transformErrorResponse: (response) => response,
		}),
	}),
});

export const {
	useGetPaginatedCoursesQuery,
	useCreateCourseMutation,
	useUpdateCourseMutation,
	useDeleteCourseMutation,
	useGetCoursesQuery,
	useGetUniqueCourseNamesQuery,
} = academicServiceCourseApi;
