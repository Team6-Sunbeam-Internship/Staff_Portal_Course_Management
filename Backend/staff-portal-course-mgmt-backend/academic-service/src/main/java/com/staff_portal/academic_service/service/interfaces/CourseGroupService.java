package com.staff_portal.academic_service.service.interfaces;


import java.util.List;

import com.staff_portal.academic_service.dto.request.CourseGroupRequest;
import com.staff_portal.academic_service.dto.response.CourseGroupResponse;
import com.staff_portal.academic_service.enums.CourseGroupStatus;

public interface CourseGroupService  {
	
	CourseGroupResponse createCourseGroup(CourseGroupRequest request);
    CourseGroupResponse updateCourseGroup(int groupId, CourseGroupRequest request);
    void deleteCourseGroup(int groupId);
    List<CourseGroupResponse> getAllCourseGroups();
    List<CourseGroupResponse> getCourseGroupsByStatus(CourseGroupStatus status);
}
