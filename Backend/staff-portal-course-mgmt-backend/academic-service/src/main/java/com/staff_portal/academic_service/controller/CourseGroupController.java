package com.staff_portal.academic_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
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

}
