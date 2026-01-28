package com.staff_portal.academic_service.service.implementation;

import com.staff_portal.academic_service.dto.request.CourseGroupRequest;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import com.staff_portal.academic_service.dto.response.CourseGroupResponse;
import com.staff_portal.academic_service.exception.ResourceNotFoundException;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.CourseGroup;
import com.staff_portal.academic_service.repository.CourseGroupRepository;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.service.interfaces.CourseGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CourseGroupServiceImpl implements CourseGroupService {

    private final CourseGroupRepository courseGroupRepository;
    private final CourseRepository courseRepository;

    @Override
    public ApiResponse<List<UUID>> createCourseGroup(String courseCode, List<CourseGroupRequest> courseGroupRequests) {
        Course course = courseRepository.findByCourseCode(courseCode)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Course not found with course code: " + courseCode));

        List<CourseGroup> courseGroups = courseGroupRequests.stream()
                .map(courseGroupRequest -> CourseGroup.builder()
                        .groupName(courseGroupRequest.getTitle())
                        .description(courseGroupRequest.getDescription())
                        .capacity(courseGroupRequest.getCapacity())
                        .status(courseGroupRequest.getStatus())
                        .course(course)
                        .batchCycle(course.getBatchCycle())
                        .courseType(course.getCourseType())
                        .build())
                .toList();

        courseGroupRepository.saveAll(courseGroups);

        return ApiResponse.onSuccess(courseGroups.stream().map(CourseGroup::getGroupId).toList());
    }

    @Override
    public ApiResponse<String> updateCourseGroup(UUID groupId, CourseGroupRequest request) {
        CourseGroup courseGroup = courseGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Course group not found with ID: " + groupId));

        courseGroup.setGroupName(
                request.getTitle().equalsIgnoreCase(courseGroup.getGroupName()) ? courseGroup.getGroupName()
                        : request.getTitle());
        courseGroup.setDescription(
                request.getDescription().equalsIgnoreCase(courseGroup.getDescription()) ? courseGroup.getDescription()
                        : request.getDescription());
        courseGroup.setCapacity(request.getCapacity().equals(courseGroup.getCapacity()) ? courseGroup.getCapacity()
                : request.getCapacity());
        courseGroup.setStatus(
                request.getStatus().name().equalsIgnoreCase(courseGroup.getStatus().name()) ? courseGroup.getStatus()
                        : request.getStatus());

        courseGroupRepository.save(courseGroup);
        return ApiResponse.onSuccess("Course group updated successfully");
    }

    // deleting course group by id
    @Override
    public void deleteCourseGroup(UUID groupId) {
        CourseGroup group = courseGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Course group not found with ID: " + groupId));

        group.setDeleted(true);
        courseGroupRepository.save(group);
    }

    // getting all course-group

    @Override
    public ApiResponse<List<CourseGroupResponse>> getAllCourseGroups(String courseCode) {

        if (courseCode != null) {
            // find course
            Course course = courseRepository.findByCourseCode(courseCode).orElseThrow(() -> new ResourceNotFoundException("Course not found with course code: " + courseCode));
            // find course-groups for course
            Optional<List<CourseGroup>> courseGroups = courseGroupRepository.findByCourse(course);
            return courseGroups.map(groups -> ApiResponse.onSuccess(groups.stream().map(
                    this::mapToDto).toList()
            )).orElseGet(() -> ApiResponse.onSuccess(List.of()));
        }

        List<CourseGroup> courseGroups = courseGroupRepository.findAllAndDeletedFalse();

        return ApiResponse.onSuccess(courseGroups
                .stream()
                .map(this::mapToDto)
                .toList());
    }

    private CourseGroupResponse mapToDto(CourseGroup courseGroup) {
        return CourseGroupResponse.builder()
                .id(courseGroup.getGroupId())
                .title(courseGroup.getGroupName())
                .description(courseGroup.getDescription())
                .capacity(courseGroup.getCapacity())
                .status(courseGroup.getStatus())
                .courseCode(courseGroup.getCourse().getCourseCode())
                .batchCycleId(courseGroup.getBatchCycle().getBatchCycleId())
                .courseTypeId(courseGroup.getCourseType().getCourseTypeId())
                .build();
    }
}
