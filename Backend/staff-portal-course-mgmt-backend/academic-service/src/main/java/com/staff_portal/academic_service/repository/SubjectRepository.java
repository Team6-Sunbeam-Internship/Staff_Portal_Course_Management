package com.staff_portal.academic_service.repository;


import com.staff_portal.academic_service.dto.response.SubjectResponseDTO;
import com.staff_portal.academic_service.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {

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
            AND s.deleted = false
            """)
    List<SubjectResponseDTO> getAllSubjectsForModule(@Param("moduleIds") List<UUID> moduleIds);

    boolean existsBySubjectCode(String subjectCode);

    Optional<Subject> findBySubjectCode(String subjectCode);
}
