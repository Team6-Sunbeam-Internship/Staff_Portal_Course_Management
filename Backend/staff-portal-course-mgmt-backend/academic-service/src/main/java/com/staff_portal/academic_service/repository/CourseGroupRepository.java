package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.CourseGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseGroupRepository extends JpaRepository<CourseGroup, UUID> {
    // write the query to find all course groups
    @Query("""
                SELECT cg
                FROM CourseGroup cg
                WHERE cg.deleted = false
            """)
    List<CourseGroup> findAllAndDeletedFalse();

    Optional<List<CourseGroup>> findByCourse(Course course);
}
