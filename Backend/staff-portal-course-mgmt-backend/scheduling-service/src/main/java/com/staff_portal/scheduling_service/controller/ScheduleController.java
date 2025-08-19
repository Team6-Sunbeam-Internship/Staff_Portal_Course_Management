package com.staff_portal.scheduling_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.scheduling_service.dto.request.ScheduleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.ScheduleResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.IScheduleService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

	@Autowired
	private IScheduleService scheduleService;

	@GetMapping
	public ResponseEntity<List<ScheduleResponseDTO>> getAllSchedules() {
		List<ScheduleResponseDTO> list = scheduleService.getAllSchedules();
		return ResponseEntity.ok(list);
	}

}
