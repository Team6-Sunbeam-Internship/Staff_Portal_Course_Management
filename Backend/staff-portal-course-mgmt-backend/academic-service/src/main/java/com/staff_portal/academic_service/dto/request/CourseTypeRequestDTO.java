package com.staff_portal.academic_service.dto.request;


import com.staff_portal.academic_service.enums.Status;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseTypeRequestDTO {
    private String title;
    private String description;
    private Status status;
}