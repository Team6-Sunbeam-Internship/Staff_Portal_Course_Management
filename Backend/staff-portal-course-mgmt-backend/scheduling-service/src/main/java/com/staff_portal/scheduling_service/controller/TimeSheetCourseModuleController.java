package com.staff_portal.scheduling_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetCourseModuleService;

import jakarta.validation.Valid;

public class TimeSheetCourseModuleController {

	@Autowired
	private ITimeSheetCourseModuleService courseModuleService;

	@PostMapping
	public ResponseEntity<TimeSheetCourseModuleResponseDTO> create(
			@Valid @RequestBody TimeSheetCourseModuleRequestDTO requestDto) {
		TimeSheetCourseModuleResponseDTO responseDto = courseModuleService.createTimeSheetCourseModule(requestDto);
		return ResponseEntity.ok(responseDto);
	}

	@GetMapping
	public ResponseEntity<List<TimeSheetCourseModuleResponseDTO>> getAll() {
		List<TimeSheetCourseModuleResponseDTO> allModules = courseModuleService.getAllTimeSheetCourseModule();
		return ResponseEntity.ok(allModules);

	}
}
