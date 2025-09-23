package com.staff_portal.academic_service.dto.response;

import java.time.LocalDate;

import com.staff_portal.academic_service.enums.CourseStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponseDTO {
    private int courseId;
    private String courseCode;
    private String courseName;
    private CourseStatus status;
    private boolean deleted; 
    private String cycleName;      // from CourseType
    private String courseTypeName;            // from CourseType
    private String premisesName;    // from Premises (through CourseType)
    private LocalDate startDate;
    private LocalDate endDate;
//    private int studentCount;
//    private int groupCount;
}

