package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.enums.CourseGroupStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CourseGroupResponse {
	
	private int groupId;
    private String groupName;
    private String description;
    private Integer capacity;
    private CourseGroupStatus status;
    private int courseId;
   // private String courseName;


}
