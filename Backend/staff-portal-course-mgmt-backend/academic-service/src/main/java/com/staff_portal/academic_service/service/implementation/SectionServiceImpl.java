package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.SectionRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.exception.ResourseAlreadyExistException;
import com.staff_portal.academic_service.model.Section;
import com.staff_portal.academic_service.model.Subject;
import com.staff_portal.academic_service.repository.SectionRepository;
import com.staff_portal.academic_service.repository.SubjectRepository;
import com.staff_portal.academic_service.service.interfaces.SectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public ApiResponse<UUID> createSection(UUID subjectId, SectionRequestDTO requestDTO) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Subject %s not found", subjectId)));

        if(sectionRepository.existsBySectionCode(requestDTO.getSectionCode())){
            throw new ResourseAlreadyExistException(String.format("Section already exists with code %s", requestDTO.getSectionCode()), HttpStatus.BAD_REQUEST);
        }
        Section section = Section.builder()
                .sectionCode(requestDTO.getSectionCode())
                .sectionName(requestDTO.getSectionName())
                .subject(subject)
                .build();
        Section savedSection = sectionRepository.save(section);
        return ApiResponse.onSuccess(savedSection.getSectionId());
    }

    @Override
    public ApiResponse<String> updateSection(UUID sectionId, SectionRequestDTO requestDTO) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section id %s not found", sectionId)));

        section.setSectionCode(requestDTO.getSectionCode());
        section.setSectionName(requestDTO.getSectionName());

        sectionRepository.save(section);
        return ApiResponse.onSuccess(String.format("Updated section with code %s", section.getSectionCode()));
    }

    @Override
    @Transactional
    public void deleteSection(UUID sectionId) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Section id %s not found", sectionId)));

        // Soft delete section
        section.setDeleted(true);

        // Cascade soft delete to topics
        if (section.getTopics() != null) {
            section.getTopics().forEach(topic -> {
                topic.setDeleted(true);
            });
        }
    }

}
