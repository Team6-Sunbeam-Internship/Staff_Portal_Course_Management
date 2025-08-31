package com.staff_portal.academic_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.model.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {
	List<Course> findByCourseType_BatchCycle_CycleName(String batchCycleName);

    List<Course> findByCourseType_TypeName(String courseTypeName);

    List<Course> findByCourseType_BatchCycle_CycleNameAndCourseType_TypeName(String batchCycleName, String courseTypeName);
    
    boolean existsByCourseCode(String courseCode);
}

