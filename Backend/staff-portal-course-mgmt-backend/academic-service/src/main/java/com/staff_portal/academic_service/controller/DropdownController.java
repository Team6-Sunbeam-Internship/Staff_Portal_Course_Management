package com.staff_portal.academic_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.staff_portal.academic_service.dto.response.DropdownDTO;
import com.staff_portal.academic_service.service.interfaces.DropdownService;

import lombok.RequiredArgsConstructor;
@CrossOrigin(origins = "http://localhost:5176")
@RestController
@RequestMapping("/api/dropdowns")
@RequiredArgsConstructor
public class DropdownController {

    private final DropdownService dropdownService;

    @GetMapping("/batchcycles")
    public List<DropdownDTO> getBatchCycles() {
        return dropdownService.getBatchCycles();
    }


    @GetMapping("/coursetypes")
    public List<DropdownDTO> getCourseTypes() {
        return dropdownService.getAllCourseTypes();
    }
    
    @GetMapping("/courses/{courseTypeId}")
    public List<DropdownDTO> getCourses(@PathVariable Integer courseTypeId) {
        return dropdownService.getCoursesByCourseType(courseTypeId);
    }
    
    
    @GetMapping("/courses")
    public List<DropdownDTO> getCourses(
            @RequestParam Integer batchCycleId,
            @RequestParam Integer courseTypeId
    ) {
        return dropdownService.getCoursesByBatchAndType(batchCycleId, courseTypeId);
    }
    

    @GetMapping("/modules/{courseId}")
    public List<DropdownDTO> getModules(@PathVariable Integer courseId) {
        return dropdownService.getModulesByCourse(courseId);
    }

    @GetMapping("/subjects/{moduleId}")
    public List<DropdownDTO> getSubjects(@PathVariable Integer moduleId) {
        return dropdownService.getSubjectsByModule(moduleId);
    }
    

    @GetMapping("/sections/{subjectId}")
    public List<DropdownDTO> getSections(@PathVariable Integer subjectId) {
        return dropdownService.getSectionsBySubject(subjectId);
    }

  
    @GetMapping("/topics/{sectionId}")
    public List<DropdownDTO> getTopics(@PathVariable Integer sectionId) {
        return dropdownService.getTopicsBySection(sectionId);
    }
}
