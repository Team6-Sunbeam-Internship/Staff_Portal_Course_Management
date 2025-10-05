package com.staff_portal.academic_service.dto.response;

import java.time.LocalDate;
import java.util.UUID;

import com.staff_portal.academic_service.enums.BatchStatus;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchCycleResponse {
	private UUID batchCycleId;
	private String title;
	private String description;
    private Integer year;
	private LocalDate startDate;
	private LocalDate endDate;
	private BatchStatus status;
}
