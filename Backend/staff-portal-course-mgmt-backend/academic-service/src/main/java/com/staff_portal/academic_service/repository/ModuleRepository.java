
package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {
    boolean existsByModuleNameAndCourse_CourseId(String moduleName, int courseId);
}
