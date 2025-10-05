package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.CourseTypeRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseTypeResponseDTO;
import com.staff_portal.academic_service.enums.CourseTypeStatus;
import com.staff_portal.academic_service.model.CourseType;
import com.staff_portal.academic_service.repository.*;
import com.staff_portal.academic_service.service.interfaces.CourseTypeService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseTypeServiceImpl implements CourseTypeService {

    private final CourseTypeRepository courseTypeRepository;
    private final PremiseRepository premisesRepository;
    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final SubjectRepository subjectRepository;
    private final SectionRepository sectionRepository;
    private final TopicRepository topicRepository;

    @Override
    public ApiResponse<UUID> createCourseType(CourseTypeRequestDTO requestDTO) {
        CourseType courseType = CourseType.builder()
                .typeName(requestDTO.getTitle())
                .description(requestDTO.getDescription())
                .status(requestDTO.getStatus())
                .build();
        CourseType savedCourseType = courseTypeRepository.save(courseType);
        return ApiResponse.onSuccess(savedCourseType.getCourseTypeId());
    }

    @Override
    public CourseTypeResponseDTO updateCourseType(int id, CourseTypeRequestDTO requestDTO) {
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("createCourseType not found"));

        courseType.setTypeName(requestDTO.getTypeName());
        courseType.setDescription(requestDTO.getDescription());
        courseType.setStatus(requestDTO.getStatus());

        Premises premises = premisesRepository.findById(requestDTO.getPremisesId())
                .orElseThrow(() -> new RuntimeException("Premises not found"));

        courseType.setPremises(premises);
        courseTypeRepository.save(courseType);

        return mapToResponse(courseType);
    }

    @Override
    @Transactional
    public void deleteCourseType(int id) {
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("createCourseType not found"));

        // Soft delete parent
        courseType.setDeleted(true);
        courseTypeRepository.save(courseType);

        // Cascade soft delete: Courses → Modules → Subjects → Sections → Topics
        if (courseType.getCourses() != null) {
            courseType.getCourses().forEach(course -> {
                course.setDeleted(true);
                courseRepository.save(course);

                if (course.getModules() != null) {
                    course.getModules().forEach(module -> {
                        module.setDeleted(true);
                        moduleRepository.save(module);

                        if (module.getSubjects() != null) {
                            module.getSubjects().forEach(subject -> {
                                subject.setDeleted(true);
                                subjectRepository.save(subject);

                                if (subject.getSections() != null) {
                                    subject.getSections().forEach(section -> {
                                        section.setDeleted(true);
                                        sectionRepository.save(section);

                                        if (section.getTopics() != null) {
                                            section.getTopics().forEach(topic -> {
                                                topic.setDeleted(true);
                                                topicRepository.save(topic);
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    @Override
    public ApiResponse<List<CourseTypeResponseDTO>> getAllCourseTypes() {
        List<CourseTypeResponseDTO> listOfCourseType = courseTypeRepository
                .findByDeletedFalse()
                .stream()
                .map(courseType -> CourseTypeResponseDTO.builder()
                        .courseTypeId(courseType.getCourseTypeId())
                        .title(courseType.getTypeName())
                        .description(courseType.getDescription())
                        .status(courseType.getStatus())
                        .build())
                .toList();
        return ApiResponse.onSuccess(listOfCourseType);
    }

    @Override
    public CourseTypeResponseDTO getCourseTypeById(int id) {
        CourseType courseType = courseTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("createCourseType not found"));

        if (courseType.isDeleted()) {
            throw new RuntimeException("createCourseType not found");
        }
        return mapToResponse(courseType);
    }

    private CourseTypeResponseDTO mapToResponse(CourseType courseType) {
        CourseTypeResponseDTO response = new CourseTypeResponseDTO();
        response.setCourseTypeId(courseType.getCourseTypeId());
        response.setTypeName(courseType.getTypeName());
        response.setDescription(courseType.getDescription());
        response.setStatus(courseType.getStatus());
        response.setDeleted(courseType.isDeleted());

        if (courseType.getPremises() != null) {
            response.setPremisesName(courseType.getPremises().getName());
        }

        return response;
    }
}
