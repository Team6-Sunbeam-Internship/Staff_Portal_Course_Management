package com.staff_portal.scheduling_service.mapper;

import java.util.stream.Collectors;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;

import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;

import com.staff_portal.scheduling_service.model.TimeSheetCourseModule;

public class TimeSheetCourseModuleMapper {

	public static TimeSheetCourseModule toEntity(TimeSheetCourseModuleRequestDTO cmDto) {
		TimeSheetCourseModule newModule = new TimeSheetCourseModule();
		newModule.setCourseName(cmDto.getCourseName());
		newModule.setModuleName(cmDto.getModuleName());

		return newModule;
	}

	public static TimeSheetCourseModuleResponseDTO toDto(TimeSheetCourseModule entity) {
		TimeSheetCourseModuleResponseDTO cmDto = new TimeSheetCourseModuleResponseDTO();
		cmDto.setId(entity.getId());
		cmDto.setCourseName(entity.getCourseName());
		cmDto.setModuleName(entity.getModuleName());
		
		cmDto.setTimeSheets(entity.getTimeSheets().stream().map(TimeSheetMapper::toSimpleDto).collect(Collectors.toList()));
		return cmDto;
	}
}