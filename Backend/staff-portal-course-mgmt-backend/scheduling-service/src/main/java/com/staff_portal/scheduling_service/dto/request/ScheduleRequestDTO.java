package com.staff_portal.scheduling_service.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@ToString
public class ScheduleRequestDTO {
    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate scheduleDate;

    @NotBlank(message = "Activity must not be blank")
    private String activity;

    @NotBlank(message = "Course code is required")
    private String courseCode;

    @NotEmpty(message = "At least one staff member is required")
    private List<UUID> facultyIds;

    private List<UUID> groupIds;

    @NotNull(message = "Time slot is required")
    private TimeSlotRequestDTO timeSlot;

    @NotNull(message = "Module is required")
    private UUID module;

    @NotNull(message = "Infrastructure is required")
    private UUID infrastructure;
}

