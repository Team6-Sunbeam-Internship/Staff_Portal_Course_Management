package com.staff_portal.scheduling_service.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.staff_portal.scheduling_service.model.SessionStatus;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Setter
@NoArgsConstructor
public class SessionReqRespDTO {
	
	    @NotBlank(message = "title must not be blank")
	    private String title;
   
	    @Future
	    @NotNull(message = "Start time is required")
	    @JsonFormat(pattern = "HH:mm")
	    private LocalTime startTime;
	    
	    @Future
	    @NotNull(message = "End time is required")
	    @JsonFormat(pattern = "HH:mm")
	    private LocalTime endTime;
	    
	    @NotBlank(message = "meeting id must not be blank")
	    private String meetingId;
	    
	    @NotBlank(message = "meeting credentials must not be blank")
	    private String meetingCredentials;

	    private SessionStatus status;

	    @NotBlank(message = "description must not be blank")
	    private String description;

	    @NotBlank(message = "code share token must not be blank")
	    private String codeShareToken;

		@NotNull(message = "Date is required")
		@JsonFormat(pattern = "yyyy-MM-dd")
	    private LocalDate sessionDate;
		
		@NotNull(message = "Staff ID is required")
	    private Long staffId;

}
