package com.staff_portal.academic_service.dto.request;

import jakarta.validation.constraints.NotBlank;

public class BatchCycleRequest {

	public BatchCycleRequest() {
		 @NotBlank(message = "Cycle name is required") 
		 String cycleName;
	}

}
