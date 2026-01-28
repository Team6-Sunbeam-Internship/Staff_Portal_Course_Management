package com.staff_portal.scheduling_service.repository;

import com.staff_portal.scheduling_service.model.RecordedSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.UUID;

public interface RecordedSessionRepository extends JpaRepository<RecordedSession, UUID> {


    @Query("SELECT r FROM RecordedSession r " +
            "WHERE r.batchCycleName = :batchCycleName " +
            "AND r.courseName = :courseName " +
            "AND r.sessionDate BETWEEN :startDate AND :endDate")
    Page<RecordedSession> findByBatchCycleCourseAndDateRange(String batchCycleName, String courseName,
                                                             LocalDate startDate, LocalDate endDate, Pageable pageable);

}
