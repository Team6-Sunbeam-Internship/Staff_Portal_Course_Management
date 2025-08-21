package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.enums.ModuleStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModuleResponseDTO {
    private int moduleId;
    private String moduleName;
    private String courseTypeName;
    private String batchCycleName;
    private String courseName;
    private int staffId;
    private int theoryHours;
    private int practicalHours;
    private ModuleStatus status;
}