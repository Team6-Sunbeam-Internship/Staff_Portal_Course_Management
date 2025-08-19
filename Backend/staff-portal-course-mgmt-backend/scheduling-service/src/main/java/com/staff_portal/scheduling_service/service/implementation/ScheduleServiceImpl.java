package com.staff_portal.scheduling_service.service.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.staff_portal.scheduling_service.dto.request.ScheduleRequestDTO;
import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;
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
		Optional<Schedule> optionalSchedule = scheduleRepository.findById(id);
		if (optionalSchedule.isEmpty()) {
			throw new RuntimeException("Schedule not found with ID: " + id);
		}
		return ScheduleMapper.toScheduleResponseDTO(optionalSchedule.get());
	}
	
	@Override
	public ScheduleResponseDTO createSchedule(ScheduleRequestDTO dto) {
		TimeSlotRequestDTO timeSlotRequest = dto.getTimeSlot();
		TimeSlot timeSlot = TimeSlotMapper.fromTimeSlotRequestDTO(timeSlotRequest);
		Schedule schedule = ScheduleMapper.fromScheduleRequestDTO(dto, timeSlot);
		timeSlotRepository.save(timeSlot);
		Schedule saved = scheduleRepository.save(schedule);
		return ScheduleMapper.toScheduleResponseDTO(saved);
	}
	
	@Transactional
	@Override
	public ScheduleResponseDTO updateSchedule(Long id, ScheduleRequestDTO dto) {
		Optional<Schedule> optional = scheduleRepository.findById(id);
		if (optional.isEmpty()) {
			throw new RuntimeException("Schedule not found with ID: " + id);
		}
		Schedule schedule = optional.get();
		TimeSlot timeSlot = timeSlotRepository.findById(schedule.getTimeSlot().getId())
				.orElseThrow(() -> new RuntimeException("TimeSlot not found"));
		schedule.setScheduleDate(dto.getScheduleDate());
		schedule.setActivity(dto.getActivity());
		schedule.setCourseId(dto.getCourseId());
		schedule.setStaffId(dto.getStaffId());
		schedule.setModuleId(dto.getModuleId());
		schedule.setInfrastructureId(dto.getInfrastructureId());
		TimeSlotRequestDTO dto1 = dto.getTimeSlot();
		timeSlot.setStartTime(dto1.getStartTime());
		timeSlot.setEndTime(dto1.getEndTime());
		timeSlot.setSlotName(dto1.getSlotName());
		schedule.setTimeSlot(timeSlot);

		Schedule updated = scheduleRepository.save(schedule);
		return ScheduleMapper.toScheduleResponseDTO(updated);
	}
	

	@Override
	public void deleteSchedule(Long id) {
		if (!scheduleRepository.existsById(id)) {
			throw new RuntimeException("Schedule not found with ID: " + id);
		}
		scheduleRepository.deleteById(id);
	}
	}



