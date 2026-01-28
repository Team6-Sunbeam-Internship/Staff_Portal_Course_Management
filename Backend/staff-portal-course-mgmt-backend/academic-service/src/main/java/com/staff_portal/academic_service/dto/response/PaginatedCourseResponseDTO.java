package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.enums.Status;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class PaginatedCourseResponseDTO {
    private UUID id;
    private String courseCode;
    private String title;
    private UUID courseTypeId;
    private String courseTypeName;
    private UUID premiseId;
    private String premiseName;
    private UUID batchCycleId;
    private String batchCycleName;
    private int studentCount;
    private int courseGroupCount;
    private Status courseStatus;
    private LocalDate startDate;
    private LocalDate endDate;
}
