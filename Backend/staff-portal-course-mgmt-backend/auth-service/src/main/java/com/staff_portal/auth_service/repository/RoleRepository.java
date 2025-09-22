package com.staff_portal.auth_service.repository;

import com.staff_portal.auth_service.model.users.Role;
import com.staff_portal.auth_service.model.users.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    
    Optional<Role> findByName(RoleType roleType);
    
    Optional<Role> findByNameAndActiveTrue(RoleType roleType);

    boolean existsByName(RoleType name);
}