package com.staff_portal.academic_service.repository;



import com.staff_portal.academic_service.model.Subject;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
	  // All filters
    List<Subject> findByModule_Course_CourseType_BatchCycle_CycleNameIgnoreCaseAndModule_Course_CourseType_TypeNameIgnoreCaseAndModule_Course_CourseNameIgnoreCaseAndModule_ModuleNameIgnoreCase(
            String batchCycleName, String courseTypeName, String courseName, String moduleName);

    // 3 filters
    List<Subject> findByModule_Course_CourseType_BatchCycle_CycleNameIgnoreCaseAndModule_Course_CourseType_TypeNameIgnoreCaseAndModule_Course_CourseNameIgnoreCase(
            String batchCycleName, String courseTypeName, String courseName);

    // 2 filters
    List<Subject> findByModule_Course_CourseType_BatchCycle_CycleNameIgnoreCaseAndModule_Course_CourseType_TypeNameIgnoreCase(
            String batchCycleName, String courseTypeName);

    List<Subject> findByModule_Course_CourseType_BatchCycle_CycleNameIgnoreCase(String batchCycleName);

    List<Subject> findByModule_Course_CourseType_TypeNameIgnoreCase(String courseTypeName);

    List<Subject> findByModule_Course_CourseNameIgnoreCase(String courseName);

    List<Subject> findByModule_ModuleNameIgnoreCase(String moduleName);

    // Check if a subject already exists under a given module
    boolean existsBySubjectNameAndModule_ModuleId(String subjectName, int moduleId);
}
