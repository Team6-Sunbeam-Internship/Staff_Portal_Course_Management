package com.staff_portal.academic_service.repository;

import com.staff_portal.academic_service.model.BatchCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BatchCycleRepository extends JpaRepository<BatchCycle, UUID> {
	boolean existsByBatchCycleName(String cycleName);
}
