package com.staff_portal.academic_service.dto.response;

import com.staff_portal.academic_service.model.Module;
import com.staff_portal.academic_service.model.Section;
import com.staff_portal.academic_service.model.Subject;

public class ModuleMapper {

    public static ModuleHierarchyDTO toHierarchyDTO(Module module) {
        if (module == null) return null;

        ModuleHierarchyDTO dto = new ModuleHierarchyDTO();
        dto.setId(module.getModuleId());
        dto.setName(module.getModuleName());
        dto.setCourseCode(module.getCourse().getCourseCode());

        dto.setSubjects(
            module.getSubjects().stream()
                .map(ModuleMapper::toSubjectHierarchyDTO)
                .toList()
        );

        return dto;
    }

    private static SubjectHierarchyDTO toSubjectHierarchyDTO(Subject subject) {
        SubjectHierarchyDTO dto = new SubjectHierarchyDTO();
        dto.setId(subject.getSubjectId());
        dto.setName(subject.getSubjectName());
        dto.setSections(
            subject.getSections().stream()
                .map(ModuleMapper::toSectionHierarchyDTO)
                .toList()
        );
        return dto;
    }

    private static SectionHierarchyDTO toSectionHierarchyDTO(Section section) {
        SectionHierarchyDTO dto = new SectionHierarchyDTO();
        dto.setId(section.getSectionId());
        dto.setName(section.getSectionName());
        dto.setTopics(
            section.getTopics().stream()
                .map(t -> new TopicSimpleDTO(t.getTopicId(), t.getTopicName()))
                .toList()
        );
        return dto;
    }
}
