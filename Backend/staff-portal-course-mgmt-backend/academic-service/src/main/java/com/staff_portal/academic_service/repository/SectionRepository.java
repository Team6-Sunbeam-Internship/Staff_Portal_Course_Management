package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.model.Section;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SectionRepository extends JpaRepository<Section, Integer> {
	
    boolean existsBySectionNameAndSubject_SubjectId(String sectionName, Integer subjectId);
    
    // Filter query based on hierarchy
    @Query("""
            SELECT s FROM Section s
            WHERE s.subject.module.course.batchCycle.batchCycleId = :batchCycleId
              AND s.subject.module.course.courseType.courseTypeId = :courseTypeId
              AND s.subject.module.course.courseId = :courseId
              AND s.subject.module.moduleId = :moduleId
              AND s.subject.subjectId = :subjectId
        """)
    List<Section> filterSections(
            @Param("batchCycleId") Integer batchCycleId,
            @Param("courseTypeId") Integer courseTypeId,
            @Param("courseId") Integer courseId,
            @Param("moduleId") Integer moduleId,
            @Param("subjectId") Integer subjectId
    );
    
    List<Section> findBySubject_SubjectId(Integer subjectId);
}