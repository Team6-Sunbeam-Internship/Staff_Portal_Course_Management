package com.staff_portal.auth_service.repository;

import com.staff_portal.auth_service.model.oauth2.oauth2registeredclient.OAuth2RegisteredClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OAuth2RegisteredClientRepository extends JpaRepository<OAuth2RegisteredClientEntity, String> {
    
    Optional<OAuth2RegisteredClientEntity> findByClientId(String clientId);
    
    Optional<OAuth2RegisteredClientEntity> findByClientIdAndActiveTrue(String clientId);
    
    List<OAuth2RegisteredClientEntity> findByActiveTrue();
    
    @Query("SELECT c FROM OAuth2RegisteredClientEntity c WHERE c.clientSecretExpiresAt < :now")
    List<OAuth2RegisteredClientEntity> findExpiredClientSecrets(@Param("now") Instant now);
    
    @Query("SELECT c FROM OAuth2RegisteredClientEntity c WHERE c.clientName LIKE %:name%")
    List<OAuth2RegisteredClientEntity> findByClientNameContaining(@Param("name") String name);
    
    boolean existsByClientId(String clientId);
    
    @Modifying
    @Query("UPDATE OAuth2RegisteredClientEntity c SET c.active = false WHERE c.id = :id")
    void deactivateClient(@Param("id") String id);
}