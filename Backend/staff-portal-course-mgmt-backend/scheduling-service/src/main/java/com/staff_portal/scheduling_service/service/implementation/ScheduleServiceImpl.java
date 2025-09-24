package com.staff_portal.scheduling_service.service.implementation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;

import com.staff_portal.scheduling_service.dto.request.ScheduleRequestDTO;
import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;
import com.staff_portal.scheduling_service.exception.ResourceNotFoundException;
import com.staff_portal.scheduling_service.exception.ScheduleConflictException;
import com.staff_portal.scheduling_service.mapper.ScheduleMapper;
import com.staff_portal.scheduling_service.mapper.TimeSlotMapper;
import com.staff_portal.scheduling_service.model.Schedule;
import com.staff_portal.scheduling_service.model.TimeSlot;
import com.staff_portal.scheduling_service.repository.ScheduleRepository;
import com.staff_portal.scheduling_service.repository.TimeSlotRepository;
import com.staff_portal.scheduling_service.service.interfaces.IScheduleService;

import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@Service
@Transactional
public class ScheduleServiceImpl implements IScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;
    
    @Autowired
    private EntityManager entityManager;
    
    private void enableDeletedFilter() {
        Session session = entityManager.unwrap(Session.class);
        session.enableFilter("deletedFilter").setParameter("isDeleted", false); // exclude deleted
    }

    @Override
    public List<ScheduleResponseDTO> getAllSchedules() {
    	
    	enableDeletedFilter();
        List<Schedule> schedules = scheduleRepository.findAll();
        List<ScheduleResponseDTO> dtoList = new ArrayList<>();
        for (Schedule schedule : schedules) {
            dtoList.add(ScheduleMapper.toScheduleResponseDTO(schedule));
        }

        return dtoList;
    }
    

    @Override
    public ScheduleResponseDTO getScheduleById(Long id) {
    	
    	enableDeletedFilter();
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));
        return ScheduleMapper.toScheduleResponseDTO(schedule);
    }

    @Override
    public ScheduleResponseDTO createSchedule(ScheduleRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Schedule request cannot be null");
        }

        TimeSlotRequestDTO timeSlotRequest = dto.getTimeSlot();
        if (timeSlotRequest == null) {
            throw new IllegalArgumentException("TimeSlot data is required");
        }

        // Conflict check
        List<Schedule> conflicts = scheduleRepository.findConflictingSchedules(
                dto.getInfrastructureName(),
                dto.getScheduleDate(),
                timeSlotRequest.getStartTime(),
                timeSlotRequest.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            List<ScheduleResponseDTO> conflictDTOs = conflicts.stream()
                    .map(ScheduleMapper::toScheduleResponseDTO)
                    .toList();

            throw new ScheduleConflictException(
                    "Conflict: schedules already exist for infrastructure " + dto.getInfrastructureName() +
                            " on " + dto.getScheduleDate() +  "between" + timeSlotRequest.getStartTime()  + "-" +  timeSlotRequest.getEndTime(),
                    conflictDTOs
            );
        }

        TimeSlot timeSlot = TimeSlotMapper.fromTimeSlotRequestDTO(timeSlotRequest);
        Schedule schedule = ScheduleMapper.fromScheduleRequestDTO(dto, timeSlot);

        timeSlotRepository.save(timeSlot);
        Schedule saved = scheduleRepository.save(schedule);

        return ScheduleMapper.toScheduleResponseDTO(saved);
    }
    

@Override
public ScheduleResponseDTO updateSchedule(Long id, ScheduleRequestDTO dto) {
    if (dto == null) {
        throw new IllegalArgumentException("Schedule request cannot be null");
    }

    Schedule schedule = scheduleRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));

    TimeSlotRequestDTO timeSlotDto = dto.getTimeSlot();
    if (timeSlotDto == null) {
        throw new IllegalArgumentException("TimeSlot data is required");
    }

    // 🔍 Conflict check (exclude current schedule)
    List<Schedule> conflicts = scheduleRepository.findConflictingSchedules(
            dto.getInfrastructureName(),
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
                "Conflict: schedules already exist for infrastructure " + dto.getInfrastructureName() +
                        " on " + dto.getScheduleDate()    +  "between" + timeSlotDto.getStartTime()  + "-" +  timeSlotDto.getEndTime(),
                conflictDTOs
        );
    }

    //  Update fields
    schedule.setScheduleDate(dto.getScheduleDate());
    schedule.setActivity(dto.getActivity());
    schedule.setCourseName(dto.getCourseName());
    schedule.setStaffNames(dto.getStaffNames());
    schedule.setModuleName(dto.getModuleName());
    schedule.setInfrastructureName(dto.getInfrastructureName());
    schedule.setBatchCycleName(dto.getBatchCycleName());
    schedule.setStudentGroups(dto.getStudentGroups());

    TimeSlot timeSlot = schedule.getTimeSlot();
    timeSlot.setStartTime(timeSlotDto.getStartTime());
    timeSlot.setEndTime(timeSlotDto.getEndTime());
    timeSlot.setSlotName(timeSlotDto.getSlotName());

    Schedule updated = scheduleRepository.save(schedule);
    return ScheduleMapper.toScheduleResponseDTO(updated);
}

    @Override
    public void deleteSchedule(Long id) {
        if (!scheduleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Schedule not found with ID: " + id);
        }
        scheduleRepository.deleteById(id);
    }

    @Override
    public Page<ScheduleResponseDTO> getSchedulesByBatchCycleCourseAndDateRange(
            String batchCycleName,
            String courseName,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size) 
    {

        enableDeletedFilter(); //ensures only active records

        Pageable pageable = PageRequest.of(page, size);
        Page<Schedule> schedules = scheduleRepository.findByBatchCycleCourseAndDateRange(
                batchCycleName, courseName, startDate, endDate, pageable
        );

        return schedules.map(ScheduleMapper::toScheduleResponseDTO);
    }
}
