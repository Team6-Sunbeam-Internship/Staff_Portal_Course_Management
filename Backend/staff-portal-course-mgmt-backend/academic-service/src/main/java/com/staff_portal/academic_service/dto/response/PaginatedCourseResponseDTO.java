package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.enums.Status;
import lombok.*;

import java.util.UUID;

@Builder
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@RequiredArgsConstructor
public class PaginatedCourseResponseDTO {
    private UUID id;
    private String courseCode;
    private String courseName;
    private UUID courseTypeId;
    private String courseTypeName;
    private UUID premiseId;
    private String premiseName;
    private UUID batchCycleId;
    private String batchCycleName;
    private int studentCount;
    private int courseGroupCount;
    private Status courseStatus;
}
