package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.dto.response.TopicResponseDTO;
import com.staff_portal.academic_service.model.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TopicRepository extends JpaRepository<Topic, UUID> {
    @Query("""
                SELECT new com.staff_portal.academic_service.dto.response.TopicResponseDTO(
                    t.topicId,
                    t.section.sectionId,
                    t.topicName
                )
                FROM Topic t
                WHERE t.section.sectionId IN :sectionIds
                AND t.deleted = false
            """)
    List<TopicResponseDTO> getAllTopicsForSections(@Param("sectionIds") List<UUID> sectionIds);

    boolean existsByTopicCode(String topicCode);
}
