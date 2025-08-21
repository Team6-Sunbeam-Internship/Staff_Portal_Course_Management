package com.staff_portal.academic_service.repository;



import com.staff_portal.academic_service.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {

    // Check if a subject already exists under a given module
    boolean existsBySubjectNameAndModule_ModuleId(String subjectName, int moduleId);
}
