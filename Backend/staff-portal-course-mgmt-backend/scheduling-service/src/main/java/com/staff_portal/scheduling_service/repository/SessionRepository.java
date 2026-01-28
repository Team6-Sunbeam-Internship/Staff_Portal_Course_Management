package com.staff_portal.scheduling_service.repository;

import com.staff_portal.scheduling_service.model.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {


    @Query("SELECT s FROM Session s " +
            "WHERE s.batchCycleName = :batchCycleName " +
            "AND s.courseName = :courseName " +
            "AND s.sessionDate BETWEEN :startDate AND :endDate")
    Page<Session> findByBatchCycleCourseAndDateRange(String batchCycleName, String courseName,
                                                     LocalDate startDate, LocalDate endDate, Pageable pageable);

}

