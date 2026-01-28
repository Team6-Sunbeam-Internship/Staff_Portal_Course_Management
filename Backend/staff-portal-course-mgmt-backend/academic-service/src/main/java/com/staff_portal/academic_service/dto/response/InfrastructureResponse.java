package com.staff_portal.academic_service.dto.response;

import lombok.*;

import java.util.UUID;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfrastructureResponse {
	private UUID id;
    private String title;
    private String type;
    private Integer capacity;
    private String description;
    private UUID premisesId;
    private String premisesTitle;
}
