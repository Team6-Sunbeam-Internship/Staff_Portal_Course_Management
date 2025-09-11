package com.staff_portal.academic_service.controller;

import java.util.List;

//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.academic_service.dto.request.CourseRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseResponseDTO;
import com.staff_portal.academic_service.dto.response.CustomResponse;
import com.staff_portal.academic_service.service.interfaces.CourseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @PostMapping("/add")
    public ResponseEntity<?> addCourse(@RequestBody CourseRequestDTO requestDTO) {
        CourseResponseDTO response = courseService.addCourse(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new CustomResponse<>(false, "Course Added Successfully!", response));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable int id, @RequestBody CourseRequestDTO requestDTO) {
        CourseResponseDTO response = courseService.updateCourse(id, requestDTO);
        return ResponseEntity.ok(new CustomResponse<>(false, "Course Updated Successfully!", response));
    }
    
 //delete course
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable int id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "Course Deleted Successfully!", null));
    }

    @GetMapping
    public ResponseEntity<?> getAllCourses() {
        List<CourseResponseDTO> response = courseService.getAllCourses();
        return ResponseEntity.ok(new CustomResponse<>(false, "All Courses Fetched", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable int id) {
        CourseResponseDTO response = courseService.getCourseById(id);
        return ResponseEntity.ok(new CustomResponse<>(false, "Course Found", response));
    }
    
//  
//    @GetMapping("/filterByIds")
//    public ResponseEntity<?> getCoursesByBatchCycleAndType(
//            @RequestParam Integer batchCycleId,
//            @RequestParam Integer courseTypeId) {
//
//        List<CourseResponseDTO> response = courseService.getCoursesByFilters(batchCycleId, courseTypeId);
//        return ResponseEntity.ok(new CustomResponse<>(false, "Courses filtered", response));
//    }
 
    
    @GetMapping("/filterByIds")
    public ResponseEntity<CustomResponse<List<CourseResponseDTO>>> getCoursesByBatchCycleAndType(
            @RequestParam Integer batchCycleId,
            @RequestParam Integer courseTypeId) {

        List<CourseResponseDTO> response = courseService.getCoursesByFilters(batchCycleId, courseTypeId);

        return ResponseEntity.ok(
                new CustomResponse<>(false, "Courses filtered successfully", response)
        );
    }
}
