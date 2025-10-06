
package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.dto.response.ModuleResponseDTO;
import com.staff_portal.academic_service.model.Module;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {


    boolean existsByModuleNameAndCourse_CourseId(String moduleName, int courseId);

    // Fetch all modules of a course
    List<Module> findByCourse_CourseId(Integer courseId);

    // Fetch modules by batchCycleId, courseTypeId, and courseId
    List<Module> findByCourse_BatchCycle_BatchCycleIdAndCourse_CourseType_CourseTypeIdAndCourse_CourseId(
            Integer batchCycleId, Integer courseTypeId, Integer courseId
    );

    List<Module> findByCourse_CourseIdAndDeletedFalse(Integer courseId);

    List<Module> findByDeletedFalse();


    List<Module> findByCourse_BatchCycle_BatchCycleIdAndCourse_CourseType_CourseTypeIdAndCourse_CourseIdAndDeletedFalse(
            Integer batchCycleId, Integer courseTypeId, Integer courseId);

    @Query("""
                SELECT new com.staff_portal.academic_service.dto.response.ModuleResponseDTO(
                m.moduleId,
                m.moduleName,
                m.theoryHours,
                m.practicalHours
                )
                FROM Module m
                WHERE m.course.courseCode = :courseCode
            """)
    List<ModuleResponseDTO> getAllModulesForCourse(@Param("courseCode") String courseCode);
}
