package com.staff_portal.academic_service.dto.request;

import com.staff_portal.academic_service.enums.Status;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchCycleRequest {

	@NotBlank(message = "Cycle name is required")
	String title;

	private String description;

	@NotNull(message = "Start date is required")
	private LocalDate startDate;

	@NotNull(message = "End date is required")
	private LocalDate endDate;

	@NotNull(message = "Status is required")
	private Status status;
}
