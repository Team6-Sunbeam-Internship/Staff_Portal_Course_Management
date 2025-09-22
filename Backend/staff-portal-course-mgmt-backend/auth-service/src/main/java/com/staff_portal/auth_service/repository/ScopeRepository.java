package com.staff_portal.auth_service.repository;

import com.staff_portal.auth_service.model.users.Scope;
import com.staff_portal.auth_service.model.users.ScopeType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface ScopeRepository extends JpaRepository<Scope, Long> {
    Set<Scope> findByNameIn(Set<ScopeType> names);
    
    Optional<Scope> findByName(ScopeType scopeType);
    
    List<Scope> findByActiveTrue();

    boolean existsByName(ScopeType name);

    Optional<Scope> findByNameAndActiveTrue(ScopeType name);
    List<Scope> findAllByActiveTrue();

}