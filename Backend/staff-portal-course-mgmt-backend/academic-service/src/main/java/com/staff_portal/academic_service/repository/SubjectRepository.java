package com.staff_portal.academic_service.repository;



import com.staff_portal.academic_service.model.Subject;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
 
    // Check if a subject already exists under a given module
    boolean existsBySubjectNameAndModule_ModuleId(String subjectName, int moduleId);
    
    List<Subject> findByModule_ModuleId(Integer moduleId);
    
    List<Subject> findByModule_ModuleIdAndModule_Course_CourseIdAndModule_CourseType_CourseTypeIdAndModule_BatchCycle_BatchCycleId(
            Integer moduleId, Integer courseId, Integer courseTypeId, Integer batchCycleId);
}
