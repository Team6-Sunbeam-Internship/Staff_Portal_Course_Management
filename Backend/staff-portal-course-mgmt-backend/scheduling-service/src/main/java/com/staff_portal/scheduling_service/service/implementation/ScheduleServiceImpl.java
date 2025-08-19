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

	

}
