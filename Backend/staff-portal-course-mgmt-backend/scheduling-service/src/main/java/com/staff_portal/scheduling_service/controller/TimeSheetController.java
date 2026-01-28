package com.staff_portal.scheduling_service.controller;

import com.staff_portal.scheduling_service.dto.request.TimeSheetRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/timesheet")
@CrossOrigin(origins = "http://localhost:5173")
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
    public ResponseEntity<TimeSheetResponseDTO> getTimesheetById(@PathVariable UUID id) {
        TimeSheetResponseDTO responseDto = timeSheetService.getTimeSheetById(id);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeSheetResponseDTO> updateTimesheet(@PathVariable UUID id,
                                                                @Valid @RequestBody TimeSheetRequestDTO requestDto) {
        TimeSheetResponseDTO responseDto = timeSheetService.updateTimeSheet(id, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimesheet(@PathVariable UUID id) {
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


