package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.SectionRequestDTO;
import com.staff_portal.academic_service.dto.response.SectionResponseDTO;
import com.staff_portal.academic_service.enums.SectionStatus;
import com.staff_portal.academic_service.enums.TopicStatus;
import com.staff_portal.academic_service.model.Section;
import com.staff_portal.academic_service.model.Subject;
//import com.staff_portal.academic_service.model.Topic;
import com.staff_portal.academic_service.repository.SectionRepository;
import com.staff_portal.academic_service.repository.SubjectRepository;
import com.staff_portal.academic_service.service.interfaces.SectionService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public SectionResponseDTO addSection(SectionRequestDTO requestDTO) {
        Subject subject = subjectRepository.findById(requestDTO.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        if (sectionRepository.existsBySectionNameAndSubject_SubjectId(
                requestDTO.getSectionName(), requestDTO.getSubjectId())) {
            throw new RuntimeException("Section already exists for this subject");
        }

        Section section = new Section();
        section.setSubject(subject);
        section.setSectionName(requestDTO.getSectionName());
        section.setStatus(requestDTO.getStatus() != null ? requestDTO.getStatus() : SectionStatus.ACTIVE);
        section.setDeleted(false);

        Section saved = sectionRepository.save(section);
        return mapToResponse(saved);
    }

    @Override
    public SectionResponseDTO updateSection(int id, SectionRequestDTO requestDTO) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        Subject subject = subjectRepository.findById(requestDTO.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        section.setSubject(subject);
        section.setSectionName(requestDTO.getSectionName());
        section.setStatus(requestDTO.getStatus());

        sectionRepository.save(section);
        return mapToResponse(section);
    }

    @Override
    @Transactional
    public void deleteSection(int id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        // Soft delete section
        section.setDeleted(true);
        section.setStatus(SectionStatus.INACTIVE);

        // Cascade soft delete to topics
        if (section.getTopics() != null) {
            section.getTopics().forEach(topic -> {
                topic.setDeleted(true);
                topic.setStatus(TopicStatus.INACTIVE);
            });
        }

        // No explicit save needed due to @Transactional and JPA dirty checking
    }

    @Override
    public List<SectionResponseDTO> getAllSections() {
        return sectionRepository.findByDeletedFalse()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public SectionResponseDTO getSectionById(int id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Section not found"));
        return mapToResponse(section);
    }

    @Override
    public List<SectionResponseDTO> filterSections(
            Integer batchCycleId,
            Integer courseTypeId,
            Integer courseId,
            Integer moduleId,
            Integer subjectId
    ) {
        List<Section> sections = sectionRepository.filterSections(
                batchCycleId, courseTypeId, courseId, moduleId, subjectId
        );

        return sections.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SectionResponseDTO> getSectionsBySubject(Integer subjectId) {
        List<Section> sections = sectionRepository.findBySubject_SubjectIdAndDeletedFalse(subjectId);

        return sections.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Mapper (Entity → DTO)
    private SectionResponseDTO mapToResponse(Section section) {
        SectionResponseDTO response = new SectionResponseDTO();
        response.setSectionId(section.getSectionId());
        response.setSectionName(section.getSectionName());
        response.setStatus(section.getStatus());
        response.setDeleted(section.isDeleted());

        if (section.getSubject() != null) {
            response.setSubjectName(section.getSubject().getSubjectName());

            if (section.getSubject().getModule() != null) {
                response.setModuleName(section.getSubject().getModule().getModuleName());

                if (section.getSubject().getModule().getCourse() != null &&
                        section.getSubject().getModule().getCourse().getCourseType() != null) {
                    response.setCourseTypeName(section.getSubject().getModule().getCourse().getCourseType().getTypeName());
                }
            }
        }
        return response;
    }
}
