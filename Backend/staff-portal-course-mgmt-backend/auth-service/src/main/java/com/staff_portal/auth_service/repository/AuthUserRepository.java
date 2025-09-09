package com.staff_portal.auth_service.repository;

import com.staff_portal.auth_service.model.users.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AuthUserRepository extends JpaRepository<AuthUser, UUID> {
    
    Optional<AuthUser> findByEmail(String email);
    
    Optional<AuthUser> findByEmailAndActiveTrue(String email);
    
    boolean existsByEmail(String email);
}
