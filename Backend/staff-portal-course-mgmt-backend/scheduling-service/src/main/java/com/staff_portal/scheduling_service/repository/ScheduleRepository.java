package com.staff_portal.scheduling_service.repository;

import com.staff_portal.scheduling_service.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, UUID> {

//	Page<Schedule> findByBatchCycleCourseAndDateRange(String batchCycleName, String courseName, LocalDate startDate,
//			LocalDate endDate, Pageable pageable);


    @Query("""
                SELECT s FROM Schedule s
                JOIN s.timeSlot t
                WHERE s.venue = :infrastructure
                  AND s.scheduleDate = :scheduleDate
                  AND (
                       t.startTime < :endTime
                       AND t.endTime > :startTime
                  )
                  AND s.isDeleted = false
            """)
    List<Schedule> findConflictingSchedules(
            @Param("infrastructure") UUID infrastructure,
            @Param("scheduleDate") LocalDate scheduleDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime
    );

    @Query("""
            SELECT s
            FROM Schedule s
            WHERE (:staffId IS NULL OR s.createdBy = :staffId)
            AND (:courseCode IS NULL OR s.courseCode = :courseCode)
            AND(:startDate IS NULL OR s.scheduleDate BETWEEN :startDate AND :endDate)
            AND(:endDate IS NULL OR s.scheduleDate BETWEEN :startDate AND :endDate)
            AND s.isDeleted = false
            """)
    List<Schedule> findSchedulesForCoordinator(
            @Param("staffId") UUID staffId,
            @Param("courseCode") String courseCode,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

}