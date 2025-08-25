package com.staff_portal.academic_service.service.interfaces;


import java.util.List;

import com.staff_portal.academic_service.dto.request.CourseGroupRequest;
import com.staff_portal.academic_service.dto.response.CourseGroupResponse;
import com.staff_portal.academic_service.enums.CourseGroupStatus;

public interface CourseGroupService  {
	
	CourseGroupResponse createCourseGroup(CourseGroupRequest request);
    CourseGroupResponse updateCourseGroup(int groupId, CourseGroupRequest request);
    void deleteCourseGroup(int groupId);
 // getting all course groups
    List<CourseGroupResponse> getAllCourseGroups();
    
    //for getting course group by status
    List<CourseGroupResponse> getCourseGroupsByStatus(CourseGroupStatus status);
    
 // Fetch course groups by batch cycle name
    List<CourseGroupResponse> getCourseGroupsByBatchCycleName(String cycleName);

    // get course group by course type
    List<CourseGroupResponse> getCourseGroupsByCourseType(String typeName);

   
}
