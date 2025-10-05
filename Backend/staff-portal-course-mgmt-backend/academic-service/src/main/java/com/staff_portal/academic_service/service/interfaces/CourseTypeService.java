package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.request.CourseTypeRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseTypeResponseDTO;

public interface CourseTypeService {
    CourseTypeResponseDTO addCourseType(CourseTypeRequestDTO requestDTO);
    
    CourseTypeResponseDTO updateCourseType(int id, CourseTypeRequestDTO requestDTO);
    
    void deleteCourseType(int id);
    
    ApiResponse<List<CourseTypeResponseDTO>> getAllCourseTypes();
    
    CourseTypeResponseDTO getCourseTypeById(int id);
    
//    List<CourseTypeResponseDTO> getCourseTypesByBatchCycleId(Integer batchCycleId);
}