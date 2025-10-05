package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.PaginatedCourseResponseDTO;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.model.*;
import com.staff_portal.academic_service.model.Module;
import com.staff_portal.academic_service.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public ApiResponse<Page<PaginatedCourseResponseDTO>> getPaginatedCourse(String searchTerm, UUID courseTypeId, UUID batchCycleId, UUID premiseId, int page, int size){
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

    // Create Course
    @Override
    public ApiResponse<UUID> createCourse(CourseRequestDTO requestDTO) {
        BatchCycle batchCycle = batchCycleRepository.findById(requestDTO.getBatchCycleId()).orElseThrow(() -> new ResourceNotFoundException(String.format("Batch Cycle Not Found with id: %s", requestDTO.getBatchCycleId())));
        CourseType courseType = courseTypeRepository.findById(requestDTO.getCourseTypeId()).orElseThrow(()-> new ResourceNotFoundException(String.format("Course Type Not Found with id: %s", requestDTO.getCourseTypeId())));
        Premise premise = premiseRepository.findById(requestDTO.getPremiseId()).orElseThrow(() -> new ResourceNotFoundException(String.format("Premise Not Found with id: %s", requestDTO.getPremiseId())));

        Course course = Course.builder()
                .courseName(requestDTO.getTitle())
                .courseCode(requestDTO.getCourseCode())
                .batchCycle(batchCycle)
                .courseType(courseType)
                .premise(premise)
                .startDate(requestDTO.getStartDate())
                .endDate(requestDTO.getEndDate())
                .studentCount(requestDTO.getStudentCount())
                .courseGroupCount(requestDTO.getGroupCount())
                .status(requestDTO.getStatus())
                .build();
        Course savedCourse = courseRepository.save(course);
        return ApiResponse.onSuccess(savedCourse.getCourseId())
    }

    // Update Course
    @Override
    public CourseResponseDTO updateCourse(int id, CourseRequestDTO requestDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (course.isDeleted()) {
            throw new RuntimeException("Cannot update deleted course");
        }

        CourseType courseType = courseTypeRepository.findById(requestDTO.getCourseTypeId())
                .orElseThrow(() -> new RuntimeException("createCourseType not found"));

        course.setCourseCode(requestDTO.getCourseCode());
        course.setCourseName(requestDTO.getCourseName());
        course.setStartDate(requestDTO.getStartDate());
        course.setEndDate(requestDTO.getEndDate());
        course.setStatus(requestDTO.getStatus());
        course.setCourseType(courseType);

        Course updated = courseRepository.save(course);
        return mapToResponseDTO(updated);
    }

    // Get Course by ID
    @Override
    public CourseResponseDTO getCourseById(int id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (course.isDeleted()) {
            throw new RuntimeException("Course not found");
        }

        return mapToResponseDTO(course);
    }

    // Get All Courses (excluding deleted)
    @Override
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .filter(c -> !c.isDeleted())
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Soft Delete Course and cascade
    @Override
    @Transactional
    public void deleteCourse(int id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

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

    // Filtered Courses by Batch + Type
    @Override
    public List<CourseResponseDTO> getCoursesByFilters(Integer batchCycleId, Integer courseTypeId) {
        return courseRepository
                .findByBatchCycle_BatchCycleIdAndCourseType_CourseTypeId(batchCycleId, courseTypeId)
                .stream()
                .filter(c -> !c.isDeleted())
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Mapper (Entity → DTO)
    private CourseResponseDTO mapToResponseDTO(Course course) {
        CourseResponseDTO response = new CourseResponseDTO();
        response.setCourseId(course.getCourseId());
        response.setCourseCode(course.getCourseCode());
        response.setCourseName(course.getCourseName());
        response.setStartDate(course.getStartDate());
        response.setEndDate(course.getEndDate());
        response.setStatus(course.getStatus());
        response.setDeleted(course.isDeleted());
        response.setCourseTypeName(course.getCourseType().getTypeName());
        response.setCycleName(course.getBatchCycle().getCycleName());
        response.setPremisesName(course.getCourseType().getPremises().getName());
        return response;
    }
}
