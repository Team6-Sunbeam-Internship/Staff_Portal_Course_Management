package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.request.CourseRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseResponseDTO;
//import com.staff_portal.academic_service.model.Course;


public interface CourseService {
	
	    CourseResponseDTO addCourse(CourseRequestDTO requestDTO);
	    CourseResponseDTO updateCourse(int id, CourseRequestDTO requestDTO);
	    void deleteCourse(int id);
	    List<CourseResponseDTO> getAllCourses();
	    CourseResponseDTO getCourseById(int id);
	   
	 
	    List<CourseResponseDTO> getCoursesByFilters(Integer batchCycleId, Integer courseTypeId);
	    
	    

	}

