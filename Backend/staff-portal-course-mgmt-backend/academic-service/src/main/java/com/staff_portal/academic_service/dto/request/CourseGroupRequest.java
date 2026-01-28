package com.staff_portal.academic_service.dto.request;

import com.staff_portal.academic_service.enums.CourseGroupStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CourseGroupRequest {
    @NotNull
    private String title;
    private String description;
    @NotNull
    private Integer capacity;
    private CourseGroupStatus status;
}
