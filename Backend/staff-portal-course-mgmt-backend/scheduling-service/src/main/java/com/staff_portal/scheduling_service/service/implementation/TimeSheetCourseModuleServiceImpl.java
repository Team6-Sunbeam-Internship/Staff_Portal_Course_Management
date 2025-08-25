package com.staff_portal.scheduling_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;
import com.staff_portal.scheduling_service.mapper.TimeSheetCourseModuleMapper;
import com.staff_portal.scheduling_service.model.TimeSheetCourseModule;
import com.staff_portal.scheduling_service.repository.TimeSheetCourseModuleRepository;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetCourseModuleService;

import jakarta.transaction.Transactional;

@Transactional
@Service
public class TimeSheetCourseModuleServiceImpl implements ITimeSheetCourseModuleService {

	@Autowired
	private TimeSheetCourseModuleRepository courseModuleRepository;

	
	
	@Override
	public TimeSheetCourseModuleResponseDTO createTimeSheetCourseModule(TimeSheetCourseModuleRequestDTO dto) {
		
		TimeSheetCourseModule entity = TimeSheetCourseModuleMapper.toEntity(dto);
	    TimeSheetCourseModule saved = courseModuleRepository.save(entity);
	    return TimeSheetCourseModuleMapper.toDto(saved);
		
	}



	@Override
	public List<TimeSheetCourseModuleResponseDTO> getAllTimeSheetCourseModule() {
		
		return courseModuleRepository.findAll()
                .stream()
                .map(TimeSheetCourseModuleMapper::toDto)
                .collect(Collectors.toList());
	}

}


