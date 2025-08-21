package com.staff_portal.academic_service.dto.request;


import com.staff_portal.academic_service.enums.SubjectStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubjectRequestDTO {

    private int moduleId;        // dropdown (select module)
    private String subjectName;  // title
    private String facultyName;  // faculty
    private SubjectStatus status;       // ACTIVE / INACTIVE
}
