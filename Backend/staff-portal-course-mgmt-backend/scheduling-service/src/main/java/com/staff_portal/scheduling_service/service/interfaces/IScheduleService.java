package com.staff_portal.scheduling_service.service.interfaces;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;

import com.staff_portal.scheduling_service.dto.request.ScheduleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;

public interface IScheduleService {

	List<ScheduleResponseDTO> getAllSchedules();

	ScheduleResponseDTO getScheduleById(Long id);
	
	ScheduleResponseDTO createSchedule(ScheduleRequestDTO dto);

	ScheduleResponseDTO updateSchedule(Long id, ScheduleRequestDTO dto);
	
	void deleteSchedule(Long id);

	
	Page<ScheduleResponseDTO> getSchedulesByBatchCycleCourseAndDateRange(String batchCycleName, String courseName,
			LocalDate startDate, LocalDate endDate, int page, int size);
	
}
