package com.staff_portal.academic_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.enums.CourseGroupStatus;
import com.staff_portal.academic_service.model.CourseGroup;

@Repository
public interface CourseGroupRepository extends JpaRepository<CourseGroup, Integer> {
	
	List<CourseGroup> findByStatus(CourseGroupStatus status);
	// Get course groups by batch cycle name
	List<CourseGroup> findByBatchCycle_CycleName(String cycleName);
     // get course group by course type 
	List<CourseGroup> findByCourseType_TypeName(String typeName);
	
}
