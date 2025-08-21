package com.staff_portal.academic_service.dto.response;

import java.time.LocalDate;

import com.staff_portal.academic_service.enums.BatchStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BatchCycleResponse {
	 private int batchCycleId;
	    private String cycleName;
	    private String description;
	    private LocalDate startDate;
	    private LocalDate endDate;
	    private BatchStatus status;
}
