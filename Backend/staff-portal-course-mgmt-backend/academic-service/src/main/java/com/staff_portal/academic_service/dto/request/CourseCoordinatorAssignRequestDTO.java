package com.staff_portal.academic_service.dto.request;

import com.staff_portal.academic_service.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseCoordinatorAssignRequestDTO {
	private UUID staffId;
	private String courseCode;
	private UUID premiseId;
    private Status assignCourseStatus; // ASSIGNED, UNASSIGNED
}
