package com.staff_portal.academic_service.dto.request;

import com.staff_portal.academic_service.enums.ModuleStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModuleRequestDTO {
    private String moduleCode;
    private String moduleName;
    private int theoryHours;
    private int practicalHours;
}