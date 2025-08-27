package com.staff_portal.auth_service.repository;

import com.staff_portal.auth_service.model.user.Role;
import com.staff_portal.auth_service.model.user.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(RoleName name);

    // Find all roles assigned to a given user
    @Query("SELECT r FROM AuthUser u JOIN u.roles r WHERE u.id = :userId")
    List<Role> findRolesByUserId(UUID userId);

    // Find all roles that contain a given scope
    @Query("SELECT r FROM Role r JOIN r.scopes s WHERE s.name = :scopeName")
    List<Role> findRolesByScope(String scopeName);

    boolean existsByName(RoleName name);
}
