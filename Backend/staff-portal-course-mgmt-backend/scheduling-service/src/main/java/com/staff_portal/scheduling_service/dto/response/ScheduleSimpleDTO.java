package com.staff_portal.scheduling_service.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ScheduleSimpleDTO {

	private Long id;

	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate scheduleDate;

	private String activity;
	 private String batchCycleName;
	 private List<String> staffNames;
	 private List<String> studentGroups;
	private String courseName;
	private String moduleName;
	private String infrastructureName;
	

}

