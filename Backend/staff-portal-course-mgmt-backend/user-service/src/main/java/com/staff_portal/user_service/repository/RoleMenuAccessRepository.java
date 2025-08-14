package com.staff_portal.user_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.staff_portal.user_service.model.RoleMenuAccess;

public interface RoleMenuAccessRepository extends JpaRepository<RoleMenuAccess, Long> {

}
