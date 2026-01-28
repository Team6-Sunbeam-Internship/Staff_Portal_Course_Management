package com.staff_portal.academic_service.controller;

import com.staff_portal.academic_service.dto.request.CourseCoordinatorAssignRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseCoordinatorAssignCourseResponseDTO;
import com.staff_portal.academic_service.dto.response.CourseCoordinatorAssignResponseDTO;
import com.staff_portal.academic_service.service.interfaces.ICourseCoordinatorAssignService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
@RestController
@RequestMapping("/assign-course")
public class CourseCoordinatorAssignController {
    private final ICourseCoordinatorAssignService courseCoordinatorAssignService;

    public CourseCoordinatorAssignController(ICourseCoordinatorAssignService courseCoordinatorAssignService) {
        this.courseCoordinatorAssignService = courseCoordinatorAssignService;
    }

    @GetMapping("/getAll")
    public ResponseEntity<ApiResponse<List<CourseCoordinatorAssignResponseDTO>>> getAllCourseCoordinatorAssignment(){
        return ResponseEntity.ok(courseCoordinatorAssignService.getAllAssignments());
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<UUID>> createCourseCoordinatorAssignment(@RequestBody CourseCoordinatorAssignRequestDTO courseCoordinatorAssignRequestDTO){
        return ResponseEntity.ok(courseCoordinatorAssignService.createAssignment(courseCoordinatorAssignRequestDTO));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<String>> updateCourseCoordinatorAssignment(@PathVariable UUID id, @RequestBody CourseCoordinatorAssignRequestDTO courseCoordinatorAssignRequestDTO){
        return ResponseEntity.ok(courseCoordinatorAssignService.updateAssignment(id, courseCoordinatorAssignRequestDTO));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCourseCoordinatorAssignment(@PathVariable UUID id){
        return  ResponseEntity.ok(courseCoordinatorAssignService.deleteAssignment(id));
    }

    @GetMapping("/courseCoordinator/getAssignCourse")
    public ResponseEntity<ApiResponse<List<CourseCoordinatorAssignCourseResponseDTO>>> getCourseCoordinatorAssignCourse(Authentication authentication){
        return ResponseEntity.ok(courseCoordinatorAssignService.getAssignCourse(authentication));
    }
}
