package com.staff_portal.academic_service.dto.request;


import com.staff_portal.academic_service.enums.SubjectStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubjectRequestDTO {
    private String subjectCode;
    private String subjectName;
    private int theoryHours;
    private int practicalHours;
}
