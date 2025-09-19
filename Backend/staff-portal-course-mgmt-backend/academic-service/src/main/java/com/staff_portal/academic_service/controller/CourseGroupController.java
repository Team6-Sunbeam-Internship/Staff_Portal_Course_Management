package com.staff_portal.academic_service.controller;

import java.util.List;

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

import com.staff_portal.academic_service.dto.request.CourseGroupRequest;
import com.staff_portal.academic_service.dto.response.CourseGroupResponse;
import com.staff_portal.academic_service.enums.CourseGroupStatus;
import com.staff_portal.academic_service.service.interfaces.CourseGroupService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/course-groups")
@RequiredArgsConstructor
public class CourseGroupController {

    private final CourseGroupService courseGroupService;
    
 //  Create Course Group
    @PostMapping
    public ResponseEntity<CourseGroupResponse> createCourseGroup(@RequestBody CourseGroupRequest request) {
        CourseGroupResponse response = courseGroupService.createCourseGroup(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    //update course group
    @PutMapping("/{groupId}")
    public ResponseEntity<CourseGroupResponse> updateCourseGroup(@PathVariable int groupId,
                                                                 @RequestBody CourseGroupRequest request) {
        return ResponseEntity.ok(courseGroupService.updateCourseGroup(groupId, request));
    }

    // deleting course group
    @DeleteMapping("/{groupId}")
    public ResponseEntity<String> deleteCourseGroup(@PathVariable int groupId) {
        courseGroupService.deleteCourseGroup(groupId);
        return ResponseEntity.ok("Course group deleted successfully");
}
    // for getting all course groups
    @GetMapping
    public ResponseEntity<List<CourseGroupResponse>> getAllCourseGroups() {
        List<CourseGroupResponse> responses = courseGroupService.getAllCourseGroups();
        return ResponseEntity.ok(responses);
    }
  
 // Get groups by BatchCycle
    @GetMapping("/by-batch/{batchCycleId}")
    public ResponseEntity<List<CourseGroupResponse>> getGroupsByBatch(@PathVariable Long batchCycleId) {
        return ResponseEntity.ok(courseGroupService.getGroupsByBatchCycle(batchCycleId));
    }

    // Get groups by Course
    @GetMapping("/by-course/{courseId}")
    public ResponseEntity<List<CourseGroupResponse>> getGroupsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(courseGroupService.getGroupsByCourse(courseId));
    }

    // Get groups by Status
    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<CourseGroupResponse>> getGroupsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(courseGroupService.getGroupsByStatus(status));
    }
    
}
