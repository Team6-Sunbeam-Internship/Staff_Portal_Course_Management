package com.staff_portal.academic_service.controller;

import java.util.List;
import java.util.UUID;

//import org.springframework.beans.factory.annotation.Autowired;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.PaginatedCourseResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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

import com.staff_portal.academic_service.dto.request.CourseRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseResponseDTO;
import com.staff_portal.academic_service.service.interfaces.CourseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/course")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/getPaginated")
    public ResponseEntity<ApiResponse<Page<PaginatedCourseResponseDTO>>> getPaginatedCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String courseTypeId,
            @RequestParam(required = false) String batchCycleId,
            @RequestParam(required = false) String premiseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "72") int size
    ) {
        ApiResponse<Page<PaginatedCourseResponseDTO>> paginatedCourse = courseService.getPaginatedCourse(search, UUID.fromString(courseTypeId), UUID.fromString(batchCycleId), UUID.fromString(premiseId), page, size);
        return ResponseEntity.ok(paginatedCourse);
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UUID>> create(@RequestBody CourseRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.createCourse(requestDTO));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateCourse(@PathVariable UUID id, @RequestBody CourseRequestDTO requestDTO) {
        return ResponseEntity.ok(courseService.updateCourse(id, requestDTO));
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
