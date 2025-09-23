package com.staff_portal.academic_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.enums.CourseGroupStatus;
import com.staff_portal.academic_service.model.CourseGroup;

@Repository
public interface CourseGroupRepository extends JpaRepository<CourseGroup, Integer> {
	List<CourseGroup> findByBatchCycle_BatchCycleId(Long batchCycleId);

	List<CourseGroup> findByCourse_CourseId(Long courseId);

	List<CourseGroup> findByStatus(CourseGroupStatus status);

}
