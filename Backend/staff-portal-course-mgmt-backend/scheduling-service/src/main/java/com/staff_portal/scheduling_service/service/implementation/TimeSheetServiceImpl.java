package com.staff_portal.scheduling_service.service.implementation;

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
    private TimeSheetRepository timeSheetRepository;

    @Autowired
    private TimeSheetCourseModuleRepository courseModuleRepository;

    @Autowired
    private TimeSheetTopicRepository topicRepository;
    
	@Override
	public TimeSheetResponseDTO createTimeSheet(TimeSheetRequestDTO requestDto) {
		
		TimeSheet timesheet = TimeSheetMapper.toEntity(requestDto);
		TimeSheetCourseModule timeSheetCourseModule = timesheet.getCourseModule();
		TimeSheetTopic topic = timesheet.getTimeSheetTopic();
		courseModuleRepository.save(timeSheetCourseModule);
		topicRepository.save(topic);
        TimeSheet saved = timeSheetRepository.save(timesheet);
        return TimeSheetMapper.toDto(saved);
	}

}
