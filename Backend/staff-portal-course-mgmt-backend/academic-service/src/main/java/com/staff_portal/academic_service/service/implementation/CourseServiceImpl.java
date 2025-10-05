package com.staff_portal.academic_service.service.implementation;

import java.util.*;

import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.PaginatedCourseResponseDTO;
import com.staff_portal.academic_service.exception.CannotUpdateException;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.model.*;
import com.staff_portal.academic_service.model.Module;
import com.staff_portal.academic_service.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.staff_portal.academic_service.dto.request.CourseRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseResponseDTO;
import com.staff_portal.academic_service.service.interfaces.CourseService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;
    private final BatchCycleRepository batchCycleRepository;
    private final PremiseRepository premiseRepository;
    private final ModuleRepository moduleRepository;
    private final SubjectRepository subjectRepository;
    private final SectionRepository sectionRepository;
    private final TopicRepository topicRepository;

    @Override
    public ApiResponse<Page<PaginatedCourseResponseDTO>> getPaginatedCourse(String searchTerm, UUID courseTypeId, UUID batchCycleId, UUID premiseId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        String processedSearch = (searchTerm != null && !searchTerm.trim().isEmpty()) ? searchTerm.trim() : null;

        Page<PaginatedCourseResponseDTO> paginatedCourses = courseRepository.findPaginatedCourses(
                courseTypeId,
                batchCycleId,
                premiseId,
                processedSearch,
                pageable
        );
        return ApiResponse.onSuccess(paginatedCourses);
    }

    private record CourseRelations(
            BatchCycle batchCycle,
            CourseType courseType,
            Premise premise
    ) {
    }

    private CourseRelations fetchRelations(CourseRequestDTO dto) {
        BatchCycle batchCycle = batchCycleRepository.findById(dto.getBatchCycleId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Batch Cycle Not Found with id: %s", dto.getBatchCycleId())));

        CourseType courseType = courseTypeRepository.findById(dto.getCourseTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course Type Not Found with id: %s", dto.getCourseTypeId())));

        Premise premise = premiseRepository.findById(dto.getPremiseId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Premise Not Found with id: %s", dto.getPremiseId())));

        return new CourseRelations(batchCycle, courseType, premise);
    }


    // Create Course
    @Override
    public ApiResponse<UUID> createCourse(CourseRequestDTO requestDTO) {
        var relations = fetchRelations(requestDTO);
        Course course = Course.builder()
                .courseName(requestDTO.getTitle())
                .courseCode(requestDTO.getCourseCode())
                .batchCycle(relations.batchCycle)
                .courseType(relations.courseType)
                .premise(relations.premise)
                .startDate(requestDTO.getStartDate())
                .endDate(requestDTO.getEndDate())
                .studentCount(requestDTO.getStudentCount())
                .courseGroupCount(requestDTO.getGroupCount())
                .status(requestDTO.getStatus())
                .build();
        Course savedCourse = courseRepository.save(course);
        return ApiResponse.onSuccess(savedCourse.getCourseId());
    }

    // Update Course
    @Override
    public ApiResponse<String> updateCourse(UUID id, CourseRequestDTO requestDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course Not Found with id: %s", id)));

        if (course.isDeleted()) {
            throw new CannotUpdateException("Can't perform update for deleted course", HttpStatus.FORBIDDEN);
        }

        var relations = fetchRelations(requestDTO);

        course.setCourseName(requestDTO.getTitle());
        course.setCourseCode(requestDTO.getCourseCode());
        course.setBatchCycle(relations.batchCycle());
        course.setCourseType(relations.courseType());
        course.setPremise(relations.premise());
        course.setStartDate(requestDTO.getStartDate());
        course.setEndDate(requestDTO.getEndDate());
        course.setStudentCount(requestDTO.getStudentCount());
        course.setCourseGroupCount(requestDTO.getGroupCount());
        course.setStatus(requestDTO.getStatus());

        courseRepository.save(course);
        return ApiResponse.onSuccess("Course updated successfully");
    }

    // Get All Courses (excluding deleted)
    @Override
    public ApiResponse<Map<UUID, Map<UUID, List<CourseResponseDTO>>>> getAllCourses() {
        List<CourseResponseDTO> allCourseDetails = courseRepository.findAllCourseDetails();

        Map<UUID, Map<UUID, List<CourseResponseDTO>>> typeMap = new HashMap<>();

        for(CourseResponseDTO dto : allCourseDetails) {
            UUID courseTypeId = dto.getCourseTypeId();
            UUID batchCycleId = dto.getBatchCycleId();

            Map<UUID, List<CourseResponseDTO>> batchMap = typeMap.get(courseTypeId);
            if(batchMap == null) {
                batchMap = new HashMap<>();
                typeMap.put(courseTypeId, batchMap);
            }

            List<CourseResponseDTO> courseDetails = batchMap.get(batchCycleId);
            if(courseDetails == null) {
                courseDetails = new ArrayList<>();
                batchMap.put(batchCycleId, courseDetails);
            }
            courseDetails.add(dto);
        }
        return ApiResponse.onSuccess(typeMap);
    }

    // Soft Delete Course and cascade
    @Override
    @Transactional
    public void deleteCourse(UUID id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Course Not Found with id: %s", id)));

        softDeleteCourseHierarchy(course);
    }

    private void softDeleteCourseHierarchy(Course course) {
        course.setDeleted(true);
        courseRepository.save(course);

        if (course.getModules() != null) {
            for (Module m : course.getModules()) {
                m.setDeleted(true);
                moduleRepository.save(m);

                if (m.getSubjects() != null) {
                    for (Subject s : m.getSubjects()) {
                        s.setDeleted(true);
                        subjectRepository.save(s);

                        if (s.getSections() != null) {
                            for (Section sec : s.getSections()) {
                                sec.setDeleted(true);
                                sectionRepository.save(sec);

                                if (sec.getTopics() != null) {
                                    for (Topic t : sec.getTopics()) {
                                        t.setDeleted(true);
                                        topicRepository.save(t);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
