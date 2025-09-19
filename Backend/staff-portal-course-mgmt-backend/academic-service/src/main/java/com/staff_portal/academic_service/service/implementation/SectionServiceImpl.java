package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.SectionRequestDTO;
import com.staff_portal.academic_service.dto.response.SectionResponseDTO;
import com.staff_portal.academic_service.enums.SectionStatus;
import com.staff_portal.academic_service.model.Section;
import com.staff_portal.academic_service.model.Subject;
import com.staff_portal.academic_service.repository.SectionRepository;
import com.staff_portal.academic_service.repository.SubjectRepository;
import com.staff_portal.academic_service.service.interfaces.SectionService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
    public void deleteSection(int id) {
        if (!sectionRepository.existsById(id)) {
            throw new RuntimeException("Section not found");
        }
        sectionRepository.deleteById(id);
    }

    @Override
    public List<SectionResponseDTO> getAllSections() {
        return sectionRepository.findAll()
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
        List<Section> sections = sectionRepository.findBySubject_SubjectId(subjectId);

        return sections.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    private SectionResponseDTO mapToResponse(Section section) {
        SectionResponseDTO response = new SectionResponseDTO();
        response.setSectionId(section.getSectionId());
        response.setSectionName(section.getSectionName());
        response.setStatus(section.getStatus());

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
