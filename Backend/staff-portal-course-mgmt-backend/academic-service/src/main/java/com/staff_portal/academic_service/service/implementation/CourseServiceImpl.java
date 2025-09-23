package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.staff_portal.academic_service.dto.request.CourseRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseResponseDTO;
import com.staff_portal.academic_service.model.BatchCycle;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.CourseType;
import com.staff_portal.academic_service.model.Module;
import com.staff_portal.academic_service.model.Subject;
import com.staff_portal.academic_service.model.Section;
import com.staff_portal.academic_service.model.Topic;
import com.staff_portal.academic_service.repository.BatchCycleRepository;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.repository.CourseTypeRepository;
import com.staff_portal.academic_service.repository.ModuleRepository;
import com.staff_portal.academic_service.repository.SubjectRepository;
import com.staff_portal.academic_service.repository.SectionRepository;
import com.staff_portal.academic_service.repository.TopicRepository;
import com.staff_portal.academic_service.service.interfaces.CourseService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;
    private final BatchCycleRepository batchCycleRepository;
    private final ModuleRepository moduleRepository;
    private final SubjectRepository subjectRepository;
    private final SectionRepository sectionRepository;
    private final TopicRepository topicRepository;

    // Create Course
    @Override
    public CourseResponseDTO addCourse(CourseRequestDTO requestDTO) {
        BatchCycle batchCycle = batchCycleRepository.findById(requestDTO.getBatchCycleId())
                .orElseThrow(() -> new RuntimeException("BatchCycle not found with id "));

        CourseType courseType = courseTypeRepository.findById(requestDTO.getCourseTypeId())
                .orElseThrow(() -> new RuntimeException("CourseType not found"));

        Course course = new Course();
        course.setCourseCode(requestDTO.getCourseCode());
        course.setCourseName(requestDTO.getCourseName());
        course.setStartDate(requestDTO.getStartDate());
        course.setEndDate(requestDTO.getEndDate());
        course.setStatus(requestDTO.getStatus());
        course.setDeleted(false); // ✅ soft delete flag
        course.setBatchCycle(batchCycle);
        course.setCourseType(courseType);

        Course saved = courseRepository.save(course);
        return mapToResponseDTO(saved);
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
                .orElseThrow(() -> new RuntimeException("CourseType not found"));

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
