package com.staff_portal.scheduling_service.mapper;

import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ScheduleSimpleDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSlotResponseDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSlotSimpleDTO;
import com.staff_portal.scheduling_service.model.TimeSlot;

import java.util.ArrayList;
import java.util.List;

public class TimeSlotMapper {

    public static TimeSlotResponseDTO toTimeSlotResponseDTO(TimeSlot timeSlot) {
        if (timeSlot == null) {
            return null;
        }

        TimeSlotResponseDTO dto = new TimeSlotResponseDTO();
//		dto.setId(timeSlot.getId());
//		dto.setStartTime(timeSlot.getStartTime());
//		dto.setEndTime(timeSlot.getEndTime());
//		dto.setSlotName(timeSlot.getSlotName());

        List<ScheduleSimpleDTO> simpleSchedules = new ArrayList<>();

//		if (timeSlot.getSchedules() != null) {
//			for (Schedule schedule : timeSlot.getSchedules()) {
//				ScheduleSimpleDTO simpleDTO = ScheduleMapper.toScheduleSimpleDTO(schedule);
//				if (simpleDTO != null) {
//					simpleSchedules.add(simpleDTO);
//				}
//			}
//		}

        dto.setSchedules(simpleSchedules);
        return dto;
    }

    public static TimeSlot fromTimeSlotRequestDTO(TimeSlotRequestDTO dto) {
        if (dto == null) {
            return null;
        }

        return TimeSlot.builder()
                .startTime(dto.getStartTime())
                .endTime(dto.getEndTime())
                .build();
    }

    public static TimeSlotSimpleDTO toTimeSlotSimpleDTO(TimeSlot timeSlot) {
        if (timeSlot == null) {
            return null;
        }
        //		dto.setId(timeSlot.getId());
//		dto.setStartTime(timeSlot.getStartTime());
//		dto.setEndTime(timeSlot.getEndTime());
//		dto.setSlotName(timeSlot.getSlotName());

        return new TimeSlotSimpleDTO();
    }

}
