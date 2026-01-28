package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.SubjectRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.exception.ResourseAlreadyExistException;
import com.staff_portal.academic_service.model.Module;
import com.staff_portal.academic_service.model.Subject;
import com.staff_portal.academic_service.repository.ModuleRepository;
import com.staff_portal.academic_service.repository.SubjectRepository;
import com.staff_portal.academic_service.service.interfaces.SubjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;
    private final ModuleRepository moduleRepository;

    @Override
    public ApiResponse<UUID> createSubject(UUID moduleId, SubjectRequestDTO requestDTO) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Module not found with id %s", moduleId)));

        if (subjectRepository.existsBySubjectCode(requestDTO.getSubjectCode())) {
            throw new ResourseAlreadyExistException(String.format("Subject already exists with code %s", requestDTO.getSubjectCode()), HttpStatus.BAD_REQUEST);
        }

        Subject subject = Subject.builder()
                .subjectCode(requestDTO.getSubjectCode())
                .subjectName(requestDTO.getSubjectName())
                .theoryHours(requestDTO.getTheoryHours())
                .practicalHours(requestDTO.getPracticalHours())
                .module(module)
                .build();

        Subject savedSubject = subjectRepository.save(subject);
        return ApiResponse.onSuccess(savedSubject.getSubjectId());
    }

    @Override
    public ApiResponse<String> updateSubject(UUID subjectId, SubjectRequestDTO requestDTO) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Subject not found with id %s", subjectId)));

        subject.setSubjectCode(requestDTO.getSubjectCode());
        subject.setSubjectName(requestDTO.getSubjectName());
        subject.setTheoryHours(requestDTO.getTheoryHours());
        subject.setPracticalHours(requestDTO.getPracticalHours());

        subjectRepository.save(subject);
        return ApiResponse.onSuccess(String.format("Subject with id %s updated successfully", subjectId));
    }

    @Override
    @Transactional
    public void deleteSubject(UUID id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Subject not found with id %s", id)));

        subject.setDeleted(true);

        if (subject.getSections() != null) {
            subject.getSections().forEach(section -> {
                section.setDeleted(true);

                if (section.getTopics() != null) {
                    section.getTopics().forEach(topic -> {
                        topic.setDeleted(true);
                    });
                }
            });
        }
    }
}
