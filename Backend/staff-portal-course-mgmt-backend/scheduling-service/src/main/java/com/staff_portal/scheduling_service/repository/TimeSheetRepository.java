package com.staff_portal.scheduling_service.repository;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.staff_portal.scheduling_service.model.TimeSheet;

@Repository
public interface TimeSheetRepository extends JpaRepository<TimeSheet, Long> {

	@Query("SELECT t FROM TimeSheet t " +
	           "WHERE t.batchCycleName = :batchCycleName " +
	           "AND t.courseModule.courseName = :courseName " +
	           "AND t.courseModule.moduleName = :moduleName " +
	           "AND t.logDate BETWEEN :startDate AND :endDate")
	    Page<TimeSheet> findTimeSheetsByFilters(
	            @Param("batchCycleName") String batchCycleName,
	            @Param("courseName") String courseName,
	            @Param("moduleName") String moduleName,
	            @Param("startDate") LocalDate startDate,
	            @Param("endDate") LocalDate endDate,
	            Pageable pageable
	    );
	
}

