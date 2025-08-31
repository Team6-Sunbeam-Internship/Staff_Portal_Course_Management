package com.staff_portal.backend_for_frontend.security;

import com.staff_portal.backend_for_frontend.repository.CustomOidcUserService;
import com.staff_portal.backend_for_frontend.service.StatePreservationService;
import com.staff_portal.backend_for_frontend.util.CookieUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@Slf4j
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final StatePreservationService statePreservationService;
    private final CustomOidcUserService customOidcUserService;
    private final CookieUtil cookieUtil;

    @Value("${bff.frontend.base-url}")
    private String frontendBaseUrl;

    public OAuth2LoginSuccessHandler(StatePreservationService statePreservationService, CustomOidcUserService customOidcUserService, CookieUtil cookieUtil) {
        this.statePreservationService = statePreservationService;
        this.customOidcUserService = customOidcUserService;
        this.cookieUtil = cookieUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        if (authentication instanceof OAuth2AuthenticationToken token) {

            // Ensure consistent session ID management
            String sessionId = getOrCreateBffSessionId(request, response);

            OidcUser principal = (OidcUser) token.getPrincipal();
            customOidcUserService.cachedUserData(sessionId, principal.getAttributes());

            String redirectTo = statePreservationService.getOriginalRequestUrl(request);
            handleRedirect(request, response, redirectTo);
        }
    }

    private String getOrCreateBffSessionId(HttpServletRequest request, HttpServletResponse response) {
        String existingSessionId = cookieUtil.getBffSessionId(request);
        if (existingSessionId != null) {
            return existingSessionId;
        }

        String newSessionId = UUID.randomUUID().toString();
        ResponseCookie bffSessionCookie = cookieUtil.createSecureBffSessionCookie(newSessionId, 3600);
        response.addHeader("Set-Cookie", bffSessionCookie.toString());
        log.debug("Created new BFF session ID for authentication: {}", newSessionId);
        return newSessionId;
    }

    private void handleRedirect(HttpServletRequest request, HttpServletResponse response, String redirectTo)
            throws IOException {
        if (redirectTo != null) {
            statePreservationService.clearOriginalRequest(request);
            log.debug("Redirecting to preserved URL: {}", redirectTo);
            response.sendRedirect(redirectTo);
        } else {
            log.debug("Redirecting to default dashboard");
            response.sendRedirect(frontendBaseUrl + "/dashboard");
        }
    }
}