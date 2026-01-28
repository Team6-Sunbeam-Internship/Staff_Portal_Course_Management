package com.staff_portal.backend_for_frontend.service;

import com.staff_portal.backend_for_frontend.dto.SessionResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

public interface ISessionService {
    SessionResponse checkSession(OidcUser oidcUser, Authentication authentication);
}