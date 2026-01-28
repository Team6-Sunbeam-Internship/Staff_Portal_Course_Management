package com.staff_portal.backend_for_frontend.security;

import com.staff_portal.backend_for_frontend.repository.IRedisClientRegistrationRepository;
import com.staff_portal.backend_for_frontend.service.TokenService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.web.FormPostRedirectStrategy;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;


@Component
@Slf4j
public class CustomLogoutSuccessHandler implements LogoutSuccessHandler {
    private final OidcClientInitiatedLogoutSuccessHandler oidcLogoutSuccessHandler;
    private final OAuth2AuthorizedClientService authorizedClientService;
    private TokenService tokenService;
    @Value("${bff.frontend.base-url}")
    private String frontendBaseUrl;

    public CustomLogoutSuccessHandler(IRedisClientRegistrationRepository clientRegistrationRepository, OAuth2AuthorizedClientService authorizedClientService, TokenService tokenService) {
        this.oidcLogoutSuccessHandler = new OidcClientInitiatedLogoutSuccessHandler(clientRegistrationRepository);

        this.oidcLogoutSuccessHandler.setRedirectStrategy(new FormPostRedirectStrategy());
        this.oidcLogoutSuccessHandler.setPostLogoutRedirectUri(frontendBaseUrl + "?logout=success");
        this.authorizedClientService = authorizedClientService;
        this.tokenService = tokenService;
    }

    @Override
    public void onLogoutSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws ServletException, IOException {

        log.info("Logout successful");

        if (authentication instanceof OAuth2AuthenticationToken token) {
            String registrationId = token.getAuthorizedClientRegistrationId();
            String principalName = authentication.getName();

            OAuth2AuthorizedClient client =
                    authorizedClientService.loadAuthorizedClient(
                            registrationId, principalName);

            if (client != null) {
                try {
                    log.info("Revoking tokens for user: {}", principalName);
                    tokenService.revokeToken(client);
                } catch (Exception e) {
                    log.warn("Token revocation failed", e);
                } finally {
                    authorizedClientService.removeAuthorizedClient(
                            registrationId, principalName);
                }
            }
        }

        oidcLogoutSuccessHandler.onLogoutSuccess(request, response, authentication);
    }

}