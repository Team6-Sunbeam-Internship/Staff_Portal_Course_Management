package com.staff_portal.academic_service.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.staff_portal.academic_service.dto.response.CourseResponseDTO;
import com.staff_portal.academic_service.dto.response.PaginatedCourseResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.model.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {


    Optional<Boolean> existsByCourseCode(String courseCode);

    List<Course> findByBatchCycle_BatchCycleIdAndCourseType_CourseTypeId(
            Integer batchCycleId,
            Integer courseTypeId
    );

    List<Course> findByDeletedFalse();

    Course findByCourseIdAndDeletedFalse(int courseId);

    List<Course> findByCourseType_CourseTypeIdAndDeletedFalse(Integer courseTypeId);

    List<Course> findByBatchCycle_BatchCycleIdAndCourseType_CourseTypeIdAndDeletedFalse(
            Integer batchCycleId,
            Integer courseTypeId
    );

    @Query(value = """
            SELECT new com.staff_portal.academic_service.dto.response.PaginatedCourseResponseDTO(
                c.courseId, c.courseCode, c.courseName, 
                c.courseType.courseTypeId, c.courseType.typeName, 
                c.premise.premiseId, c.premise.name, 
                c.batchCycle.batchCycleId, c.batchCycle.cycleName, 
                c.studentCount, c.courseGroupCount, c.status
            )
            FROM Course c
            WHERE c.deleted = false
                AND (:courseTypeId IS NULL OR c.courseType.courseTypeId = :courseTypeId)
                AND (:batchCycleId IS NULL OR c.batchCycle.batchCycleId = :batchCycleId)
                AND (:premiseId IS NULL OR c.premise.premiseId = :premiseId)
                AND (:searchTerm IS NULL OR c.courseName LIKE %:searchTerm% OR c.courseCode LIKE %:searchTerm%)
            ORDER BY c.startDate DESC
            """,
            countQuery = """
                    SELECT COUNT(c) FROM Course c
                    WHERE c.deleted=false
                        AND (:courseTypeId IS NULL OR c.courseType.courseTypeId = :courseTypeId)
                        AND (:batchCycleId IS NULL OR c.batchCycle.batchCycleId = :batchCycleId)
                        AND (:premiseId IS NULL OR c.premise.premiseId = :premiseId)
                        AND (:searchTerm IS NULL OR c.courseName LIKE %:searchTerm% OR c.courseCode LIKE %:searchTerm%)
                    """)
    Page<PaginatedCourseResponseDTO> findPaginatedCourses(
            @Param("courseTypeId") UUID courseTypeId,
            @Param("batchCycleId") UUID batchCycleId,
            @Param("premiseId") UUID premiseID,
            @Param("searchTerm") String searchTerm,
            Pageable pageable
    );

    @Query("""
        SELECT new com.staff_portal.academic_service.dto.response.CourseResponseDTO(
            c.courseCode,
            c.courseName,
            b.batchCycleId,
            b.cycleName,
            ct.courseTypeId,
            ct.typeName,
            c.courseGroupCount,
            p.premiseId,
            p.name
        )
        FROM Course c
        JOIN c.batchCycle b
        JOIN c.courseType ct
        JOIN c.premise p
        WHERE c.deleted = false
        """)
    List<CourseResponseDTO> findAllCourseDetails();

    Optional<Course> findByCourseCode(String courseCode);
}

