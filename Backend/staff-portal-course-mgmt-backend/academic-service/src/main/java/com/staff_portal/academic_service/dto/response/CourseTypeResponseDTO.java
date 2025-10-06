package com.staff_portal.academic_service.dto.response;


import com.staff_portal.academic_service.enums.CourseTypeStatus;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseTypeResponseDTO {
    private UUID courseTypeId;
    private String title;
    private String description;
    private CourseTypeStatus status;
}