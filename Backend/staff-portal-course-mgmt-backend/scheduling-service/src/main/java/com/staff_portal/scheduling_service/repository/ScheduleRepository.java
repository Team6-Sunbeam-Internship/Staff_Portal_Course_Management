package com.staff_portal.scheduling_service.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.staff_portal.scheduling_service.model.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

//	Page<Schedule> findByBatchCycleCourseAndDateRange(String batchCycleName, String courseName, LocalDate startDate,
//			LocalDate endDate, Pageable pageable);

	@Query("SELECT s FROM Schedule s " +
	           "WHERE s.batchCycleName = :batchCycleName " +
	           "AND s.courseName = :courseName " +
	           "AND s.scheduleDate BETWEEN :startDate AND :endDate")
	    Page<Schedule> findByBatchCycleCourseAndDateRange(
	            @Param("batchCycleName") String batchCycleName,
	            @Param("courseName") String courseName,
	            @Param("startDate") LocalDate startDate,
	            @Param("endDate") LocalDate endDate,
	            Pageable pageable
	    );
	
	
	
	@Query("""
	        SELECT s FROM Schedule s
	        JOIN s.timeSlot t
	        WHERE s.infrastructureName = :infrastructureName
	          AND s.scheduleDate = :scheduleDate
	          AND (
	               t.startTime < :endTime
	               AND t.endTime > :startTime
	          )
	          AND s.isDeleted = false
	    """)
	List<Schedule> findConflictingSchedules(
            @Param("infrastructureName") String infrastructureName,
            @Param("scheduleDate") LocalDate scheduleDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

}