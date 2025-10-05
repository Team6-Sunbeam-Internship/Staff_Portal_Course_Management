package com.staff_portal.academic_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfrastructureRequest {
	@NotBlank
	private String title;
	private String type;
	private int capacity;
	private String description;
	private String premiseId;
}
