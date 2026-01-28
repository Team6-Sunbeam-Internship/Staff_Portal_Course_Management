package com.staff_portal.academic_service.dto.request;

import com.staff_portal.academic_service.enums.SectionStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionRequestDTO {
    private String sectionCode;
    private String sectionName;
}