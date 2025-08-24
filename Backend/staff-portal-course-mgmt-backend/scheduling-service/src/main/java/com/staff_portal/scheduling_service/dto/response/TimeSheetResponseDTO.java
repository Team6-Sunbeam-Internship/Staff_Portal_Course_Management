package com.staff_portal.scheduling_service.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.staff_portal.scheduling_service.model.TimeSheetStatus;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Setter
@NoArgsConstructor
public class TimeSheetResponseDTO {

	private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long staffId;
    private String extraTopic;
    private String assignment;
    private LocalDate logDate;
    private int durationHours;
    private TimeSheetStatus status;

    private TimeSheetCourseModuleResponseDTO courseModule;
    private TimeSheetTopicResponseDTO topic;
}
