package com.staff_portal.academic_service.dto.request;

import com.staff_portal.academic_service.enums.CourseGroupStatus;

import jakarta.validation.constraints.NotBlank;
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
	private Integer courseId;

	@NotBlank
	private String groupName;

	@NotNull
	private Integer capacity;

	private String description;

	private Integer batchCycleId;

	@NotNull
	private CourseGroupStatus status;
}
