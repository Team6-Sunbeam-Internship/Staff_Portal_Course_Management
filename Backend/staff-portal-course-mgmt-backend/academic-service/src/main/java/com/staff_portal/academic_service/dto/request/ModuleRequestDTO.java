package com.staff_portal.academic_service.dto.request;

import com.staff_portal.academic_service.enums.ModuleStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModuleRequestDTO {
    private String moduleName;
    private int courseTypeId;
    private int batchCycleId;
    private int courseId;
    private int staffId;
    private int theoryHours;
    private int practicalHours;
    private ModuleStatus status;   // Enum: ACTIVE, INACTIVE
}