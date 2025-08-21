package com.staff_portal.academic_service.service.implementation;

import org.springframework.stereotype.Service;

import com.staff_portal.academic_service.dto.request.CourseGroupRequest;
import com.staff_portal.academic_service.dto.response.CourseGroupResponse;
import com.staff_portal.academic_service.enums.CourseGroupStatus;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.CourseGroup;
import com.staff_portal.academic_service.repository.CourseGroupRepository;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.service.interfaces.CourseGroupService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseGroupServiceImpl implements CourseGroupService {
	
	private final CourseGroupRepository courseGroupRepository;
    private final CourseRepository courseRepository;

	 
	
	@Override
	public CourseGroupResponse createCourseGroup(CourseGroupRequest request) {
		// check if course exist
		 Course course = courseRepository.findById(request.getCourseId())
	                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + request.getCourseId()));

	        //  Create new CourseGroup entity
	        CourseGroup courseGroup = new CourseGroup();
	        courseGroup.setCourse(course);
	        courseGroup.setGroupName(request.getGroupName());
	        courseGroup.setDescription(request.getDescription());
	        courseGroup.setCapacity(request.getCapacity());
	        
	        //  If status is not provided, set a default
	        courseGroup.setStatus(request.getStatus() != null ? request.getStatus() : CourseGroupStatus.ACTIVE);

	        //  Save to DB
	        CourseGroup saved = courseGroupRepository.save(courseGroup);

	        // ✅ Return response DTO
	        return new CourseGroupResponse(
	                saved.getGroupId(),
	                saved.getGroupName(),
	                saved.getDescription(),
	                saved.getCapacity(),
	                saved.getStatus(),
	                saved.getCourse().getCourseId(),
	                saved.getCourse().getCourseName()
	        );
        
	}



	@Override
	public CourseGroupResponse updateCourseGroup(int groupId, CourseGroupRequest request) {
		 CourseGroup group = courseGroupRepository.findById(groupId)
	                .orElseThrow(() -> new RuntimeException("Course group not found with ID: " + groupId));

	        Course course = courseRepository.findById(request.getCourseId())
	                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + request.getCourseId()));

	        group.setCourse(course);
	        group.setGroupName(request.getGroupName());
	        group.setDescription(request.getDescription());
	        group.setCapacity(request.getCapacity());
	        group.setStatus(request.getStatus() != null ? request.getStatus() : group.getStatus());

	        CourseGroup updated = courseGroupRepository.save(group);

	        return new CourseGroupResponse(
	                updated.getGroupId(),
	                updated.getGroupName(),
	                updated.getDescription(),
	                updated.getCapacity(),
	                updated.getStatus(),
	                updated.getCourse().getCourseId(),
	                updated.getCourse().getCourseName()
	        );
		
	}
	

}
