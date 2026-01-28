package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.dto.request.AddressDTO;
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
	private UUID id;
	private String title;
	private String type;
	private AddressDTO address;
    private String description;
}
