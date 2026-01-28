package com.staff_portal.scheduling_service.dto.response;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class ScheduleResponseDTO {
    private UUID id;
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate scheduleDate;
    private String activity;
    private UUID batchCycleId;
    private List<UUID> staffIds;
    private List<UUID> studentGroups;
    private String courseCode;
    private UUID moduleId;
    private UUID infrastructureId;
    private TimeSlotSimpleDTO timeSlot;
}
