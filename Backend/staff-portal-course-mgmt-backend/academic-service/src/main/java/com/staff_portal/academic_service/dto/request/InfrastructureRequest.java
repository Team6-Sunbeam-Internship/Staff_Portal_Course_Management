package com.staff_portal.academic_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfrastructureRequest {
	@NotBlank
	private String title;
	private String type;
	private Integer capacity;
	private String description;
	private UUID premiseId;
}
