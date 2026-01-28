package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.dto.response.SectionResponseDTO;
import com.staff_portal.academic_service.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface SectionRepository extends JpaRepository<Section, UUID> {

    @Query("""
                SELECT new com.staff_portal.academic_service.dto.response.SectionResponseDTO(
                    sec.sectionId,
                    sec.subject.subjectId,
                    sec.sectionName
                )
                FROM Section sec
                WHERE sec.subject.subjectId IN :subjectIds
                AND sec.deleted = false
            """)
    List<SectionResponseDTO> getAllSectionsForSubjects(@Param("subjectIds") List<UUID> subjectIds);

    boolean existsBySectionCode(String sectionCode);
}