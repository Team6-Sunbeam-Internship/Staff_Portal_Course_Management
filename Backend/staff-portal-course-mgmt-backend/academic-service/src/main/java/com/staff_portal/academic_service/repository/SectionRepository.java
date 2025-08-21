package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SectionRepository extends JpaRepository<Section, Integer> {
	
    boolean existsBySectionNameAndSubject_SubjectId(String sectionName, Integer subjectId);
    
}