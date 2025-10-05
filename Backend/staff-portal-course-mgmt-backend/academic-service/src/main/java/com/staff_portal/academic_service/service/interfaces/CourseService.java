package com.staff_portal.academic_service.service.interfaces;

import java.util.List;
import java.util.UUID;

import com.staff_portal.academic_service.dto.request.CourseRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseResponseDTO;
import com.staff_portal.academic_service.dto.response.PaginatedCourseResponseDTO;
import org.springframework.data.domain.Page;

public interface CourseService {
    ApiResponse<Page<PaginatedCourseResponseDTO>> getPaginatedCourse(String searchTerm, UUID courseTypeId, UUID batchCycleId, UUID premiseId, int page, int size);

    ApiResponse<UUID> createCourse(CourseRequestDTO requestDTO);

    ApiResponse<String> updateCourse(UUID id, CourseRequestDTO requestDTO);

    void deleteCourse(int id);

    List<CourseResponseDTO> getAllCourses();
}

