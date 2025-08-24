package com.staff_portal.scheduling_service.mapper;


import com.staff_portal.scheduling_service.dto.request.TimeSheetRequestDTO;
import com.staff_portal.scheduling_service.dto.request.TimeSheetTopicRequestDTO;
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

		TimeSheetTopicRequestDTO topicDto = dto.getTimeSheetTopic();
		TimeSheetTopic topic = TimeSheetTopicMapper.toEntity(dto.getTimeSheetTopic());
		entity.setTimeSheetTopic(topic);

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

		TimeSheetCourseModuleResponseDTO cmDto = TimeSheetCourseModuleMapper.toDto(entity.getCourseModule());
		dto.setCourseModule(cmDto);

		TimeSheetTopicResponseDTO topicDto = TimeSheetTopicMapper.toDto(entity.getTimeSheetTopic());

		dto.setTopic(topicDto);

		return dto;
	}
}
