package com.staff_portal.academic_service.service.implementation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.staff_portal.academic_service.dto.request.CourseRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseHierarchyResponseDTO;
import com.staff_portal.academic_service.dto.response.CourseResponseDTO;
import com.staff_portal.academic_service.dto.response.ModuleHierarchyDTO;
import com.staff_portal.academic_service.dto.response.ModuleMapper;
import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;
import com.staff_portal.academic_service.dto.response.ModuleRouterCourseHierarchyResponse;
import com.staff_portal.academic_service.dto.response.PaginatedCourseResponseDTO;
import com.staff_portal.academic_service.dto.response.SectionResponseDTO;
import com.staff_portal.academic_service.dto.response.SubjectResponseDTO;
import com.staff_portal.academic_service.dto.response.TopicResponseDTO;
import com.staff_portal.academic_service.exception.CannotUpdateException;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.model.BatchCycle;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.CourseType;
import com.staff_portal.academic_service.model.Module;
import com.staff_portal.academic_service.model.Premise;
import com.staff_portal.academic_service.model.Section;
import com.staff_portal.academic_service.model.Subject;
import com.staff_portal.academic_service.model.Topic;
import com.staff_portal.academic_service.repository.BatchCycleRepository;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.repository.CourseTypeRepository;
import com.staff_portal.academic_service.repository.ModuleRepository;
import com.staff_portal.academic_service.repository.PremiseRepository;
import com.staff_portal.academic_service.repository.SectionRepository;
import com.staff_portal.academic_service.repository.SubjectRepository;
import com.staff_portal.academic_service.repository.TopicRepository;
import com.staff_portal.academic_service.service.interfaces.CourseService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
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
    public ApiResponse<Page<PaginatedCourseResponseDTO>> getPaginatedCourse(String searchTerm, UUID courseTypeId,
            UUID batchCycleId, UUID premiseId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by(Sort.Order.desc("startDate"), Sort.Order.desc("courseCode")));

        String processedSearch = (searchTerm != null && !searchTerm.trim().isEmpty()) ? searchTerm.trim() : null;

        Page<PaginatedCourseResponseDTO> paginatedCourses = courseRepository.findPaginatedCourses(
                courseTypeId,
                batchCycleId,
                premiseId,
                processedSearch,
                pageable);
        return ApiResponse.onSuccess(paginatedCourses);
    }

    private record CourseRelations(
            BatchCycle batchCycle,
            CourseType courseType,
            Premise premise) {
    }

    private CourseRelations fetchRelations(CourseRequestDTO dto) {
        BatchCycle batchCycle = batchCycleRepository.findById(dto.getBatchCycleId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Batch Cycle Not Found with id: %s", dto.getBatchCycleId())));

        CourseType courseType = courseTypeRepository.findById(dto.getCourseTypeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Course Type Not Found with id: %s", dto.getCourseTypeId())));

        Premise premise = premiseRepository.findById(dto.getPremiseId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        String.format("Premise Not Found with id: %s", dto.getPremiseId())));

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

        for (CourseResponseDTO dto : allCourseDetails) {
            UUID courseTypeId = dto.getCourseTypeId();
            UUID batchCycleId = dto.getBatchCycleId();

            Map<UUID, List<CourseResponseDTO>> batchMap = typeMap.computeIfAbsent(courseTypeId, k -> new HashMap<>());

            List<CourseResponseDTO> courseDetails = batchMap.computeIfAbsent(batchCycleId, k -> new ArrayList<>());
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

    @Override
    public ApiResponse<CourseHierarchyResponseDTO> getCourseHierarchy(String courseCode) {
        // Validate course existence
        if (courseRepository.existsByCourseCode(courseCode).isEmpty()) {
            throw new ResourceNotFoundException(String.format("Course %s not found", courseCode));
        }

        List<ModuleResponseDTO> modules = moduleRepository.getAllModulesForCourse(courseCode);
        log.info("Modules: {}", modules);
        if (modules.isEmpty()) {
            return ApiResponse.onSuccess(new CourseHierarchyResponseDTO(Collections.emptyList(),
                    Collections.emptyList(), Collections.emptyList(), Collections.emptyList()));
        }

        List<UUID> moduleIds = modules.stream().map(ModuleResponseDTO::getId).toList();
        List<SubjectResponseDTO> subjects = subjectRepository.getAllSubjectsForModule(moduleIds);

        List<UUID> subjectIds = subjects.stream().map(SubjectResponseDTO::getId).toList();
        List<SectionResponseDTO> sections = sectionRepository.getAllSectionsForSubjects(subjectIds);

        List<UUID> sectionIds = sections.stream().map(SectionResponseDTO::getId).toList();
        List<TopicResponseDTO> topics = topicRepository.getAllTopicsForSections(sectionIds);

        CourseHierarchyResponseDTO hierarchy = new CourseHierarchyResponseDTO(
                modules,
                subjects,
                sections,
                topics);

        return ApiResponse.onSuccess(hierarchy);
    }

    @Override
    public ApiResponse<ModuleRouterCourseHierarchyResponse> getModuleRouterCourseHierarchy(
            Authentication authentication) {
        UUID staffId = UUID.fromString(authentication.getName());
        LocalDate currentDate = LocalDate.now();

        List<Module> modules = moduleRepository.getModulesForModuleRouter(staffId, currentDate);
        if (modules.isEmpty()) {
            return ApiResponse.onSuccess(new ModuleRouterCourseHierarchyResponse(List.of(), List.of()));
        }

        List<String> courseCodes = modules.stream()
                .map(m -> m.getCourse().getCourseCode())
                .distinct()
                .toList();

        List<ModuleHierarchyDTO> moduleDTOs = modules.stream()
                .map(ModuleMapper::toHierarchyDTO)
                .toList();

        ModuleRouterCourseHierarchyResponse response = new ModuleRouterCourseHierarchyResponse(courseCodes, moduleDTOs);

        return ApiResponse.onSuccess(response);
    }

    @Override
    public ApiResponse<Map<UUID, List<String>>> getUniqueCourseNames() {
        List<Course> allCourses = courseRepository.findAll().stream()
                .filter(course -> !course.isDeleted())
                .toList();

        Map<UUID, List<String>> courseNamesByType = new HashMap<>();

        for (Course course : allCourses) {
            UUID courseTypeId = course.getCourseType().getCourseTypeId();
            String courseName = course.getCourseName();

            courseNamesByType
                    .computeIfAbsent(courseTypeId, k -> new ArrayList<>())
                    .add(courseName);
        }

        // Remove duplicates and sort
        courseNamesByType.forEach((key, value) -> {
            List<String> uniqueSorted = value.stream()
                    .distinct()
                    .sorted()
                    .toList();
            courseNamesByType.put(key, uniqueSorted);
        });

        return ApiResponse.onSuccess(courseNamesByType);
    }
}
