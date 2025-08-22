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
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.academic_service.dto.request.CourseGroupRequest;
import com.staff_portal.academic_service.dto.response.CourseGroupResponse;
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
    
}
