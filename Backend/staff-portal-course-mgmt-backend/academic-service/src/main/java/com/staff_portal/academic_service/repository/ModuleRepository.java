
package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.model.Module;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {
//	 List<Module> findByCourse_CourseType_BatchCycle_CycleName(String batchCycleName);

//	    List<Module> findByCourse_CourseType_TypeName(String courseTypeName);

//	    List<Module> findByCourse_CourseName(String courseName);
	List<Module> findByCourse_CourseType_BatchCycle_CycleNameIgnoreCaseAndCourse_CourseType_TypeNameIgnoreCaseAndCourse_CourseNameIgnoreCase(
	        String batchCycleName, String courseTypeName, String courseName);

	List<Module> findByCourse_CourseType_BatchCycle_CycleNameIgnoreCaseAndCourse_CourseType_TypeNameIgnoreCase(
	        String batchCycleName, String courseTypeName);

//	    List<Module> findByCourse_CourseType_BatchCycle_CycleNameAndCourse_CourseType_TypeName(
//	            String batchCycleName, String courseTypeName);

//	    List<Module> findByCourse_CourseType_BatchCycle_CycleNameAndCourse_CourseType_TypeNameAndCourse_CourseName(
//	            String batchCycleName, String courseTypeName, String courseName);
	    List<Module> findByCourse_CourseType_BatchCycle_CycleNameIgnoreCase(String batchCycleName);
	    List<Module> findByCourse_CourseType_TypeNameIgnoreCase(String courseTypeName);
	    List<Module> findByCourse_CourseNameIgnoreCase(String courseName);
    boolean existsByModuleNameAndCourse_CourseId(String moduleName, int courseId);
}
