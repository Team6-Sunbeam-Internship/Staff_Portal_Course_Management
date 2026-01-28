package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.enums.CourseGroupStatus;

import lombok.*;
import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseGroupResponse {
	private UUID id;
	private String title;
	private String description;
	private Integer capacity;
	private CourseGroupStatus status;
	private String courseCode;
    private UUID batchCycleId;
    private UUID courseTypeId;
}
