package com.staff_portal.academic_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequestDTO {
    private int courseTypeId;
    private String courseCode;
    private String courseName;
}

