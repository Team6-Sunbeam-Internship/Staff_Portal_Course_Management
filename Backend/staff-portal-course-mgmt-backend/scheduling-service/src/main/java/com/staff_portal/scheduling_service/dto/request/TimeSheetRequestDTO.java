package com.staff_portal.scheduling_service.dto.request;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.staff_portal.scheduling_service.model.TimeSheetStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Setter
@NoArgsConstructor
public class TimeSheetRequestDTO {

	@NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    private LocalDateTime endTime;

    @Size(max = 255)
    private String extraTopic;

    @Size(max = 255)
    private String assignment;

    @NotNull(message = "Log date is required")
    private LocalDate logDate;
    
    @NotNull(message = "Staff ID is required")
    private Long StaffId;

    @Min(1)
    @NotNull(message = "Duration of topic is required")
    private int durationHours;

    @NotBlank
    private TimeSheetStatus status;

    @NotNull
    private TimeSheetCourseModuleRequestDTO courseModule;

    @NotNull
    private TimeSheetTopicRequestDTO topic;

}
