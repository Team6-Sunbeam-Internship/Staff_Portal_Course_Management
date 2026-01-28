package com.staff_portal.scheduling_service.service.interfaces;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;

import java.util.List;
import java.util.UUID;

public interface ITimeSheetCourseModuleService {

    TimeSheetCourseModuleResponseDTO createTimeSheetCourseModule(TimeSheetCourseModuleRequestDTO dto);

    List<TimeSheetCourseModuleResponseDTO> getAllTimeSheetCourseModule();

    TimeSheetCourseModuleResponseDTO getTimeSheetCourseModuleById(UUID id);

    TimeSheetCourseModuleResponseDTO updateTimeSheetCourseModule(UUID id, TimeSheetCourseModuleRequestDTO dto);

    void deleteTimeSheetCourseModule(UUID id);
}
