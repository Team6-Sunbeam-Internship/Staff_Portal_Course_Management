package com.staff_portal.academic_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.model.CourseType;

@Repository
public interface CourseTypeRepository extends JpaRepository<CourseType, Integer> { 
	
	 // Filter by BatchCycle name (case-insensitive)
    List<CourseType> findByBatchCycle_CycleNameIgnoreCase(String cycleName);
    
	 boolean existsByTypeNameAndBatchCycle_BatchCycleId(String typeName, int batchCycleId);
	
}



