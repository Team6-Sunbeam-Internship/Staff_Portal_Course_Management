package com.staff_portal.auth_service.service.interfaces;

import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationConsent;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationConsentService;

import java.time.Duration;
import java.util.List;

public interface IOAuth2AuthorizationConsentService extends OAuth2AuthorizationConsentService {
    
    void save(OAuth2AuthorizationConsent authorizationConsent);
    
    void remove(OAuth2AuthorizationConsent authorizationConsent);
    
    OAuth2AuthorizationConsent findById(String registeredClientId, String principalName);
    
    List<OAuth2AuthorizationConsent> findByPrincipalName(String principalName);
    
    List<OAuth2AuthorizationConsent> findByRegisteredClientId(String registeredClientId);
    
    List<OAuth2AuthorizationConsent> findByAuthority(String authority);
    
    List<OAuth2AuthorizationConsent> findOldConsents(Duration olderThan);
    
    void cleanupOldConsents(Duration olderThan);
    
    long countByRegisteredClientId(String clientId);
    
    long countByPrincipalName(String principalName);
    
    boolean existsById(String registeredClientId, String principalName);
    
    void removeById(String registeredClientId, String principalName);
}