package com.staff_portal.scheduling_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;
import com.staff_portal.scheduling_service.dto.request.TimeSheetRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetResponseDTO;
import com.staff_portal.scheduling_service.mapper.TimeSheetMapper;
import com.staff_portal.scheduling_service.model.TimeSheet;
import com.staff_portal.scheduling_service.model.TimeSheetCourseModule;
import com.staff_portal.scheduling_service.model.TimeSheetTopic;
import com.staff_portal.scheduling_service.repository.TimeSheetCourseModuleRepository;
import com.staff_portal.scheduling_service.repository.TimeSheetRepository;
import com.staff_portal.scheduling_service.repository.TimeSheetTopicRepository;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetService;

public class TimeSheetServiceImpl implements ITimeSheetService {

	@Autowired
    private TimeSheetRepository TimeSheetRepository;

    @Autowired
    private TimeSheetCourseModuleRepository courseModuleRepository;

    @Autowired
    private TimeSheetTopicRepository topicRepository;
    
	@Override
	public TimeSheetResponseDTO createTimeSheet(TimeSheetRequestDTO requestDto) {
		
		TimeSheet TimeSheet = TimeSheetMapper.toEntity(requestDto);
		TimeSheetCourseModule TimeSheetCourseModule = TimeSheet.getCourseModule();
		TimeSheetTopic topic = TimeSheet.getTimeSheetTopic();
		courseModuleRepository.save(TimeSheetCourseModule);
		topicRepository.save(topic);
        TimeSheet saved = TimeSheetRepository.save(TimeSheet);
        return TimeSheetMapper.toDto(saved);
	}

	@Override
	public List<TimeSheetResponseDTO> getAllTimeSheets() {
		
	        return TimeSheetRepository.findAll()
	                .stream()
	                .map(TimeSheetMapper::toDto)
	                .collect(Collectors.toList());
		
	}

	@Override
	public TimeSheetResponseDTO getTimeSheetById(Long id) {
		
		        TimeSheet TimeSheet = TimeSheetRepository.findById(id)
		                .orElseThrow(() -> new RuntimeException("TimeSheet not found"));
		        return TimeSheetMapper.toDto(TimeSheet);
		    }

	@Override
	public TimeSheetResponseDTO updateTimeSheet(Long id, TimeSheetRequestDTO requestDto) {
		TimeSheet existing = TimeSheetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("TimeSheet not found"));
        TimeSheet updated = TimeSheetMapper.toEntity(requestDto);
        updated.setId(id); // maintain the same ID
        TimeSheet saved = TimeSheetRepository.save(updated);
        return  TimeSheetMapper.toDto(saved);
	}

	}


