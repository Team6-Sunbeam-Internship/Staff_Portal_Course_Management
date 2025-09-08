package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.staff_portal.academic_service.dto.request.CourseRequestDTO;
import com.staff_portal.academic_service.dto.response.CourseResponseDTO;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.CourseType;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.repository.CourseTypeRepository;
import com.staff_portal.academic_service.service.interfaces.CourseService;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseTypeRepository courseTypeRepository;

    //  Create Course
    @Override
    public CourseResponseDTO addCourse(CourseRequestDTO requestDTO) {
        CourseType courseType = courseTypeRepository.findById(requestDTO.getCourseTypeId())
                .orElseThrow(() -> new RuntimeException("CourseType not found"));

        Course course = new Course();
        course.setCourseCode(requestDTO.getCourseCode());
        course.setCourseName(requestDTO.getCourseName());
        course.setStartDate(requestDTO.getStartDate());
        course.setEndDate(requestDTO.getEndDate());
        course.setStatus(requestDTO.getStatus());
        course.setCourseType(courseType);

        Course saved = courseRepository.save(course);
        return mapToResponseDTO(saved);
    }

    //  Update Course
    @Override
    public CourseResponseDTO updateCourse(int id, CourseRequestDTO requestDTO) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

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

    //  Get Course by ID
    @Override
    public CourseResponseDTO getCourseById(int id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        return mapToResponseDTO(course);
    }

    //  Get All Courses
    @Override
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    //  Delete Course
    @Override
    public void deleteCourse(int id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        courseRepository.delete(course);
    }
    
//    @Override
//    public List<Course> getCoursesByCourseType(int courseTypeId) {
//        return courseRepository.findByCourseTypeId(courseTypeId);
//    }


    @Override
    public List<CourseResponseDTO> getCoursesByFilters(Integer batchCycleId, Integer courseTypeId) {
        List<Course> courses = courseRepository
                .findByCourseType_BatchCycle_BatchCycleIdAndCourseType_CourseTypeId(batchCycleId, courseTypeId);

        return courses.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    //  Mapper (Entity → Response DTO)
    private CourseResponseDTO mapToResponseDTO(Course course) {
        CourseResponseDTO response = new CourseResponseDTO();
        response.setCourseId(course.getCourseId());
        response.setCourseCode(course.getCourseCode());
        response.setCourseName(course.getCourseName());
        response.setStartDate(course.getStartDate());
        response.setEndDate(course.getEndDate());
        response.setStatus(course.getStatus());
        response.setCourseTypeName(course.getCourseType().getTypeName());
        response.setCycleName(course.getCourseType().getBatchCycle().getCycleName());
        response.setPremisesName(course.getCourseType().getPremises().getName()); // 🔗 via CourseType
        return response;
    }
}

