package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.request.CourseTypeRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseTypeResponseDTO;

public interface CourseTypeService {
    CourseTypeResponseDTO addCourseType(CourseTypeRequestDTO requestDTO);
    
    CourseTypeResponseDTO updateCourseType(int id, CourseTypeRequestDTO requestDTO);
    
    void deleteCourseType(int id);
    
    List<CourseTypeResponseDTO> getAllCourseTypes();
    
    CourseTypeResponseDTO getCourseTypeById(int id);
    
    // new filter by batchCycleName
    List<CourseTypeResponseDTO> getCourseTypesByBatchCycleName(String cycleName);
}