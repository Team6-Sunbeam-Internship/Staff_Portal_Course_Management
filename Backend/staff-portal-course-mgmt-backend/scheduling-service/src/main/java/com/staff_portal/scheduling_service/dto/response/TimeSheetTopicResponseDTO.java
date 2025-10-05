package com.staff_portal.scheduling_service.dto.response;



import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Setter
@NoArgsConstructor
public class TimeSheetTopicResponseDTO {
	
	private Long id;
    private String topicName;
    
	private SimpleTimeSheetResponseDTO timesheet;
}
