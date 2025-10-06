/*eslint-disable */
import API_CONFIG from "../../../config/api.config";
import baseApi from "../baseApi";

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
			merge: (currentCache, newItems, { arg }) => {
				if (arg.page > 0 && currentCache?.content && newItems?.content) {
					currentCache.content.push(...newItems.content);

					currentCache.totalPages = newItems.totalPages;
					currentCache.totalElements = newItems.totalElements;
				} else if (newItems.content) {
					return newItems;
				}
			},
			transformResponse: (response) => response.data || response,
			transformErrorResponse: (response) => response,
			providesTags: (result) =>
				result?.content
					? [...result.conent.map(({ id }) => ({ type: "Course", id })), { type: "Course", id: "LIST" }]
					: [{ type: "Course", id: "LIST" }],
		}),
	}),
	createCourse: builder.mutation({
		query: (courseData) => {
			const { currentFilters, ...newCoursePayload } = courseData;

			return {
				url: API_CONFIG.ENDPOINTS.ACADEMIC.CREATE_COURSE,
				method: "POST",
				body: newCoursePayload,
			};
		},
		transformResponse: (response) => response.data || response,
		transformErrorResponse: (response) => response,
		async onQueryStarted({ currentFilters, ...newCourse }, { dispatch, queryFulfilled }) {
			// Pessimitic patching
			try {
				const { data: serverResponse } = await queryFulfilled;
				const targetFilters = cleanQueryArgs(currentFilters || {});
				const newId = serverResponse.id;
				const completeNewEntry = { ...newCourse, id: newId };
				dispatch(
					academicServiceCourseApi.util.updateQueryData("getPaginatedCourses", targetFilters, (draft) => {
						if (draft.content) {
							draft.content.unshift(completeNewEntry);
							if (draft.totalElements) draft.totatElements += 1;
						}
					})
				);
			} catch (error) {}
		},
	}),
	updateCourse: builder.mutation({
		query: (updatePayload) => {
			const { id, currentFilters, ...updatedCourse } = updatePayload;
			return {
				url: `${API_CONFIG.ENDPOINTS.ACADEMIC.UPDATE_COURSE}/${id}`,
				method: "PUT",
				body: updatedCourse,
			};
		},
		transformResponse: (response) => response.data || response,
		transformErrorResponse: (response) => response,
		async onQueryStarted(updatePayload, { dispatch, queryFulfilled }) {
			const { id, currentFilters, ...updatedCourse } = updatePayload;
			// Clean the filters
			const targetFilters = cleanQueryArgs(currentFilters || {});

			// Optimistic patching
			const patchResult = dispatch(
				academicServiceCourseApi.util.updateQueryData("getPaginatedCourses", targetFilters, (draft) => {
					const list = draft.content || draft;
					const index = list.findIndex((course) => course.id === updatedCourse.id);
					if (index !== -1) {
						list[index] = {
							...list[index],
							...updatedCourse,
						};
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
	deleteCourse: builder.mutation({
		query: ({ id }) => ({
			url: `${API_CONFIG.ENDPOINTS.ACADEMIC.DELETE_COURSE}/${id}`,
			method: "DELETE",
			params: { id },
		}),
		transformResponse: (response) => response.data || response,
		transformErrorResponse: (response) => response,
		async onQueryStarted({ id, currentFilters }, { dispatch, queryFulfilled }) {
			// Clean the filters
			const targetFilters = cleanQueryArgs(currentFilters || {});
			// Optimistic patching
			const patchResult = dispatch(
				academicServiceCourseApi.util.updateQueryData("getPaginatedCourses", targetFilters, (draft) => {
					const list = draft.content || draft;
					const index = list.findIndex((course) => course.id === id);
					if (index !== -1) {
						list.splice(index, 1);
						if (draft.totalElements) draft.totalElements -= 1;
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
		providesTags: (result) =>
			result
				? [...result.map(({ courseCode }) => ({ type: "Course", id: courseCode })), { type: "Course", id: "LIST" }]
				: [{ type: "Course", id: "LIST" }],
		transformResponse: (response) => response.data || response,
		transformErrorResponse: (response) => response,
	}),
	getUniqueCourseNames: builder.query({
		query: () => ({
			url: API_CONFIG.ENDPOINTS.ACADEMIC.GET_UNIQUE_COURSE_NAMES,
			method: "GET",
		}),
		providesTags: (result) =>
			result
				? [...result.map(({ courseName }) => ({ type: "Course", id: courseName })), { type: "Course", id: "LIST" }]
				: [{ type: "Course", id: "LIST" }],
		transformResponse: (response) => response.data || response,
		transformErrorResponse: (response) => response,
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
