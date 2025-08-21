package com.staff_portal.academic_service.service.interfaces;


import com.staff_portal.academic_service.dto.request.CourseGroupRequest;
import com.staff_portal.academic_service.dto.response.CourseGroupResponse;

public interface CourseGroupService  {
	
	CourseGroupResponse createCourseGroup(CourseGroupRequest request);

}
