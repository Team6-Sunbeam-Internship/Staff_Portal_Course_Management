package com.staff_portal.academic_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponseDTO {
    private int courseId;
    private String courseCode;
    private String courseName;
    private String courseTypeName;
}

