package com.staff_portal.academic_service.repository;



import com.staff_portal.academic_service.dto.response.SubjectResponseDTO;
import com.staff_portal.academic_service.model.Subject;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {

    // Check if a subject already exists under a given module (not soft-deleted)
    boolean existsBySubjectNameAndModule_ModuleIdAndDeletedFalse(String subjectName, int moduleId);

    // Get all subjects of a module (excluding soft-deleted)
    List<Subject> findByModule_ModuleIdAndDeletedFalse(Integer moduleId);

    // Global filter for fetching only active subjects
    List<Subject> findByDeletedFalse();

    // Fetch by all filters (only active)
    List<Subject> findByModule_ModuleIdAndModule_Course_CourseIdAndModule_Course_CourseType_CourseTypeIdAndModule_Course_BatchCycle_BatchCycleIdAndDeletedFalse(
            Integer moduleId, Integer courseId, Integer courseTypeId, Integer batchCycleId
    );

    @Query("""
            SELECT new com.staff_portal.academic_service.dto.response.SubjectResponseDTO (
            s.subjectId,
            s.module.moduleId,
            s.subjectName,
            s.theoryHours,
            s.practicalHours
            ) 
            FROM Subject s
            WHERE s.module.moduleId IN :moduleIds
            """)
    List<SubjectResponseDTO> getAllSubjectsForModule(@Param("moduleId") List<UUID> moduleIds);
}
