package com.staff_portal.auth_service.repository;

import com.staff_portal.auth_service.model.oauth2.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, String> {
    Optional<Client> findByClientId(String clientId);

    boolean existsByClientId(String clientId);
}
