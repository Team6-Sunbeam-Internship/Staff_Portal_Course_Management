package com.staff_portal.scheduling_service.service.interfaces;

import java.util.List;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;

public interface ITimeSheetCourseModuleService {

	TimeSheetCourseModuleResponseDTO createTimeSheetCourseModule(TimeSheetCourseModuleRequestDTO dto);
	
	List<TimeSheetCourseModuleResponseDTO> getAllTimeSheetCourseModule();
	
	TimeSheetCourseModuleResponseDTO getTimeSheetCourseModuleById(Long id);
	
	 TimeSheetCourseModuleResponseDTO updateTimeSheetCourseModule(Long id, TimeSheetCourseModuleRequestDTO dto);

	 void deleteTimeSheetCourseModule(Long id);
}
