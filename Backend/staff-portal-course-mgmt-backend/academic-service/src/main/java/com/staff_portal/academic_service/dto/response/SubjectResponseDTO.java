package com.staff_portal.academic_service.dto.response;


import com.staff_portal.academic_service.enums.SubjectStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubjectResponseDTO {

    private int subjectId;
    private String subjectName;
    private SubjectStatus status;
    private boolean deleted;
    private String moduleName;   // from Module
    private String courseName;   // from Course (via Module)
    
}
