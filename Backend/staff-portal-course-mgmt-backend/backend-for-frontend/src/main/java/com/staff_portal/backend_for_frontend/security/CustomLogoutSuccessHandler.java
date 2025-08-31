package com.staff_portal.backend_for_frontend.security;

import com.staff_portal.backend_for_frontend.config.OAuth2EndpointsConfig;
import com.staff_portal.backend_for_frontend.service.TokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomLogoutSuccessHandler implements LogoutSuccessHandler {
    private final OAuth2AuthorizedClientRepository authorizedClientRepository;
    private final TokenService tokenService;
    private final OAuth2EndpointsConfig endpointsConfig;
    @Value("${bff.frontend.base-url}")
    private String frontendBaseUrl;
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response,
                                Authentication authentication) throws IOException, ServletException {
        if (authentication instanceof OAuth2AuthenticationToken token) {
            try {
                OAuth2AuthorizedClient client = authorizedClientRepository.loadAuthorizedClient(
                    token.getAuthorizedClientRegistrationId(), authentication, request);
                if (client != null) {
                    tokenService.revokeToken(client);
                    authorizedClientRepository.removeAuthorizedClient(
                        token.getAuthorizedClientRegistrationId(), authentication, request, response);
                    log.info("Successfully revoked tokens for user: {}", authentication.getName());
                }
            } catch (Exception e) {
                log.error("Error during logout token revocation", e);
            }
        }
        String logoutRedirectUrl = frontendBaseUrl + "?logout=success";
        response.sendRedirect(logoutRedirectUrl);
    }
}