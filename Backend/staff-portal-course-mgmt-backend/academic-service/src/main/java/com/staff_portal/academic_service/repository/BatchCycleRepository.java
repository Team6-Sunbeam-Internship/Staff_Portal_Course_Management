package com.staff_portal.academic_service.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.staff_portal.academic_service.model.BatchCycle;

@Repository
public interface BatchCycleRepository extends JpaRepository<BatchCycle, UUID> {
	boolean existsByCycleName(String cycleName);

	@Query("SELECT b.cycleName FROM BatchCycle b")
	List<String> findAllCycleNames();
}
