package com.staff_portal.scheduling_service.mapper;


import java.util.List;
import java.util.stream.Collectors;

import com.staff_portal.scheduling_service.dto.request.TimeSheetRequestDTO;
import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
import com.staff_portal.scheduling_service.dto.response.SimpleTimeSheetCourseModuleDTO;
import com.staff_portal.scheduling_service.dto.response.SimpleTimeSheetResponseDTO;
import com.staff_portal.scheduling_service.dto.response.SimpleTimeSheetTopicDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetResponseDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetTopicResponseDTO;
import com.staff_portal.scheduling_service.model.TimeSheet;
import com.staff_portal.scheduling_service.model.TimeSheetCourseModule;
import com.staff_portal.scheduling_service.model.TimeSheetTopic;


public class TimeSheetMapper {

	public static TimeSheet toEntity(TimeSheetRequestDTO dto) {
		TimeSheet entity = new TimeSheet();
		entity.setStartTime(dto.getStartTime());
		entity.setEndTime(dto.getEndTime());
		entity.setExtraTopic(dto.getExtraTopic());
		entity.setAssignment(dto.getAssignment());
		entity.setLogDate(dto.getLogDate());
		entity.setStaffId(dto.getStaffId());
		entity.setDurationHours(dto.getDurationHours());
		entity.setStatus(dto.getStatus());

		TimeSheetCourseModule courseModule = TimeSheetCourseModuleMapper.toEntity(dto.getCourseModule());

		entity.setCourseModule(courseModule);

		List<TimeSheetTopic> topic = dto.getTimeSheetTopics().stream().map(TimeSheetTopicMapper::toEntity).collect(Collectors.toList());
		entity.setTimeSheetTopics(topic);

		return entity;
	}

	public static TimeSheetResponseDTO toDto(TimeSheet entity) {
		TimeSheetResponseDTO dto = new TimeSheetResponseDTO();
		dto.setId(entity.getId());
		dto.setStartTime(entity.getStartTime());
		dto.setStaffId(entity.getStaffId());
		dto.setEndTime(entity.getEndTime());
		dto.setExtraTopic(entity.getExtraTopic());
		dto.setAssignment(entity.getAssignment());
		dto.setLogDate(entity.getLogDate());
		dto.setDurationHours(entity.getDurationHours());
		dto.setStatus(entity.getStatus());

		SimpleTimeSheetCourseModuleDTO cmDto = new SimpleTimeSheetCourseModuleDTO();
		cmDto.setId( entity.getCourseModule().getId());
		cmDto.setModuleId( entity.getCourseModule().getModuleId());
		cmDto.setCourseId( entity.getCourseModule().getCourseId());
		dto.setCourseModule(cmDto);
 
		dto.setTopics(entity.getTimeSheetTopics().stream().map(TimeSheetTopicMapper::toSimpleDto).collect(Collectors.toList()));

		return dto;
	}
	public static SimpleTimeSheetResponseDTO toSimpleDto(TimeSheet entity) {
		SimpleTimeSheetResponseDTO dto = new SimpleTimeSheetResponseDTO();
		dto.setId(entity.getId());
		dto.setStartTime(entity.getStartTime());
		dto.setStaffId(entity.getStaffId());
		dto.setEndTime(entity.getEndTime());
		dto.setExtraTopic(entity.getExtraTopic());
		dto.setAssignment(entity.getAssignment());
		dto.setLogDate(entity.getLogDate());
		dto.setDurationHours(entity.getDurationHours());
		dto.setStatus(entity.getStatus());
		
		return dto;
		
}
}