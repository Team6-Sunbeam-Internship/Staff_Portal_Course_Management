package com.staff_portal.scheduling_service.service.implementation;

import org.springframework.beans.factory.annotation.Autowired;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;
import com.staff_portal.scheduling_service.mapper.TimeSheetCourseModuleMapper;
import com.staff_portal.scheduling_service.model.TimeSheetCourseModule;
import com.staff_portal.scheduling_service.repository.TimeSheetCourseModuleRepository;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetCourseModuleService;

public class TimeSheetCourseModuleServiceImpl implements ITimeSheetCourseModuleService {

	@Autowired
	private TimeSheetCourseModuleRepository courseModuleRepository;

	
	
	@Override
	public TimeSheetCourseModuleResponseDTO createTimeSheetCourseModule(TimeSheetCourseModuleRequestDTO dto) {
		
		TimeSheetCourseModule entity = TimeSheetCourseModuleMapper.toEntity(dto);
	    TimeSheetCourseModule saved = courseModuleRepository.save(entity);
	    return TimeSheetCourseModuleMapper.toDto(saved);
		
	}

}


