package com.staff_portal.scheduling_service.dto.response;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class TimeSlotSimpleDTO {

	private Long id;

	@JsonFormat(pattern = "HH:mm")
	private LocalTime startTime;

	@JsonFormat(pattern = "HH:mm")
	private LocalTime endTime;

	private String slotName;
}
