package com.staff_portal.academic_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BatchCycleRequest {
	
		 @NotBlank(message = "Cycle name is required") 
		 String cycleName;
	
}
