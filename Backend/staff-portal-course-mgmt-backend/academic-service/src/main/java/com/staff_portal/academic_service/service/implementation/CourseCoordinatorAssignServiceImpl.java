package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.CourseCoordinatorAssignRequestDTO;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseCoordinatorAssignCourseResponseDTO;
import com.staff_portal.academic_service.dto.response.CourseCoordinatorAssignResponseDTO;
import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;
import com.staff_portal.academic_service.enums.Status;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.CourseCoordinatorAssignment;
import com.staff_portal.academic_service.repository.CourseCoordinatorAssignRepository;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.service.interfaces.ICourseCoordinatorAssignService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CourseCoordinatorAssignServiceImpl implements ICourseCoordinatorAssignService {

    private final CourseCoordinatorAssignRepository courseCoordinatorAssignRepository;
    private final CourseRepository courseRepository;
    private final RestClient userServiceRestClient;

    public CourseCoordinatorAssignServiceImpl(CourseCoordinatorAssignRepository courseCoordinatorAssignRepository,
                                              CourseRepository courseRepository, @Qualifier("userServiceRestClient") RestClient userServiceRestClient) {
        this.courseCoordinatorAssignRepository = courseCoordinatorAssignRepository;
        this.courseRepository = courseRepository;
        this.userServiceRestClient = userServiceRestClient;
    }

    // For COURSE_COORDINATOR
    @Override
    public ApiResponse<List<CourseCoordinatorAssignCourseResponseDTO>> getAssignCourse(Authentication authentication) {
        UUID authUserId = UUID.fromString(authentication.getName());
        JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
        LocalDate now = LocalDate.now();
        // find staffId from user-service:
        UUID staffUUID = null;
        ApiResponse<UUID> userServiceResponse = userServiceRestClient
                .get()
                .uri("/staff/getStaffId")
                .header("Authorization", "Bearer " + jwtAuthenticationToken.getToken().getTokenValue())
                .retrieve()
                .body(new ParameterizedTypeReference<ApiResponse<UUID>>() {
                });
        if (userServiceResponse.isSuccess()) {
            staffUUID = userServiceResponse.getApiResponse();
        }
        List<CourseCoordinatorAssignment> assignments = courseCoordinatorAssignRepository.findByStaffId(staffUUID);

        List<CourseCoordinatorAssignCourseResponseDTO> responseList = assignments
                .stream()
                .map(assignment -> {
                    Course course = assignment.getAssignCourse();

                    List<ModuleResponseDTO> moduleDTOs = course.getModules().stream()
                            .map(module -> ModuleResponseDTO.builder()
                                    .id(module.getModuleId())
                                    .title(module.getModuleName())
                                    .theoryHours(module.getTheoryHours())
                                    .practicalHours(module.getPracticalHours())
                                    .moduleRouterId(module.getModuleRouterId())
                                    .build())
                            .toList();

                    boolean isCurrent = !now.isAfter(course.getEndDate());

                    return CourseCoordinatorAssignCourseResponseDTO.builder()
                            .courseCode(course.getCourseCode())
                            .courseName(course.getCourseName())
                            .isCurrent(isCurrent)
                            .assignCourseModuleList(moduleDTOs)
                            .build();
                })
                .toList();

        return ApiResponse.onSuccess(responseList);
    }

    // FOR ADMIN
    @Override
    public ApiResponse<List<CourseCoordinatorAssignResponseDTO>> getAllAssignments() {
        List<CourseCoordinatorAssignment> assignments = courseCoordinatorAssignRepository.findAll();
        List<CourseCoordinatorAssignResponseDTO> dtoList = assignments.stream()
                .map(this::mapToResponseDTO)
                .toList();
        return ApiResponse.onSuccess(dtoList);
    }

    @Override
    public ApiResponse<UUID> createAssignment(CourseCoordinatorAssignRequestDTO request) {
        Course course = courseRepository.findByCourseCode(request.getCourseCode())
                .orElseThrow(() -> new RuntimeException("Course not found with code: " + request.getCourseCode()));

        var assignment = CourseCoordinatorAssignment.builder()
                .staffId(request.getStaffId())
                .assignCourse(course)
                .courseAssignStatus(Status.ASSIGNED)
                .build();

        CourseCoordinatorAssignment saved = courseCoordinatorAssignRepository.save(assignment);
        return ApiResponse.onSuccess(saved.getAssignmentId());
    }

    @Override
    public ApiResponse<String> updateAssignment(UUID id, CourseCoordinatorAssignRequestDTO request) {
        CourseCoordinatorAssignment assignment = courseCoordinatorAssignRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + id));
        Course course = courseRepository.findByCourseCode(request.getCourseCode())
                .orElseThrow(() -> new RuntimeException("Course not found with code: " + request.getCourseCode()));
        assignment.setStaffId(request.getStaffId());
        assignment.setCourseAssignStatus(request.getAssignCourseStatus());
        assignment.setAssignCourse(course);
        CourseCoordinatorAssignment updated = courseCoordinatorAssignRepository.save(assignment);
        return ApiResponse.onSuccess("CourseCoordinatorAssignment updated successfully!");
    }

    @Override
    public ApiResponse<String> deleteAssignment(UUID id) {
        if (!courseCoordinatorAssignRepository.existsById(id)) {
            throw new RuntimeException("Assignment not found with id: " + id);
        }
        courseCoordinatorAssignRepository.deleteById(id);
        return ApiResponse.onSuccess("Assignment deleted successfully");
    }

    private CourseCoordinatorAssignResponseDTO mapToResponseDTO(CourseCoordinatorAssignment assignment) {
        return CourseCoordinatorAssignResponseDTO.builder()
                .assignmentId(assignment.getAssignmentId())
                .staffId(assignment.getStaffId())
                .courseCode(assignment.getAssignCourse().getCourseCode())
                .premiseId(assignment.getAssignCourse().getPremise().getPremiseId())
                .courseCoordinatorAssignStatus(assignment.getCourseAssignStatus())
                .courseName(assignment.getAssignCourse().getCourseName())
                .premiseName(assignment.getAssignCourse().getPremise().getPremiseName())
                .batchCycleId(assignment.getAssignCourse().getBatchCycle().getBatchCycleId())
                .batchCycleName(assignment.getAssignCourse().getBatchCycle().getBatchCycleName())
                .build();
    }
}
