package com.staff_portal.academic_service.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.academic_service.dto.response.CourseGroupFilterDTO;
import com.staff_portal.academic_service.service.interfaces.CourseGroupFilterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/course-group-filter")
@RequiredArgsConstructor
public class CourseGroupFilterController {

    private final CourseGroupFilterService filterService;

    @GetMapping("/batch-cycles")
    public ResponseEntity<List<CourseGroupFilterDTO>> getBatchCycles() {
        return ResponseEntity.ok(filterService.getBatchCycles());
    }

    @GetMapping("/course-types")
    public ResponseEntity<List<CourseGroupFilterDTO>> getCourseTypes() {
        return ResponseEntity.ok(filterService.getCourseTypes());
    }

    @GetMapping("/status")
    public ResponseEntity<List<CourseGroupFilterDTO>> getStatuses() {
        return ResponseEntity.ok(filterService.getStatuses());
    }
}
