package com.staff_portal.backend_for_frontend.service;

import com.staff_portal.backend_for_frontend.config.OAuth2EndpointsConfig;
import com.staff_portal.backend_for_frontend.dto.TokenIntrospectionResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class TokenService {

    private final OAuth2AuthorizedClientManager authorizedClientManager;
    private final RestClient plainRestClient;
    private final OAuth2EndpointsConfig endpointsConfig;
    private final OAuth2AuthorizedClientRepository authorizedClientRepository;

    public TokenService(OAuth2AuthorizedClientManager authorizedClientManager, @Qualifier("plainRestClient") RestClient plainRestClient, OAuth2EndpointsConfig endpointsConfig, OAuth2AuthorizedClientRepository authorizedClientRepository) {
        this.authorizedClientManager = authorizedClientManager;
        this.plainRestClient = plainRestClient;
        this.endpointsConfig = endpointsConfig;
        this.authorizedClientRepository = authorizedClientRepository;
    }

    public OAuth2AuthorizedClient getValidAuthorizedClient(String registrationId, Authentication authentication, HttpServletRequest request) {

        OAuth2AuthorizedClient oauth2AuthorizedClientFromRedis = authorizedClientRepository.loadAuthorizedClient(registrationId, authentication, request);
        log.debug("oauth2AuthorizedClientFromRedis: {}", oauth2AuthorizedClientFromRedis);

        if (oauth2AuthorizedClientFromRedis == null) {
            return authorizeNewClient(registrationId, authentication);
        }

        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
                .withAuthorizedClient(oauth2AuthorizedClientFromRedis)
                .principal(authentication)
                .build();
        return authorizedClientManager.authorize(authorizeRequest);
    }

    private OAuth2AuthorizedClient authorizeNewClient(String registrationId, Authentication authentication) {
        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
                .withClientRegistrationId(registrationId)
                .principal(authentication)
                .build();
        return authorizedClientManager.authorize(authorizeRequest);
    }

    public boolean revokeToken(OAuth2AuthorizedClient client) {
        try {
            OAuth2AccessToken accessToken = client.getAccessToken();
            OAuth2RefreshToken refreshToken = client.getRefreshToken();
            if (refreshToken != null) {
                revokeTokenAtServer(refreshToken.getTokenValue(), "refresh_token");
            }
            if (accessToken != null) {
                revokeTokenAtServer(accessToken.getTokenValue(), "access_token");
            }
            return true;
        } catch (Exception e) {
            log.error("Error revoking tokens", e);
            return false;
        }
    }

    public boolean introspectToken(String token) {
        try {
            TokenIntrospectionResponse response = plainRestClient.post()
                    .uri(endpointsConfig.getIntrospectUri())
                    .header(HttpHeaders.AUTHORIZATION, getClientAuthorizationHeader())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(token)
                    .retrieve()
                    .body(TokenIntrospectionResponse.class);
            return response != null && response.isActive();
        } catch (Exception e) {
            log.error("Error introspecting token", e);
            return false;
        }
    }

    private void revokeTokenAtServer(String token, String tokenTypeHint) {
        try {
            plainRestClient.post()
                    .uri(endpointsConfig.getRevokeUri())
                    .header(HttpHeaders.AUTHORIZATION, getClientAuthorizationHeader())
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(MultiValueMap.fromMultiValue(Map.of("token", List.of(token), "token_type_hint", List.of(tokenTypeHint))))
                    .retrieve()
                    .toBodilessEntity();
            log.debug("Successfully revoked {} token", tokenTypeHint);
        } catch (Exception e) {
            log.warn("Failed to revoke {} token: {}", tokenTypeHint, e.getMessage());
        }
    }

    private String getClientAuthorizationHeader() {
        String clientId = "staff-portal-client";
        String clientSecret = "staff-portal-secret";
        String credentials = clientId + ":" + clientSecret;
        return "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes());
    }
}