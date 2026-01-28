package com.staff_portal.scheduling_service.dto.response;

import com.staff_portal.scheduling_service.model.TimeSheetStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Getter
@ToString
@Setter
@NoArgsConstructor
public class TimeSheetResponseDTO {

    private UUID id;
    private LocalTime startTime;
    private LocalTime endTime;
    private String staffName;
    private String extraTopic;
    private String assignment;
    private LocalDate logDate;
    private int durationHours;
    private TimeSheetStatus status;
    private String batchCycleName;
    private SimpleTimeSheetCourseModuleDTO courseModule;
    private List<SimpleTimeSheetTopicDTO> topics;
}