package com.staff_portal.academic_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InfrastructureResponse {

	private int infrastructureId;
    private String roomName;
    private String type;
    private String location;
    private int capacity;
    private String description;
    private int premisesId;
    private String premisesName;
}
