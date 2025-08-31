package com.staff_portal.backend_for_frontend.service;

import com.staff_portal.backend_for_frontend.config.OAuth2EndpointsConfig;
import com.staff_portal.backend_for_frontend.dto.TokenIntrospectionResponse;
import com.staff_portal.backend_for_frontend.util.RedisKeyUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizationContext;
import org.springframework.security.oauth2.client.OAuth2AuthorizeRequest;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class TokenService {

    private final OAuth2AuthorizedClientManager authorizedClientManager;
    private final RestClient plainRestClient;
    private final OAuth2EndpointsConfig endpointsConfig;
    private final RedisKeyUtil redisKeyUtil;
    private final RedisTemplate<String, OAuth2AuthorizedClient> redisTemplate;
    private final OAuth2AuthorizedClientRepository  authorizedClientRepository;

    public OAuth2AuthorizedClient getValidAuthorizedClient(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
         if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        String registrationId = oauthToken.getAuthorizedClientRegistrationId();
        String key = redisKeyUtil.buildAuthorizedClientServiceKey(registrationId, oauthToken.getName());
        OAuth2AuthorizedClient oauth2AuthorizedClientFromRedis = redisTemplate.opsForValue().get(key);

        if(oauth2AuthorizedClientFromRedis == null){
            return authorizeNewClient(registrationId, authentication);
        }
        if(!isAccessTokenValid(oauth2AuthorizedClientFromRedis.getAccessToken())){
            return refreshTokenProactively(oauth2AuthorizedClientFromRedis, authentication, request, response);
        }
        return oauth2AuthorizedClientFromRedis;
    }
    private OAuth2AuthorizedClient authorizeNewClient(String registrationId, Authentication authentication) {
        OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
                .withClientRegistrationId(registrationId)
                .principal(authentication)
                .build();
        return authorizedClientManager.authorize(authorizeRequest);
    }

    private OAuth2AuthorizedClient refreshTokenProactively(OAuth2AuthorizedClient client, Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        Set<String> scopes = client.getClientRegistration().getScopes();
        String[] scopesArray = scopes.toArray(new String[0]);

        try {
            OAuth2AuthorizeRequest authorizeRequest = OAuth2AuthorizeRequest
                    .withAuthorizedClient(client)
                    .principal(authentication)
                    .attributes(attrs -> {
                        attrs.put(OAuth2AuthorizationContext.REQUEST_SCOPE_ATTRIBUTE_NAME, scopesArray);
                    })
                    .build();
            OAuth2AuthorizedClient refreshedClient = authorizedClientManager.authorize(authorizeRequest);
            if (refreshedClient != null) {
                log.debug("Successfully refreshed access token proactively");
                // update the redis
                authorizedClientRepository.saveAuthorizedClient(refreshedClient, authentication, request, response);
                return refreshedClient;
            }
            return client;
        } catch (Exception e) {
            log.warn("Failed to refresh token proactively, using existing token: {}", e.getMessage());
            return client;
        }
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
    private boolean isAccessTokenValid(OAuth2AccessToken accessToken) {
        return accessToken != null &&
               (accessToken.getExpiresAt() == null ||
                accessToken.getExpiresAt().isAfter(Instant.now().plusSeconds(30)));
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