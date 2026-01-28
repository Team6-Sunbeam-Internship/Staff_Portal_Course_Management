package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.enums.Status;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchCycleResponse {
	private UUID id;
	private String title;
	private String description;
	private LocalDate startDate;
	private LocalDate endDate;
	private Status status;
}
