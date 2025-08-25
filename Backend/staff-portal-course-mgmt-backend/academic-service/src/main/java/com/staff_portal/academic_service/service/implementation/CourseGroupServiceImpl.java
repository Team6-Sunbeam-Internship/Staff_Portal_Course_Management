package com.staff_portal.academic_service.service.implementation;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.staff_portal.academic_service.dto.request.CourseGroupRequest;
import com.staff_portal.academic_service.dto.response.CourseGroupResponse;
import com.staff_portal.academic_service.enums.CourseGroupStatus;
import com.staff_portal.academic_service.model.BatchCycle;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.CourseGroup;
import com.staff_portal.academic_service.repository.BatchCycleRepository;
import com.staff_portal.academic_service.repository.CourseGroupRepository;
import com.staff_portal.academic_service.repository.CourseRepository;
import com.staff_portal.academic_service.service.interfaces.CourseGroupService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseGroupServiceImpl implements CourseGroupService {
	
	private final CourseGroupRepository courseGroupRepository;
    private final CourseRepository courseRepository;
    private final BatchCycleRepository batchCycleRepository;
	 
	
    @Override
    public CourseGroupResponse createCourseGroup(CourseGroupRequest request) {
        // ✅ Check if Course exists
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + request.getCourseId()));

        // ✅ Check if BatchCycle exists (if required)
        BatchCycle batchCycle = null;
        if (request.getBatchCycleId() != null) {
            batchCycle = batchCycleRepository.findById(request.getBatchCycleId())
                    .orElseThrow(() -> new RuntimeException("Batch cycle not found with ID: " + request.getBatchCycleId()));
        }

        // ✅ Check if CourseType exists (derive from Course or request)
        if (course.getCourseType() == null) {
            throw new RuntimeException("Course type is missing for this course. Please set it.");
        }

        // ✅ Create new CourseGroup entity
        CourseGroup courseGroup = new CourseGroup();
        courseGroup.setCourse(course);
        courseGroup.setCourseType(course.getCourseType());  // derive from course
        courseGroup.setBatchCycle(batchCycle);
        courseGroup.setGroupName(request.getGroupName());
        courseGroup.setDescription(request.getDescription());
        courseGroup.setCapacity(request.getCapacity());
        courseGroup.setStatus(request.getStatus() != null ? request.getStatus() : CourseGroupStatus.ACTIVE);

        // ✅ Save to DB
        CourseGroup saved = courseGroupRepository.save(courseGroup);

        // ✅ Return response DTO
        return new CourseGroupResponse(
                saved.getGroupId(),
                saved.getGroupName(),
                saved.getDescription(),
                saved.getCapacity(),
                saved.getStatus(),
                saved.getCourse().getCourseId()
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
	                updated.getCourse().getCourseId()
	              //  updated.getCourse().getCourseName()
	        );
		
	}

// deleting course group by id 
	@Override
	public void deleteCourseGroup(int groupId) {
		 CourseGroup group = courseGroupRepository.findById(groupId)
	                .orElseThrow(() -> new RuntimeException("Course group not found with ID: " + groupId));
	        courseGroupRepository.delete(group);
		
	}

	//getting all course-group

	@Override
	public List<CourseGroupResponse> getAllCourseGroups() {
		
		 List<CourseGroup> courseGroups = courseGroupRepository.findAll();

	        
	        return courseGroups.stream()
	                .map(cg -> new CourseGroupResponse(
	                        cg.getGroupId(),
	                        cg.getGroupName(),
	                        cg.getDescription(),
	                        cg.getCapacity(),
	                        cg.getStatus(),
	                        cg.getCourse().getCourseId()
	                      //  cg.getCourse().getCourseName()
	                ))
	                .toList();

	}

	@Override
	public List<CourseGroupResponse> getCourseGroupsByStatus(CourseGroupStatus status) {
		List<CourseGroup> courseGroups = courseGroupRepository.findByStatus(status);

	    // Map to response DTO
	    return courseGroups.stream()
	            .map(cg -> new CourseGroupResponse(
	                    cg.getGroupId(),
	                    cg.getGroupName(),
	                    cg.getDescription(),
	                    cg.getCapacity(),
	                    cg.getStatus(),
	                    cg.getCourse().getCourseId()
	                    // cg.getCourse().getCourseName()  
	            ))
	            .toList();
	}

	
	@Override
	public List<CourseGroupResponse> getCourseGroupsByBatchCycleName(String cycleName) {
		 List<CourseGroup> courseGroups = courseGroupRepository.findByBatchCycle_CycleName(cycleName);
		    return courseGroups.stream()
		            .map(cg -> new CourseGroupResponse(
		                    cg.getGroupId(),
		                    cg.getGroupName(),
		                    cg.getDescription(),
		                    cg.getCapacity(),
		                    cg.getStatus(),
		                    cg.getCourse().getCourseId()
		            ))
		            .toList();
	}



	@Override
	public List<CourseGroupResponse> getCourseGroupsByCourseType(String typeName) {
		 List<CourseGroup> courseGroups = courseGroupRepository.findByCourseType_TypeName(typeName);

		    return courseGroups.stream()
		            .map(cg -> new CourseGroupResponse(
		                    cg.getGroupId(),
		                    cg.getGroupName(),
		                    cg.getDescription(),
		                    cg.getCapacity(),
		                    cg.getStatus(),
		                    cg.getCourse().getCourseId()
		                    //  cg.getCourseType().getTypeName()
		            ))
		            .collect(Collectors.toList());
	}
	
}
