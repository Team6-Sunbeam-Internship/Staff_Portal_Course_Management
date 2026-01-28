package com.staff_portal.academic_service.controller;

import com.staff_portal.academic_service.dto.request.CourseGroupRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseGroupResponse;
import com.staff_portal.academic_service.service.interfaces.CourseGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/course-groups")
@RequiredArgsConstructor
public class CourseGroupController {

	private final CourseGroupService courseGroupService;

	// Create Course Group
	@PostMapping("/create/{courseCode}")
	public ResponseEntity<ApiResponse<List<UUID>>> createCourseGroup(@PathVariable("courseCode")String courseCode,@RequestBody List<CourseGroupRequest> courseGroupRequests) {
        ApiResponse<List<UUID>> createCourseGroupResponse = courseGroupService.createCourseGroup(courseCode, courseGroupRequests);
		return ResponseEntity.status(HttpStatus.CREATED).body(createCourseGroupResponse);
	}

	// update course group
	@PutMapping("/update/{id}")
	public ResponseEntity<ApiResponse<String>> updateCourseGroup(@PathVariable UUID id,
			@RequestBody CourseGroupRequest request) {
        ApiResponse<String> updateCourseGroupResponse = courseGroupService.updateCourseGroup(id, request);
		return ResponseEntity.ok(updateCourseGroupResponse);
	}

	// deleting course group
	@DeleteMapping("/delete/{groupId}")
	public ResponseEntity<ApiResponse<String>> deleteCourseGroup(@PathVariable UUID groupId) {
		courseGroupService.deleteCourseGroup(groupId);
		return ResponseEntity.ok(ApiResponse.onSuccess("Course group deleted successfully"));
	}

	// for getting all course groups
	@GetMapping("/getAll")
	public ResponseEntity<ApiResponse<List<CourseGroupResponse>>> getAllCourseGroups(@RequestParam(required = false, name = "courseCode") String courseCode) {
		ApiResponse<List<CourseGroupResponse>> getCourseGroupResponse = courseGroupService.getAllCourseGroups(courseCode);
		return ResponseEntity.ok(getCourseGroupResponse);
	}
}
