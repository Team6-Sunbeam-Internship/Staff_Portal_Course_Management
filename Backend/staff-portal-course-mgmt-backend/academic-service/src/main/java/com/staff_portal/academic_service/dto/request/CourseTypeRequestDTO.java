package com.staff_portal.academic_service.dto.request;



import com.staff_portal.academic_service.enums.CourseTypeStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseTypeRequestDTO {
    private String typeName;
//    private int batchCycleId;
    private int premisesId;

    private String description;
    private CourseTypeStatus status;
}