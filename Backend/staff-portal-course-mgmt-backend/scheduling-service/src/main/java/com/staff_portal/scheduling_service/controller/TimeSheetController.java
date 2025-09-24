package com.staff_portal.scheduling_service.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
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

import com.staff_portal.scheduling_service.dto.request.TimeSheetRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/timesheets")
@CrossOrigin(origins="http://localhost:5173")
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
    
    @GetMapping("/{id}")
    public ResponseEntity<TimeSheetResponseDTO> getTimesheetById(@PathVariable Long id) {
        TimeSheetResponseDTO responseDto = timeSheetService.getTimeSheetById(id);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeSheetResponseDTO> updateTimesheet(@PathVariable Long id,
                                                                 @Valid @RequestBody TimeSheetRequestDTO requestDto) {
        TimeSheetResponseDTO responseDto = timeSheetService.updateTimeSheet(id, requestDto);
        return ResponseEntity.ok(responseDto);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimesheet(@PathVariable Long id) {
        timeSheetService.deleteTimesheet(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/by-date")
    public Page<TimeSheetResponseDTO> getTimeSheets(
            @RequestParam String batchCycleName,
            @RequestParam String courseName,
            @RequestParam String moduleName,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        
        return timeSheetService.getFilteredTimeSheets(
                batchCycleName, courseName, moduleName, startDate, endDate, page, size);
    }
}


