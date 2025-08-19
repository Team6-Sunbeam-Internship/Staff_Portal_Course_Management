package com.staff_portal.scheduling_service.mapper;

import com.staff_portal.scheduling_service.dto.request.ScheduleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;
import com.staff_portal.scheduling_service.dto.response.ScheduleSimpleDTO;
import com.staff_portal.scheduling_service.model.Schedule;
import com.staff_portal.scheduling_service.model.TimeSlot;

public class ScheduleMapper {

	public static ScheduleResponseDTO toScheduleResponseDTO(Schedule schedule) {
		if (schedule == null) {
			return null;
		}

		ScheduleResponseDTO dto = new ScheduleResponseDTO();
		dto.setId(schedule.getId());
		dto.setScheduleDate(schedule.getScheduleDate());
		dto.setActivity(schedule.getActivity());
		dto.setInfrastructureId(schedule.getInfrastructureId());
		dto.setStaffId(schedule.getStaffId());
		dto.setModuleId(schedule.getModuleId());
		dto.setCourseId(schedule.getCourseId());
		dto.setTimeSlot(TimeSlotMapper.toTimeSlotSimpleDTO(schedule.getTimeSlot()));

		return dto;
	}

	public static Schedule fromScheduleRequestDTO(ScheduleRequestDTO dto, TimeSlot timeSlot) {
		if (dto == null) {
			return null;
		}

		Schedule schedule = new Schedule();
		schedule.setActivity(dto.getActivity());
		schedule.setScheduleDate(dto.getScheduleDate());
		schedule.setInfrastructureId(dto.getInfrastructureId());
		schedule.setStaffId(dto.getStaffId());
		schedule.setModuleId(dto.getModuleId());
		schedule.setCourseId(dto.getCourseId());
		schedule.setTimeSlot(timeSlot);
	
		return schedule;
	}

	
	public static ScheduleSimpleDTO toScheduleSimpleDTO(Schedule schedule) {
		if (schedule == null) {
			return null;
		}

		ScheduleSimpleDTO dto = new ScheduleSimpleDTO();
		dto.setId(schedule.getId());
		dto.setScheduleDate(schedule.getScheduleDate());
		dto.setActivity(schedule.getActivity());
		dto.setInfrastructureId(schedule.getInfrastructureId());
		dto.setStaffId(schedule.getStaffId());
		dto.setModuleId(schedule.getModuleId());
		dto.setCourseId(schedule.getCourseId());

		return dto;

		
	}
}

