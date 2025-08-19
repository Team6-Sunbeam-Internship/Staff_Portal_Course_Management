package com.staff_portal.academic_service.dto.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseTypeResponseDTO {
    private int courseTypeId;
    private String typeName;
    private int batchCycleId;
    private int premisesId;
}