package com.staff_portal.academic_service.dto.request;

import java.time.LocalDate;

import com.staff_portal.academic_service.enums.BatchStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BatchCycleRequest {

	@NotBlank(message = "Cycle name is required")
	String cycleName;

	private String description;

	@NotNull(message = "Start date is required")
	private LocalDate startDate;

	@NotNull(message = "End date is required")
	private LocalDate endDate;

	@NotNull(message = "Status is required")
	private BatchStatus status;
}
