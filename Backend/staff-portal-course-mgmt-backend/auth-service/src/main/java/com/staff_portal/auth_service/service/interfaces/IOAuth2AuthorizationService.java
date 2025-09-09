package com.staff_portal.auth_service.service.interfaces;

import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;

public interface IOAuth2AuthorizationService extends OAuth2AuthorizationService {
    
    void save(OAuth2Authorization authorization);
    
    void remove(OAuth2Authorization authorization);
    
    OAuth2Authorization findById(String id);
    
    OAuth2Authorization findByToken(String token, OAuth2TokenType tokenType);
}