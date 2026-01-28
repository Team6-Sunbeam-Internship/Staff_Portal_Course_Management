package com.staff_portal.scheduling_service.dto.response;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@ToString
@Setter
@NoArgsConstructor
public class SimpleTimeSheetCourseModuleDTO {

    private UUID id;
    private String courseName;
    private String moduleName;
}

