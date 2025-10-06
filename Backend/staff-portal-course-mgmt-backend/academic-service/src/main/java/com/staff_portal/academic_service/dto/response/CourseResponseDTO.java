package com.staff_portal.academic_service.dto.response;

import java.time.LocalDate;
import java.util.UUID;

import com.staff_portal.academic_service.enums.CourseStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseResponseDTO {
    private String courseCode; // it is unique for every batchcycle
    private String courseName;
    private UUID batchCycleId;
    private String batchCycleName;
    private UUID courseTypeId;
    private String courseTypeName;
    private int maxGroupCount;
    private UUID premiseId;
    private String premiseName;
}

