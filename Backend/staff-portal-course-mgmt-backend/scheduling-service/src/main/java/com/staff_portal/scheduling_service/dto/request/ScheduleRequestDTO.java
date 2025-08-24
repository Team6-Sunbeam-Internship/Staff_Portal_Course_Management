package com.staff_portal.scheduling_service.dto.request;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ScheduleRequestDTO {
	
	
	
    
	 @NotNull(message = "Date is required")
	 @JsonFormat(pattern = "yyyy-MM-dd")
     private LocalDate scheduleDate;
	
	 @NotBlank(message = "Activity must not be blank")
	 private String activity;
	
	@NotNull(message = "Staff ID is required")
     private Long staffId;
     
	@NotNull(message = "Course ID is required")
	 private Long courseId;
	 
	 @NotNull
     private TimeSlotRequestDTO timeSlot;
     
     @NotNull(message = "Module ID is required")
	 private Long moduleId;
	 
	 @NotNull(message = "Infrastructure ID is required")
	 private Long infrastructureId;
	
}
