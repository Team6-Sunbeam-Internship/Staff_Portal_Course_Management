package com.staff_portal.scheduling_service.service.interfaces;

import com.staff_portal.scheduling_service.dto.request.ScheduleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ApiResponse;
import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface IScheduleService {

    ApiResponse<List<ScheduleResponseDTO>> getAllSchedules(Authentication authentication, String courseCode, LocalDate startTime, LocalDate endTime);

    ApiResponse<UUID> createSchedule(ScheduleRequestDTO dto);

    ApiResponse<String> updateSchedule(UUID id, ScheduleRequestDTO dto);

    void deleteSchedule(UUID id);
}
