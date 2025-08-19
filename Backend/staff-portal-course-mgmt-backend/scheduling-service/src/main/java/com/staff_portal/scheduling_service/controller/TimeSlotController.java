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

import com.staff_portal.scheduling_service.dto.request.TimeSlotRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSlotResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSlotService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/timeslot")
public class TimeSlotController {

	@Autowired
	private ITimeSlotService timeSlotService;

	@GetMapping
	public ResponseEntity<List<TimeSlotResponseDTO>> getAll() {
		List<TimeSlotResponseDTO> list = timeSlotService.getAllTimeSlots();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/{id}")
	public ResponseEntity<TimeSlotResponseDTO> getById(@PathVariable Long id) {
		return ResponseEntity.ok(timeSlotService.getTimeSlotById(id));
	}

	@PostMapping
	public ResponseEntity<TimeSlotResponseDTO> create(@Valid @RequestBody TimeSlotRequestDTO dto) {
		return ResponseEntity.ok(timeSlotService.createTimeSlot(dto));
	}

	@PutMapping("/{id}")
	public ResponseEntity<TimeSlotResponseDTO> update(@PathVariable Long id,
			@Valid @RequestBody TimeSlotRequestDTO dto) {
		return ResponseEntity.ok(timeSlotService.updateTimeSlot(id, dto));
	}
}
