package com.staff_portal.academic_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.model.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

	
    boolean existsByCourseCode(String courseCode);
    
    
//    List<Course> findByCourseType_CourseTypeId(Integer courseTypeId);
//    
    List<Course> findByBatchCycle_BatchCycleIdAndCourseType_CourseTypeId(
            Integer batchCycleId,
            Integer courseTypeId
        );
    
    
    //  Fetch all non-deleted courses
    List<Course> findByDeletedFalse();

    //  Fetch by ID if not deleted
    Course findByCourseIdAndDeletedFalse(int courseId);

    //  Fetch courses by courseType if not deleted
    List<Course> findByCourseType_CourseTypeIdAndDeletedFalse(Integer courseTypeId);

    //  Fetch courses by BatchCycle + CourseType if not deleted
    List<Course> findByBatchCycle_BatchCycleIdAndCourseType_CourseTypeIdAndDeletedFalse(
            Integer batchCycleId,
            Integer courseTypeId
    );

}

