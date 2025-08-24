package com.staff_portal.scheduling_service.dto.request;

import java.time.LocalTime;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString

public class TimeSlotRequestDTO {

	
	
	 
	@NotNull(message = "Start time is required")
	 @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;  
	
	@NotNull(message = "End time is required")
	 @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;
	 
	 @NotBlank(message = "Slotname must not be blank")
    private String slotName;
    

}
