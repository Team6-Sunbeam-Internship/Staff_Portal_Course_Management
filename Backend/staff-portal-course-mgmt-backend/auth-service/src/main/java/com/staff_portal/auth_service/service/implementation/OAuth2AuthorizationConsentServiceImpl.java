package com.staff_portal.auth_service.service.implementation;

import com.staff_portal.auth_service.model.oauth2.oauth2authorizationconsent.OAuth2AuthorizationConsentEntity;
import com.staff_portal.auth_service.repository.OAuth2AuthorizationConsentRepository;
import com.staff_portal.auth_service.service.interfaces.IOAuth2AuthorizationConsentService;
import com.staff_portal.auth_service.service.interfaces.IRegisteredClientService;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationConsent;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class OAuth2AuthorizationConsentServiceImpl implements IOAuth2AuthorizationConsentService {
    
    private final OAuth2AuthorizationConsentRepository consentRepository;
    private final IRegisteredClientService registeredClientService;
    
    public OAuth2AuthorizationConsentServiceImpl(OAuth2AuthorizationConsentRepository consentRepository,
                                               IRegisteredClientService registeredClientService) {
        Assert.notNull(consentRepository, "consentRepository cannot be null");
        Assert.notNull(registeredClientService, "registeredClientService cannot be null");
        this.consentRepository = consentRepository;
        this.registeredClientService = registeredClientService;
    }
    
    @Override
    public void save(OAuth2AuthorizationConsent authorizationConsent) {
        Assert.notNull(authorizationConsent, "authorizationConsent cannot be null");
        this.consentRepository.save(toEntity(authorizationConsent));
    }
    
    @Override
    public void remove(OAuth2AuthorizationConsent authorizationConsent) {
        Assert.notNull(authorizationConsent, "authorizationConsent cannot be null");
        this.consentRepository.deleteByIdRegisteredClientIdAndIdPrincipalName(
                authorizationConsent.getRegisteredClientId(), 
                authorizationConsent.getPrincipalName());
    }
    
    @Override
    @Transactional(readOnly = true)
    public OAuth2AuthorizationConsent findById(String registeredClientId, String principalName) {
        Assert.hasText(registeredClientId, "registeredClientId cannot be empty");
        Assert.hasText(principalName, "principalName cannot be empty");
        return this.consentRepository.findByIdRegisteredClientIdAndIdPrincipalName(registeredClientId, principalName)
                .map(this::toObject)
                .orElse(null);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<OAuth2AuthorizationConsent> findByPrincipalName(String principalName) {
        Assert.hasText(principalName, "principalName cannot be empty");
        return this.consentRepository.findByIdPrincipalName(principalName)
                .stream()
                .map(this::toObject)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<OAuth2AuthorizationConsent> findByRegisteredClientId(String registeredClientId) {
        Assert.hasText(registeredClientId, "registeredClientId cannot be empty");
        return this.consentRepository.findByIdRegisteredClientId(registeredClientId)
                .stream()
                .map(this::toObject)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<OAuth2AuthorizationConsent> findByAuthority(String authority) {
        Assert.hasText(authority, "authority cannot be empty");
        return this.consentRepository.findByAuthority(authority)
                .stream()
                .map(this::toObject)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<OAuth2AuthorizationConsent> findOldConsents(Duration olderThan) {
        Assert.notNull(olderThan, "olderThan cannot be null");
        Instant cutoffTime = Instant.now().minus(olderThan);
        return this.consentRepository.findOldConsents(cutoffTime)
                .stream()
                .map(this::toObject)
                .collect(Collectors.toList());
    }
    
    @Override
    public void cleanupOldConsents(Duration olderThan) {
        Assert.notNull(olderThan, "olderThan cannot be null");
        Instant cutoffTime = Instant.now().minus(olderThan);
        this.consentRepository.deleteOldConsents(cutoffTime);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByRegisteredClientId(String clientId) {
        Assert.hasText(clientId, "clientId cannot be empty");
        return this.consentRepository.countByRegisteredClientId(clientId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByPrincipalName(String principalName) {
        Assert.hasText(principalName, "principalName cannot be empty");
        return this.consentRepository.countByPrincipalName(principalName);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsById(String registeredClientId, String principalName) {
        Assert.hasText(registeredClientId, "registeredClientId cannot be empty");
        Assert.hasText(principalName, "principalName cannot be empty");
        return this.consentRepository.existsByIdRegisteredClientIdAndIdPrincipalName(registeredClientId, principalName);
    }
    
    @Override
    public void removeById(String registeredClientId, String principalName) {
        Assert.hasText(registeredClientId, "registeredClientId cannot be empty");
        Assert.hasText(principalName, "principalName cannot be empty");
        this.consentRepository.deleteByIdRegisteredClientIdAndIdPrincipalName(registeredClientId, principalName);
    }
    
    private OAuth2AuthorizationConsent toObject(OAuth2AuthorizationConsentEntity entity) {
        String registeredClientId = entity.getRegisteredClientId();
        RegisteredClient registeredClient = this.registeredClientService.findById(registeredClientId);
        
        if (registeredClient == null) {
            throw new DataRetrievalFailureException(
                    "The RegisteredClient with id '" + registeredClientId + "' was not found in the RegisteredClientRepository.");
        }
        
        OAuth2AuthorizationConsent.Builder builder = OAuth2AuthorizationConsent.withId(
                registeredClientId, entity.getPrincipalName());
        
        entity.getAuthorities().forEach(authority -> 
            builder.authority(new SimpleGrantedAuthority(authority)));
        
        return builder.build();
    }
    
    private OAuth2AuthorizationConsentEntity toEntity(OAuth2AuthorizationConsent authorizationConsent) {
        Set<String> authorities = authorizationConsent.getAuthorities()
                .stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());
        
        return new OAuth2AuthorizationConsentEntity(
                authorizationConsent.getRegisteredClientId(),
                authorizationConsent.getPrincipalName(),
                authorities);
    }
}