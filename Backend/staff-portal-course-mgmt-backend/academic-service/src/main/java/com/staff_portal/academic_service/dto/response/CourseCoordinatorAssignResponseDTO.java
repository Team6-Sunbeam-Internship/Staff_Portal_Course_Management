package com.staff_portal.academic_service.dto.response;

import java.util.UUID;

import com.staff_portal.academic_service.enums.Status;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseCoordinatorAssignResponseDTO {
	private UUID assignmentId;
	private UUID staffId;
	private String courseCode;
	private UUID premiseId;
	private Status courseCoordinatorAssignStatus;
	private String courseName;
	private String premiseName;
	private UUID batchCycleId;
	private String batchCycleName;
}
