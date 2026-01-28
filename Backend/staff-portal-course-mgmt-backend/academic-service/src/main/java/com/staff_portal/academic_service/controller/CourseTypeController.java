package com.staff_portal.academic_service.controller;


import com.staff_portal.academic_service.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.staff_portal.academic_service.dto.request.CourseTypeRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseTypeResponseDTO;
import com.staff_portal.academic_service.service.interfaces.CourseTypeService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/course-types")
@RequiredArgsConstructor
public class CourseTypeController {

    private final CourseTypeService courseTypeService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UUID>> createCourseType(@RequestBody CourseTypeRequestDTO requestDTO) {
        ApiResponse<UUID> courseTypeResponse = courseTypeService.createCourseType(requestDTO);
        return ResponseEntity.ok(courseTypeResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCourseType(@PathVariable UUID id, @RequestBody CourseTypeRequestDTO requestDTO) {
        ApiResponse<String> udpateApiResponse = courseTypeService.updateCourseType(id, requestDTO);
        return ResponseEntity.ok(udpateApiResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCourseType(@PathVariable String id) {
        courseTypeService.deleteCourseType(UUID.fromString(id));
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<CourseTypeResponseDTO>>> getAllCourseTypes() {
        ApiResponse<List<CourseTypeResponseDTO>> response = courseTypeService.getAllCourseTypes();
        return ResponseEntity.ok(response);
    }
}
