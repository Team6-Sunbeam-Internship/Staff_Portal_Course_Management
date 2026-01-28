package com.staff_portal.backend_for_frontend.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class OAuth2AuthorizationSuccessHandler implements org.springframework.security.oauth2.client.OAuth2AuthorizationSuccessHandler {
    private final OAuth2AuthorizedClientService oAuth2AuthorizedClientService;

    public OAuth2AuthorizationSuccessHandler(OAuth2AuthorizedClientService oAuth2AuthorizedClientService) {
        this.oAuth2AuthorizedClientService = oAuth2AuthorizedClientService;
    }

    @Override
    public void onAuthorizationSuccess(OAuth2AuthorizedClient authorizedClient,
                                       Authentication principal, Map<String, Object> attributes) {
        log.debug("Authorization successful for client: {}",
                authorizedClient.getClientRegistration().getRegistrationId());
        // update the Re-AuthorizedClient in the Redis
        oAuth2AuthorizedClientService.saveAuthorizedClient(authorizedClient, principal);
        log.debug("Access token expires at: {}",
                authorizedClient.getAccessToken().getExpiresAt());
    }
}