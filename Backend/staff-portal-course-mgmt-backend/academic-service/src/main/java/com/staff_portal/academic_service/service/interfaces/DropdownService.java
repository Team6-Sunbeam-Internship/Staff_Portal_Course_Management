package com.staff_portal.academic_service.service.interfaces;

import java.util.List;

import com.staff_portal.academic_service.dto.response.DropdownDTO;

public interface DropdownService {
    List<DropdownDTO> getBatchCycles();
    List<DropdownDTO> getAllCourseTypes();
    List<DropdownDTO> getCoursesByCourseType(Integer courseTypeId);
    List<DropdownDTO> getModulesByCourse(Integer courseId);
    List<DropdownDTO> getSubjectsByModule(Integer moduleId);
    List<DropdownDTO> getSectionsBySubject(Integer subjectId);
    List<DropdownDTO> getTopicsBySection(Integer sectionId);
}
