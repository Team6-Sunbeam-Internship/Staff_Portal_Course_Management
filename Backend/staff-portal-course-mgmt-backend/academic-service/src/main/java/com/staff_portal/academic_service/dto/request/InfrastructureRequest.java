package com.staff_portal.academic_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InfrastructureRequest {
	
	 private String roomName;
	    private String type;
	    private String location;
	    private int capacity;
	    private String description;
	    private int premisesId;

}
