package com.staff_portal.academic_service.dto.response;


import com.staff_portal.academic_service.enums.SectionStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionResponseDTO {
    
    private Integer sectionId;
    private String sectionName;
    private SectionStatus status;

                                       // Display hierarchy (only names, no IDs needed here)
    private String subjectName;
    private String moduleName;
    private String courseTypeName;
}
