package com.staff_portal.scheduling_service.service.implementation;

import com.staff_portal.scheduling_service.dto.request.ScheduleRequestDTO;
import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ApiResponse;
import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;
import com.staff_portal.scheduling_service.exception.NotInRangeException;
import com.staff_portal.scheduling_service.exception.ResourceNotFoundException;
import com.staff_portal.scheduling_service.exception.ScheduleConflictException;
import com.staff_portal.scheduling_service.mapper.ScheduleMapper;
import com.staff_portal.scheduling_service.mapper.TimeSlotMapper;
import com.staff_portal.scheduling_service.model.Schedule;
import com.staff_portal.scheduling_service.model.TimeSlot;
import com.staff_portal.scheduling_service.repository.ScheduleRepository;
import com.staff_portal.scheduling_service.repository.TimeSlotRepository;
import com.staff_portal.scheduling_service.service.interfaces.IScheduleService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ScheduleServiceImpl implements IScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Override
    public ApiResponse<List<ScheduleResponseDTO>> getAllSchedules(Authentication authentication, String courseCode, LocalDate startDate, LocalDate endDate) {

        if (authentication == null) {
            throw new IllegalArgumentException("Authentication is required");
        }
        String sub = authentication.getName();
        UUID staffId = UUID.fromString(sub);
        List<Schedule> schedules = scheduleRepository.findSchedulesForCoordinator(staffId, courseCode, startDate, endDate);
        List<ScheduleResponseDTO> dtoList = new ArrayList<>();
        for (Schedule schedule : schedules) {
            dtoList.add(ScheduleMapper.toScheduleResponseDTO(schedule));
        }

        return ApiResponse.onSuccess(dtoList);
    }

    @Override
    public ApiResponse<UUID> createSchedule(ScheduleRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Schedule request cannot be null");
        }

        TimeSlotRequestDTO timeSlotRequest = dto.getTimeSlot();
        if (timeSlotRequest == null) {
            throw new IllegalArgumentException("TimeSlot data is required");
        }
        if (!timeSlotRequest.isValidRange()) {
            throw new NotInRangeException(HttpStatus.BAD_REQUEST, "TimeSlot data is not valid");
        }

        // Conflict check
        List<Schedule> conflicts = scheduleRepository.findConflictingSchedules(
                dto.getInfrastructure(),
                dto.getScheduleDate(),
                timeSlotRequest.getStartTime(),
                timeSlotRequest.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            List<ScheduleResponseDTO> conflictDTOs = conflicts.stream()
                    .map(ScheduleMapper::toScheduleResponseDTO)
                    .toList();

            throw new ScheduleConflictException(
                    "Conflict: schedules already exist for infrastructure " + dto.getInfrastructure() +
                            " on " + dto.getScheduleDate() + "between" + timeSlotRequest.getStartTime() + "-" + timeSlotRequest.getEndTime(),
                    conflictDTOs
            );
        }

        TimeSlot timeSlot = TimeSlotMapper.fromTimeSlotRequestDTO(timeSlotRequest);
        Schedule schedule = ScheduleMapper.fromScheduleRequestDTO(dto, timeSlot);
        Schedule saved = scheduleRepository.save(schedule);
        return ApiResponse.onSuccess(saved.getId());
    }


    @Override
    public ApiResponse<String> updateSchedule(UUID id, ScheduleRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Schedule request cannot be null");
        }

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));

        TimeSlotRequestDTO timeSlotDto = dto.getTimeSlot();
        if (timeSlotDto == null) {
            throw new IllegalArgumentException("TimeSlot data is required");
        }

        // Conflict check (exclude current schedule)
        List<Schedule> conflicts = scheduleRepository.findConflictingSchedules(
                        dto.getInfrastructure(),
                        dto.getScheduleDate(),
                        timeSlotDto.getStartTime(),
                        timeSlotDto.getEndTime()
                ).stream()
                .filter(conflict -> !conflict.getId().equals(id))
                .toList();

        if (!conflicts.isEmpty()) {
            List<ScheduleResponseDTO> conflictDTOs = conflicts.stream()
                    .map(ScheduleMapper::toScheduleResponseDTO)
                    .toList();

            throw new ScheduleConflictException(
                    "Conflict: schedules already exist for infrastructure " + dto.getInfrastructure() +
                            " on " + dto.getScheduleDate() + "between" + timeSlotDto.getStartTime() + "-" + timeSlotDto.getEndTime(),
                    conflictDTOs
            );
        }

        //  Update fields
        if(dto.getScheduleDate()!=null && !dto.getScheduleDate().isBefore(LocalDate.now()) && !dto.getScheduleDate().isBefore(schedule.getScheduleDate())){
            schedule.setScheduleDate(dto.getScheduleDate());
        }
        if(dto.getActivity() != null &&  !schedule.getActivity().equals(dto.getActivity())){
            schedule.setActivity(dto.getActivity());
        }
        if(dto.getCourseCode() != null){
            schedule.setCourseCode(dto.getCourseCode());
        }
        if(dto.getModule() != null){
            schedule.setModule(dto.getModule());
        }
        if(dto.getInfrastructure() != null){
            schedule.setVenue(dto.getInfrastructure());
        }
        if(!dto.getFacultyIds().isEmpty()){
            schedule.setStaffs(dto.getFacultyIds());
        }
        if(!dto.getGroupIds().isEmpty()){
            schedule.setStudentsGroups(dto.getGroupIds());
        }
        schedule.setTimeSlot(TimeSlotMapper.fromTimeSlotRequestDTO(timeSlotDto));

        return ApiResponse.onSuccess("Schedule id[%s] updated");
    }

    @Override
    public void deleteSchedule(UUID id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));
        schedule.setIsDeleted(true);
    }
}
