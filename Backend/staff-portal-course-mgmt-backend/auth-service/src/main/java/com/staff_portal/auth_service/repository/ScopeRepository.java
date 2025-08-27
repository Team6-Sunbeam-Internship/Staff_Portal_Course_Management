package com.staff_portal.auth_service.repository;

import com.staff_portal.auth_service.model.user.RoleName;
import com.staff_portal.auth_service.model.user.Scope;
import com.staff_portal.auth_service.model.user.ScopeName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ScopeRepository extends JpaRepository<Scope, UUID> {

    Optional<Scope> findByName(String name);

    boolean existsByName(ScopeName name);

    // Find all scopes assigned to a role
    @Query("SELECT s FROM Role r JOIN r.scopes s WHERE r.name = :roleName")
    Set<Scope> findScopesByRoleName(RoleName roleName);

    <T> Collection<? extends Scope> findByNameIn(List<T> attr0);
}
