package com.staff_portal.scheduling_service.service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.scheduling_service.dto.request.ScheduleRequestDTO;
import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;
import com.staff_portal.scheduling_service.exception.ResourceNotFoundException;
import com.staff_portal.scheduling_service.mapper.ScheduleMapper;
import com.staff_portal.scheduling_service.mapper.TimeSlotMapper;
import com.staff_portal.scheduling_service.model.Schedule;
import com.staff_portal.scheduling_service.model.TimeSlot;
import com.staff_portal.scheduling_service.repository.ScheduleRepository;
import com.staff_portal.scheduling_service.repository.TimeSlotRepository;
import com.staff_portal.scheduling_service.service.interfaces.IScheduleService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class ScheduleServiceImpl implements IScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Override
    public List<ScheduleResponseDTO> getAllSchedules() {
        List<Schedule> schedules = scheduleRepository.findAll();
        List<ScheduleResponseDTO> dtoList = new ArrayList<>();

        for (Schedule schedule : schedules) {
            dtoList.add(ScheduleMapper.toScheduleResponseDTO(schedule));
        }

        return dtoList;
    }

    @Override
    public ScheduleResponseDTO getScheduleById(Long id) {
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

        TimeSlot timeSlot = TimeSlotMapper.fromTimeSlotRequestDTO(timeSlotRequest);
        Schedule schedule = ScheduleMapper.fromScheduleRequestDTO(dto, timeSlot);

        timeSlotRepository.save(timeSlot);
        Schedule saved = scheduleRepository.save(schedule);

        return ScheduleMapper.toScheduleResponseDTO(saved);
    }

    @Transactional
    @Override
    public ScheduleResponseDTO updateSchedule(Long id, ScheduleRequestDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Schedule request cannot be null");
        }

        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with ID: " + id));

        TimeSlot timeSlot = timeSlotRepository.findById(schedule.getTimeSlot().getId())
                .orElseThrow(() -> new ResourceNotFoundException("TimeSlot not found with ID: " + schedule.getTimeSlot().getId()));

        TimeSlotRequestDTO timeSlotDto = dto.getTimeSlot();
        if (timeSlotDto == null) {
            throw new IllegalArgumentException("TimeSlot data is required");
        }

        schedule.setScheduleDate(dto.getScheduleDate());
        schedule.setActivity(dto.getActivity());
        schedule.setCourseId(dto.getCourseId());
        schedule.setStaffId(dto.getStaffId());
        schedule.setModuleId(dto.getModuleId());
        schedule.setInfrastructureId(dto.getInfrastructureId());

        timeSlot.setStartTime(timeSlotDto.getStartTime());
        timeSlot.setEndTime(timeSlotDto.getEndTime());
        timeSlot.setSlotName(timeSlotDto.getSlotName());
        schedule.setTimeSlot(timeSlot);

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
}
