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
    public ResponseEntity<ApiResponse<UUID>> addCourseType(@RequestBody CourseTypeRequestDTO requestDTO) {
        ApiResponse<UUID> courseTypeResponse = courseTypeService.createCourseType(requestDTO);
        return ResponseEntity.ok(courseTypeResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCourseType(@PathVariable int id, @RequestBody CourseTypeRequestDTO requestDTO) {
        CourseTypeResponseDTO response = courseTypeService.updateCourseType(id, requestDTO);
        return ResponseEntity.ok(new CustomResponse<>(false, "createCourseType s Successfully!", response));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCourseType(@PathVariable int id) {
        courseTypeService.deleteCourseType(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "createCourseType Deleted Successfully!", null));
    }

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<CourseTypeResponseDTO>>> getAllCourseTypes() {
        ApiResponse<List<CourseTypeResponseDTO>> response = courseTypeService.getAllCourseTypes();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseTypeById(@PathVariable int id) {
        CourseTypeResponseDTO response = courseTypeService.getCourseTypeById(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "createCourseType Found", response));
    }

//   
//    @GetMapping("/byBatchCycle")
//    public ResponseEntity<?> getCourseTypesByBatchCycle(@RequestParam Integer batchCycleId) {
//        List<CourseTypeResponseDTO> response = courseTypeService.getCourseTypesByBatchCycleId(batchCycleId);
//        return ResponseEntity.ok(new CustomResponse<>(false, "Course types fetched", response));
//    }
}
