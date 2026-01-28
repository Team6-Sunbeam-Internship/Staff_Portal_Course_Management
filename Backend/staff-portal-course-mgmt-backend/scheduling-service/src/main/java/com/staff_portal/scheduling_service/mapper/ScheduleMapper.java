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
        dto.setInfrastructureId(schedule.getVenue());
        dto.setStaffIds(schedule.getStaffs());
        dto.setModuleId(schedule.getModule());
        dto.setCourseCode(schedule.getCourseCode());
        dto.setTimeSlot(TimeSlotMapper.toTimeSlotSimpleDTO(schedule.getTimeSlot()));
        dto.setStudentGroups(schedule.getStudentsGroups());
        return dto;
    }

    public static Schedule fromScheduleRequestDTO(ScheduleRequestDTO dto, TimeSlot timeSlot) {
        if (dto == null) {
            return null;
        }
        return Schedule.builder()
                .scheduleDate(dto.getScheduleDate())
                .activity(dto.getActivity())
                .courseCode(dto.getCourseCode())
                .staffs(dto.getFacultyIds())
                .studentsGroups(dto.getGroupIds())
                .timeSlot(timeSlot)
                .module(dto.getModule())
                .venue(dto.getInfrastructure())
                .build();

    }


    public static ScheduleSimpleDTO toScheduleSimpleDTO(Schedule schedule) {
        if (schedule == null) {
            return null;
        }

        ScheduleSimpleDTO dto = new ScheduleSimpleDTO();
//        dto.setId(schedule.getId());
//        dto.setScheduleDate(schedule.getScheduleDate());
//        dto.setActivity(schedule.getActivity());
//        dto.setInfrastructureName(schedule.getInfrastructureName());
//        dto.setStaffNames(schedule.getStaffNames());
//        dto.setModuleName(schedule.getModuleName());
//        dto.setCourseName(schedule.getCourseName());
//        dto.setBatchCycleName(schedule.getBatchCycleName());
//        dto.setStudentGroups(schedule.getStudentGroups());

        return dto;


    }
}



