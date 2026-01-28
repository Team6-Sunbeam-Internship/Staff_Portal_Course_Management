package com.staff_portal.scheduling_service.controller;

import com.staff_portal.scheduling_service.dto.request.ScheduleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ApiResponse;
import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.IScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/schedule")
public class ScheduleController {

    @Autowired
    private IScheduleService scheduleService;

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<ScheduleResponseDTO>>> getAllSchedules(
            Authentication authentication,
            @RequestParam(required = false) String courseCode,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        ApiResponse<List<ScheduleResponseDTO>> list = scheduleService.getAllSchedules(authentication, courseCode, startDate, endDate);
        return ResponseEntity.ok(list);
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UUID>> createSchedules(@Valid @RequestBody ScheduleRequestDTO dto) {
        ApiResponse<UUID> createResponse = scheduleService.createSchedule(dto);
        return ResponseEntity.ok(createResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<String>> updateSchedule(@PathVariable UUID id,
                                                              @Valid @RequestBody ScheduleRequestDTO dto) {
        ApiResponse<String> updateScheduleResponse = scheduleService.updateSchedule(id, dto);
        return ResponseEntity.ok(updateScheduleResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable UUID id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }
}
