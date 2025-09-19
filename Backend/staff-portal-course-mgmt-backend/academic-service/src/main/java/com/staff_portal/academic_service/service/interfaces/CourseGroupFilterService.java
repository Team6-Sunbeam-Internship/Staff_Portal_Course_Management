package com.staff_portal.academic_service.service.interfaces;

import java.util.List;
import com.staff_portal.academic_service.dto.response.CourseGroupFilterDTO;

public interface CourseGroupFilterService {
	List<CourseGroupFilterDTO> getBatchCycles();
	List<CourseGroupFilterDTO> getCourses();   
    List<CourseGroupFilterDTO> getStatuses();

}
