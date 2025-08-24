package com.staff_portal.scheduling_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.staff_portal.scheduling_service.dto.request.TimeSheetRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetService;

import jakarta.validation.Valid;

public class TimeSheetController {
	

    @Autowired
    private ITimeSheetService timeSheetService;

    @PostMapping
    public ResponseEntity<TimeSheetResponseDTO> createTimeSheet(@Valid @RequestBody TimeSheetRequestDTO requestDto) {
        TimeSheetResponseDTO responseDto = timeSheetService.createTimeSheet(requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    public ResponseEntity<List<TimeSheetResponseDTO>> getAllTimesheets() {
        List<TimeSheetResponseDTO> timesheets = timeSheetService.getAllTimeSheets();
        return ResponseEntity.ok(timesheets);
    }
}


