package com.staff_portal.scheduling_service.dto.request;

import java.time.LocalDate;
import java.util.List;

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
	
	 @NotBlank(message = "Batch Cycle name is required")
     private String batchCycleName;
     
	@NotBlank(message = "Course name is required")
	 private String courseName;
	 
	@NotNull(message = "staff name is required")
	private List<String> staffNames;
	
	@NotNull(message = "Student Group Name is required")
	private List<String> studentGroups;
	
	 @NotNull
     private TimeSlotRequestDTO timeSlot;
     
     @NotBlank(message = "Module Name is required")
	 private String moduleName;
	 
	 @NotBlank(message = "Infrastructure ID is required")
	 private String infrastructureName;
	
}

