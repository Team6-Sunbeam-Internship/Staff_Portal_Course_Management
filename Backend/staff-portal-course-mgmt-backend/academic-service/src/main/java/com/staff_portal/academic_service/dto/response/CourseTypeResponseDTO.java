package com.staff_portal.academic_service.dto.response;


import com.staff_portal.academic_service.enums.CourseTypeStatus;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseTypeResponseDTO {
    private int courseTypeId;
    private String typeName;
    private int batchCycleId;
    private String cycleName;
    private String description;
    private CourseTypeStatus status;
    private int premisesId;
}