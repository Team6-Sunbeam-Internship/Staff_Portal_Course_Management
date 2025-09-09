package com.staff_portal.auth_service.repository;

import com.staff_portal.auth_service.model.oauth2.oauth2authorizationconsent.OAuth2AuthorizationConsentEntity;
import com.staff_portal.auth_service.model.oauth2.oauth2authorizationconsent.OAuth2AuthorizationConsentId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OAuth2AuthorizationConsentRepository extends JpaRepository<OAuth2AuthorizationConsentEntity, OAuth2AuthorizationConsentId> {
    
    Optional<OAuth2AuthorizationConsentEntity> findByIdRegisteredClientIdAndIdPrincipalName(String registeredClientId, String principalName);
    
    List<OAuth2AuthorizationConsentEntity> findByIdPrincipalName(String principalName);
    
    List<OAuth2AuthorizationConsentEntity> findByIdRegisteredClientId(String registeredClientId);
    
    @Query("SELECT c FROM OAuth2AuthorizationConsentEntity c WHERE :authority MEMBER OF c.authorities")
    List<OAuth2AuthorizationConsentEntity> findByAuthority(@Param("authority") String authority);
    
    @Query("SELECT c FROM OAuth2AuthorizationConsentEntity c WHERE c.createdAt < :cutoffTime")
    List<OAuth2AuthorizationConsentEntity> findOldConsents(@Param("cutoffTime") Instant cutoffTime);
    
    @Modifying
    @Query("DELETE FROM OAuth2AuthorizationConsentEntity c WHERE c.createdAt < :cutoffTime")
    void deleteOldConsents(@Param("cutoffTime") Instant cutoffTime);
    
    @Query("SELECT COUNT(c) FROM OAuth2AuthorizationConsentEntity c WHERE c.id.registeredClientId = :clientId")
    long countByRegisteredClientId(@Param("clientId") String clientId);
    
    @Query("SELECT COUNT(c) FROM OAuth2AuthorizationConsentEntity c WHERE c.id.principalName = :principalName")
    long countByPrincipalName(@Param("principalName") String principalName);
    
    boolean existsByIdRegisteredClientIdAndIdPrincipalName(String registeredClientId, String principalName);
    
    void deleteByIdRegisteredClientIdAndIdPrincipalName(String registeredClientId, String principalName);
}