package com.staff_portal.auth_service.repository;

import com.staff_portal.auth_service.model.user.AuthUser;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthUserRepository extends JpaRepository<AuthUser, UUID> {

    @EntityGraph(attributePaths = {"roles", "roles.scopes", "roles.scopes.roles"})
    Optional<AuthUser> findByUsername(String username);
    boolean existsByUsername(String username);

    // Fetch roles along with user (avoid N+1 issue)
    @EntityGraph(attributePaths = "roles")
    Optional<AuthUser> findWithRolesByUsername(String username);
}
