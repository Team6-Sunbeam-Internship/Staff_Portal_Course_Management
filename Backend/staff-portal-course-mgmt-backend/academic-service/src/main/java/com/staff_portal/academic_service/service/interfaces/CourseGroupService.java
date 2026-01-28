package com.staff_portal.academic_service.service.interfaces;

import com.staff_portal.academic_service.dto.request.CourseGroupRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseGroupResponse;

import java.util.List;
import java.util.UUID;

public interface CourseGroupService {

	ApiResponse<List<UUID>> createCourseGroup(String courseCode, List<CourseGroupRequest> courseGroupRequests);

	ApiResponse<String> updateCourseGroup(UUID groupId, CourseGroupRequest request);

	void deleteCourseGroup(UUID groupId);

    ApiResponse<List<CourseGroupResponse>> getAllCourseGroups(String courseCode);
}
