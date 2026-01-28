package com.staff_portal.scheduling_service.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.UUID;

@Getter
@ToString
@Setter
@NoArgsConstructor
public class RecordedSessionDTO {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private UUID id;

    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate sessionDate;

    @NotBlank(message = "Channel is required")
    @Size(max = 30, message = "Channel must not exceed 30 characters")
    private String channel;

    @NotBlank(message = "Title is required")
    @Size(max = 30, message = "Title must not exceed 30 characters")
    private String title;

    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;

    @NotBlank(message = "URL is required")
    private String url;

    @NotBlank(message = "Course name is required")
    @Size(max = 30, message = "Course name must not exceed 30 characters")
    private String courseName;

    @NotBlank(message = "Batch cycle name is required")
    @Size(max = 30, message = "Batch cycle name must not exceed 30 characters")
    private String batchCycleName;

    @NotBlank(message = "Staff name is required")
    @Size(max = 30, message = "Staff name must not exceed 30 characters")
    private String staffName;


}
