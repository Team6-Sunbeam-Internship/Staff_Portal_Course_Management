package com.staff_portal.academic_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@Builder
public class PremiseResponse {
	private UUID premisesId;
	private String title;
	private String type;
	private String address;
    private String description;
}
