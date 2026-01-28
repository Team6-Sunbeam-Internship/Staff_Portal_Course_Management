package com.staff_portal.academic_service.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.model.CourseCoordinatorAssignment;

@Repository
public interface CourseCoordinatorAssignRepository extends JpaRepository<CourseCoordinatorAssignment, UUID> {
    @EntityGraph(attributePaths = { "assignCourse", "assignCourse.modules" })
    List<CourseCoordinatorAssignment> findByStaffId(UUID staffId);

    @EntityGraph(attributePaths = { "assignCourse", "assignCourse.premise" })
    List<CourseCoordinatorAssignment> findAll();
}
