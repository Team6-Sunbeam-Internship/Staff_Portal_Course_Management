package com.staff_portal.scheduling_service.dto.response;

import java.util.List;



import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
@Setter
@NoArgsConstructor
public class TimeSheetCourseModuleResponseDTO {

	private Long id;
    private String courseName;
    private String moduleName;

    private List<SimpleTimeSheetResponseDTO> timeSheets;
}