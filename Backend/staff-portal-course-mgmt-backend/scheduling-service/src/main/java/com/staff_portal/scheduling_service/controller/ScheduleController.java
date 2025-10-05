package com.staff_portal.scheduling_service.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.scheduling_service.dto.request.ScheduleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.IScheduleService;

import jakarta.validation.Valid;

@CrossOrigin(origins="http://localhost:5173")
@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

	@Autowired
	private IScheduleService scheduleService;

	@GetMapping
	public ResponseEntity<List<ScheduleResponseDTO>> getAllSchedules() {
		List<ScheduleResponseDTO> list = scheduleService.getAllSchedules();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/{id}")
	public ResponseEntity<ScheduleResponseDTO> getSchedulesById(@PathVariable Long id) {
		ScheduleResponseDTO dto = scheduleService.getScheduleById(id);
		return ResponseEntity.ok(dto);
	}

	@PostMapping
	public ResponseEntity<ScheduleResponseDTO> createSchedules(@Valid @RequestBody ScheduleRequestDTO dto) {
		ScheduleResponseDTO created = scheduleService.createSchedule(dto);
		return ResponseEntity.ok(created);
	}
	@PutMapping("/{id}")
	public ResponseEntity<ScheduleResponseDTO> updateSchedule(@PathVariable Long id,
			@Valid @RequestBody ScheduleRequestDTO dto) {
		ScheduleResponseDTO updated = scheduleService.updateSchedule(id, dto);
		return ResponseEntity.ok(updated);
	}
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
		scheduleService.deleteSchedule(id);
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/by-date")
	public Page<ScheduleResponseDTO> getSchedulesByBatchCycleCourseAndDateRange(
	        @RequestParam String batchCycleName,
	        @RequestParam String courseName,
	        @RequestParam LocalDate startDate,
	        @RequestParam LocalDate endDate,
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "8") int size
	) {
	    return scheduleService.getSchedulesByBatchCycleCourseAndDateRange(
	            batchCycleName, courseName, startDate, endDate, page, size
	    );
	}
 	
	
}
