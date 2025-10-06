package com.staff_portal.academic_service.dto.request;

import java.time.LocalDate;
import java.util.UUID;

import com.staff_portal.academic_service.enums.CourseStatus;

import com.staff_portal.academic_service.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequestDTO {
    private String title;
    private String courseCode;
    private UUID batchCycleId;
    private UUID premiseId;
    private UUID courseTypeId;
    private LocalDate startDate;
    private LocalDate endDate;
    private int studentCount;
    private int groupCount;
    private Status status; //
}
