package com.staff_portal.academic_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PremisesResponse {

	private int premisesId;
    private String name;
    private String type;
    private String address;
    private String city;
    private String state;
    private String postalCode;
    private boolean isActive;
}
