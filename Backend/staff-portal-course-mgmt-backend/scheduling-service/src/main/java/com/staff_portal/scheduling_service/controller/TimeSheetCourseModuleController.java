package com.staff_portal.scheduling_service.controller;

import com.staff_portal.scheduling_service.dto.request.TimeSheetCourseModuleRequestDTO;
import com.staff_portal.scheduling_service.dto.response.TimeSheetCourseModuleResponseDTO;
import com.staff_portal.scheduling_service.service.interfaces.ITimeSheetCourseModuleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/timesheetcoursemodule")
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

    @GetMapping("/{id}")
    public ResponseEntity<TimeSheetCourseModuleResponseDTO> getById(@PathVariable UUID id) {
        TimeSheetCourseModuleResponseDTO responseDto = courseModuleService.getTimeSheetCourseModuleById(id);
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TimeSheetCourseModuleResponseDTO> update(@PathVariable UUID id,
                                                                   @Valid @RequestBody TimeSheetCourseModuleRequestDTO requestDto) {
        TimeSheetCourseModuleResponseDTO responseDto = courseModuleService.updateTimeSheetCourseModule(id, requestDto);
        return ResponseEntity.ok(responseDto);
    }
}