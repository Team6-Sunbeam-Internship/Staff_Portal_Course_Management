package com.staff_portal.academic_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseHierarchyResponseDTO {
    private List<ModuleResponseDTO> modules;
    private List<SubjectResponseDTO> subjects;
    private List<SectionResponseDTO> sections;
    private List<TopicResponseDTO> topics;
}