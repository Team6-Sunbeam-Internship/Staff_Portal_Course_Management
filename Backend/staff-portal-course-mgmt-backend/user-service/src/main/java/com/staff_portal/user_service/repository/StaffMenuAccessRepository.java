package com.staff_portal.user_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.user_service.model.StaffMenuAccess;

@Repository
public interface StaffMenuAccessRepository extends JpaRepository<StaffMenuAccess, Long> {
	List<StaffMenuAccess> findByStaffId(String staffId);
}
