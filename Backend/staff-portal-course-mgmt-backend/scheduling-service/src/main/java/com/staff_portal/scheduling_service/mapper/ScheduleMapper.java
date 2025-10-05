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
		dto.setInfrastructureName(schedule.getInfrastructureName());
		dto.setStaffNames(schedule.getStaffNames());
		dto.setModuleName(schedule.getModuleName());
		dto.setCourseName(schedule.getCourseName());
		dto.setTimeSlot(TimeSlotMapper.toTimeSlotSimpleDTO(schedule.getTimeSlot()));
        dto.setBatchCycleName(schedule.getBatchCycleName());
        dto.setStudentGroups(schedule.getStudentGroups());
		return dto;
	}

	public static Schedule fromScheduleRequestDTO(ScheduleRequestDTO dto, TimeSlot timeSlot) {
		if (dto == null) {
			return null;
		}

		Schedule schedule = new Schedule();
		schedule.setActivity(dto.getActivity());
		schedule.setScheduleDate(dto.getScheduleDate());
		schedule.setInfrastructureName(dto.getInfrastructureName());
		schedule.setStaffNames(dto.getStaffNames());
		schedule.setModuleName(dto.getModuleName());
		schedule.setCourseName(dto.getCourseName());
		schedule.setTimeSlot(timeSlot);
	    schedule.setBatchCycleName(dto.getBatchCycleName());
	    schedule.setStudentGroups(dto.getStudentGroups());
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
		dto.setInfrastructureName(schedule.getInfrastructureName());
		dto.setStaffNames(schedule.getStaffNames());
		dto.setModuleName(schedule.getModuleName());
		dto.setCourseName(schedule.getCourseName());
		dto.setBatchCycleName(schedule.getBatchCycleName());
        dto.setStudentGroups(schedule.getStudentGroups());
        
		return dto;

		
	}
}



