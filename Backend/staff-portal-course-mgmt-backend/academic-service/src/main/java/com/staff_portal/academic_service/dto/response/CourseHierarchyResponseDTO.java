package com.staff_portal.academic_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

import java.util.List;

@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
public class CourseHierarchyResponseDTO {
    private List<ModuleResponseDTO> modules;
    private List<SubjectResponseDTO> subjects;
    private List<SectionResponseDTO> sections;
    private List<TopicResponseDTO> topics;
}

