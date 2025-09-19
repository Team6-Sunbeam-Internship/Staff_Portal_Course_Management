package com.staff_portal.academic_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.model.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

	
    boolean existsByCourseCode(String courseCode);
    
//    List<Course> findByCourseTypeId(int courseTypeId);
    

    // Filter by BatchCycle ID + CourseType ID
//    List<Course> findByCourseType_BatchCycle_BatchCycleIdAndCourseType_CourseTypeId(
//            Integer batchCycleId, Integer courseTypeId);
    
    List<Course> findByCourseType_CourseTypeId(Integer courseTypeId);
    
    List<Course> findByBatchCycle_BatchCycleIdAndCourseType_CourseTypeId(
            Integer batchCycleId,
            Integer courseTypeId
        );
    
    
//        List<Course> findByBatchCycle_IdAndCourseType_Id(Integer batchCycleId, Integer courseTypeId);
    


}

