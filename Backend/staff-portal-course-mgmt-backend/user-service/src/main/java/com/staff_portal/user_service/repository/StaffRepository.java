package com.staff_portal.user_service.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.staff_portal.user_service.model.Staff;

public interface StaffRepository extends JpaRepository<Staff, UUID> {

	List<Staff> findAllByIsDeletedFalse();

	Optional<Staff> findByStaffIdAndIsDeletedFalse(UUID staffId);
	
}
