package com.staff_portal.user_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staff_portal.user_service.model.RoleMenuAccess;

@Repository
public interface RoleMenuAccessRepository extends JpaRepository<RoleMenuAccess, Long> {
	List<RoleMenuAccess> findByRoleNameIgnoreCase(String roleName);
}
