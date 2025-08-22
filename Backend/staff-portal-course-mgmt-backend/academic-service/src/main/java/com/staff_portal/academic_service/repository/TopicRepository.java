package com.staff_portal.academic_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.model.Topic;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {
    boolean existsByTopicNameAndSection_SectionId(String topicName, Integer sectionId);
}
