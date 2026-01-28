package com.staff_portal.academic_service.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseCoordinatorAssignCourseResponseDTO {
    private String courseCode;
    private String courseName;
    private boolean isCurrent; // is assign course and modules present in it are current or not
    private List<ModuleResponseDTO> assignCourseModuleList;
}
