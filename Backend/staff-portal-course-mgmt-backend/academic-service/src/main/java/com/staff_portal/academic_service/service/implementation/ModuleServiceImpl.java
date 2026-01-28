package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.ModuleRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.exception.ResourseAlreadyExistException;
import com.staff_portal.academic_service.model.*;
import com.staff_portal.academic_service.model.Module;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.repository.CourseTypeRepository;
import com.staff_portal.academic_service.repository.ModuleRepository;
import com.staff_portal.academic_service.service.interfaces.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ModuleServiceImpl implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;


    @Override
    public ApiResponse<UUID> createModule(String courseCode, ModuleRequestDTO requestDTO) {
        Course course = courseRepository.findByCourseCode(courseCode).orElseThrow(() -> new ResourceNotFoundException(String.format("Course with code %s not found", courseCode)));

        if (moduleRepository.existsByCourseAndModuleCode(course, requestDTO.getModuleCode())) {
            throw new ResourseAlreadyExistException(
                    String.format("Module with moduleCode [%s] already exist", requestDTO.getModuleCode()),
                    HttpStatus.FORBIDDEN
            );
        }

        Module module = Module.builder()
                .moduleCode(requestDTO.getModuleCode())
                .moduleName(requestDTO.getModuleName())
                .theoryHours(requestDTO.getTheoryHours())
                .practicalHours(requestDTO.getPracticalHours())
                .course(course)
                .build();

        Module savedModule = moduleRepository.save(module);
        return ApiResponse.onSuccess(savedModule.getModuleId());
    }

    // Update Module
    @Override
    public ApiResponse<String> updateModule(UUID moduleId, ModuleRequestDTO requestDTO) {
        Module module = moduleRepository.findById(moduleId).orElseThrow(() -> new ResourceNotFoundException(String.format("Module with moduleCode: [%s] found", moduleId)));
        module.setModuleName(requestDTO.getModuleName());
        module.setModuleCode(requestDTO.getModuleCode());
        module.setTheoryHours(requestDTO.getTheoryHours());
        module.setPracticalHours(requestDTO.getPracticalHours());

        moduleRepository.save(module);
        return ApiResponse.onSuccess(String.format("Module with moduleCode: [%s] updated", module.getModuleCode()));
    }

    // Soft Delete Module + cascading subjects → sections → topics
    @Transactional
    @Override
    public void deleteModule(UUID moduleId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Module with moduleCode: [%s] found", moduleId)));

        module.setDeleted(true);

        if (module.getSubjects() != null) {
            for (Subject subject : module.getSubjects()) {
                subject.setDeleted(true);
                if (subject.getSections() != null) {
                    for (Section section : subject.getSections()) {
                        section.setDeleted(true);
                        if (section.getTopics() != null) {
                            for (Topic topic : section.getTopics()) {
                                topic.setDeleted(true);
                            }
                        }
                    }
                }
            }
        }

        moduleRepository.save(module); // save the changes
    }
}
