
package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;
import com.staff_portal.academic_service.model.Course;
import com.staff_portal.academic_service.model.Module;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface ModuleRepository extends JpaRepository<Module, UUID> {


    boolean existsByCourseAndModuleCode(Course course, String moduleCode);

    @Query("""
                SELECT new com.staff_portal.academic_service.dto.response.ModuleResponseDTO(
                m.moduleId,
                m.moduleName,
                m.theoryHours,
                m.practicalHours,
                m.moduleRouterId
                )
                FROM Module m
                WHERE m.course.courseCode = :courseCode 
                AND m.deleted = false
            """)
    List<ModuleResponseDTO> getAllModulesForCourse(@Param("courseCode") String courseCode);

    @EntityGraph(attributePaths = {
            "subjects",
            "subjects.sections",
            "subjects.sections.topics",
            "course"
    })
    @Query("""
        SELECT m FROM Module m
        JOIN m.course c
        WHERE m.moduleRouterId = :staffId
          AND :currentDate BETWEEN c.startDate AND c.endDate
    """)
    List<Module> getModulesForModuleRouter(@Param("staffId") UUID staffId,
                                           @Param("currentDate") LocalDate currentDate);
}
