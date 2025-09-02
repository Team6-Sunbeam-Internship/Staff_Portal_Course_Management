package com.staff_portal.user_service.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.user_service.model.StaffMenuAccess;

@Repository
public interface StaffMenuAccessRepository extends JpaRepository<StaffMenuAccess, UUID> {
    
    List<StaffMenuAccess> findByStaff_StaffId(UUID staffId);
}