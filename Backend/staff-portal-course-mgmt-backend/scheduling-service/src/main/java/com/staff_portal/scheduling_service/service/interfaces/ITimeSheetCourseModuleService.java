package com.staff_portal.scheduling_service.service.interfaces;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;

public interface ITimeSheetCourseModuleService {

	TimeSheetCourseModuleResponseDTO createTimeSheetCourseModule(TimeSheetCourseModuleRequestDTO dto);
}
