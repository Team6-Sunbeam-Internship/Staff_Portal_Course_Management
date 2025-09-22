
package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.model.Module;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {

    boolean existsByModuleNameAndCourse_CourseId(String moduleName, int courseId);
    
    List<Module> findByCourse_CourseId(Integer courseId);
    
 

    // Fetch modules by exact batchCycleId, courseTypeId, and courseId
    List<Module> findByBatchCycle_BatchCycleIdAndCourseType_CourseTypeIdAndCourse_CourseId(
            Integer batchCycleId, Integer courseTypeId, Integer courseId
    );
}
