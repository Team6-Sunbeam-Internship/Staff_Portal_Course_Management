package com.staff_portal.academic_service.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.staff_portal.academic_service.dto.request.CourseTypeRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseTypeResponseDTO;
import com.staff_portal.academic_service.dto.response.CustomResponse;
import com.staff_portal.academic_service.service.interfaces.CourseTypeService;

import java.util.List;

@RestController
@RequestMapping("/api/coursetypes")
@RequiredArgsConstructor
public class CourseTypeController {

    private final CourseTypeService courseTypeService;

    @PostMapping("/add")
    public ResponseEntity<?> addCourseType(@RequestBody CourseTypeRequestDTO requestDTO) {
        CourseTypeResponseDTO response = courseTypeService.addCourseType(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>(false, "CourseType Added Successfully!", response));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCourseType(@PathVariable int id, @RequestBody CourseTypeRequestDTO requestDTO) {
        CourseTypeResponseDTO response = courseTypeService.updateCourseType(id, requestDTO);
        return ResponseEntity.ok(new CustomResponse<>(false, "CourseType s Successfully!", response));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCourseType(@PathVariable int id) {
        courseTypeService.deleteCourseType(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "CourseType Deleted Successfully!", null));
    }

    @GetMapping
    public ResponseEntity<?> getAllCourseTypes() {
        List<CourseTypeResponseDTO> response = courseTypeService.getAllCourseTypes();
        return ResponseEntity.ok(new CustomResponse<>(false, "All CourseTypes Fetched", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseTypeById(@PathVariable int id) {
        CourseTypeResponseDTO response = courseTypeService.getCourseTypeById(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "CourseType Found", response));
    }
 
    // 🔹 New filter by BatchCycle Name
    @GetMapping("/batchcycle/{cycleName}")
    public ResponseEntity<?> getCourseTypesByBatchCycleName(@PathVariable String cycleName) {
        List<CourseTypeResponseDTO> response = courseTypeService.getCourseTypesByBatchCycleName(cycleName);
        return ResponseEntity.ok(new CustomResponse<>(false, "CourseTypes for BatchCycle fetched", response));
    }
}
