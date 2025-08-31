package com.staff_portal.backend_for_frontend.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.OAuth2AuthorizationException;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class OAuth2AuthorizationFailureHandler implements org.springframework.security.oauth2.client.OAuth2AuthorizationFailureHandler {
    @Override
    public void onAuthorizationFailure(OAuth2AuthorizationException authorizationException,
                                       Authentication principal, Map<String, Object> attributes) {
        log.error("Authorization failed: {}", authorizationException.getError().getDescription());
        if (authorizationException.getError().getErrorCode().equals("invalid_grant")) {
            log.warn("Refresh token expired for principal: {}", principal.getName());
        }
    }
}