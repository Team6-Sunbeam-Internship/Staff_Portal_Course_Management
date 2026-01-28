package com.staff_portal.academic_service.service.interfaces;

import com.staff_portal.academic_service.dto.request.CourseCoordinatorAssignRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseCoordinatorAssignCourseResponseDTO;
import com.staff_portal.academic_service.dto.response.CourseCoordinatorAssignResponseDTO;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.UUID;

public interface ICourseCoordinatorAssignService {
    ApiResponse<List<CourseCoordinatorAssignCourseResponseDTO>> getAssignCourse(Authentication authentication);

    ApiResponse<List<CourseCoordinatorAssignResponseDTO>> getAllAssignments();

    ApiResponse<UUID> createAssignment(CourseCoordinatorAssignRequestDTO request);

    ApiResponse<String> updateAssignment(UUID id, CourseCoordinatorAssignRequestDTO request);

    ApiResponse<String> deleteAssignment(UUID id);
}
