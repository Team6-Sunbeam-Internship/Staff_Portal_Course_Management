package com.staff_portal.academic_service.dto.request;

import java.time.LocalDate;

import com.staff_portal.academic_service.enums.CourseStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//@Setter
//@Getter
//@NoArgsConstructor
//@AllArgsConstructor
//public class CourseRequestDTO {
//    private int courseTypeId;
//    private String courseCode;
//    private String courseName;
//    private CourseStatus status;
//}
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequestDTO {
    private String courseCode;
    private String courseName;
    private int courseTypeId;          // FK → CourseType
    private LocalDate startDate;       // new
    private LocalDate endDate;         // new
    private CourseStatus status;       // new (Enum)
}
