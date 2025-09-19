package com.staff_portal.academic_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.model.Topic;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {
    boolean existsByTopicNameAndSection_SectionId(String topicName, Integer sectionId);
    // Get all topics by SectionId
    List<Topic> findBySection_SectionId(Integer sectionId);
    
    @Query("SELECT t FROM Topic t " +
    	       "WHERE t.section.sectionId = :sectionId " +
    	       "AND t.section.subject.subjectId = :subjectId " +
    	       "AND t.section.subject.module.moduleId = :moduleId " +
    	       "AND t.section.subject.module.course.courseId = :courseId " +
    	       "AND t.section.subject.module.course.courseType.courseTypeId = :courseTypeId " +
    	       "AND t.section.subject.module.course.batchCycle.batchCycleId = :batchCycleId")
    	List<Topic> findTopicsByAllFilters(
    	        @Param("batchCycleId") Integer batchCycleId,
    	        @Param("courseTypeId") Integer courseTypeId,
    	        @Param("courseId") Integer courseId,
    	        @Param("moduleId") Integer moduleId,
    	        @Param("subjectId") Integer subjectId,
    	        @Param("sectionId") Integer sectionId
    	);

    // Find all topics in a given section
    List<Topic> findBySection_SectionId(int sectionId);


}
