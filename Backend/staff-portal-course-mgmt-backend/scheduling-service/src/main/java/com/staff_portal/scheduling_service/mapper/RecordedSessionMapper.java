package com.staff_portal.scheduling_service.mapper;

import com.staff_portal.scheduling_service.dto.request.RecordedSessionDTO;
import com.staff_portal.scheduling_service.model.RecordedSession;

public class RecordedSessionMapper {


	public static RecordedSession toEntity(RecordedSessionDTO dto) {
		if (dto == null) {
			return null;
		}

		RecordedSession entity = new RecordedSession();

		// Don't map id from DTO (it's read-only)
		entity.setSessionDate(dto.getSessionDate());
		entity.setChannel(dto.getChannel());
		entity.setTitle(dto.getTitle());
		entity.setDescription(dto.getDescription());
		entity.setUrl(dto.getUrl());
		entity.setCourseName(dto.getCourseName());
		entity.setBatchCycleName(dto.getBatchCycleName());
		entity.setStaffName(dto.getStaffName());

		return entity;
	}

	public static RecordedSessionDTO toDto(RecordedSession entity) {
		if (entity == null) {
			return null;
		}

		RecordedSessionDTO dto = new RecordedSessionDTO();

		dto.setId(entity.getId());
		dto.setSessionDate(entity.getSessionDate());
		dto.setChannel(entity.getChannel());
		dto.setTitle(entity.getTitle());
		dto.setDescription(entity.getDescription());
		dto.setUrl(entity.getUrl());
		dto.setCourseName(entity.getCourseName());
		dto.setBatchCycleName(entity.getBatchCycleName());
		dto.setStaffName(entity.getStaffName());

		return dto;
	}
}
