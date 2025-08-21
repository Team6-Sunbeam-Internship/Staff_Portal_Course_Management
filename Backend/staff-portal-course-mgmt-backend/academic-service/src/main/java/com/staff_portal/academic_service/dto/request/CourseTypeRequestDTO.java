package com.staff_portal.academic_service.dto.request;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseTypeRequestDTO {
    private String typeName;
    private int batchCycleId;
    private int premisesId;
}