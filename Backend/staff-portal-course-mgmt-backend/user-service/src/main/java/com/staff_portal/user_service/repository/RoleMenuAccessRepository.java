package com.staff_portal.user_service.repository;

import com.staff_portal.user_service.enums.StaffRole;
import com.staff_portal.user_service.model.MenuItem;
import com.staff_portal.user_service.model.RoleMenuAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleMenuAccessRepository extends JpaRepository<RoleMenuAccess, UUID> {
	List<RoleMenuAccess> findByRole(StaffRole roleName);

    Optional<RoleMenuAccess> findByRoleAndMenuItem(StaffRole role, MenuItem descendant);
}
