package com.staff_portal.backend_for_frontend.repository;

import com.staff_portal.backend_for_frontend.util.RedisKeyUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.core.OAuth2RefreshToken;
import org.springframework.util.Assert;

import java.time.Duration;
import java.time.Instant;

@Slf4j
//@Component
public record RedisOAuth2AuthorizedClientService(RedisTemplate<String, OAuth2AuthorizedClient> redisTemplate,
                                                 RedisKeyUtil redisKeyUtil) implements OAuth2AuthorizedClientService {
    private static final int DEFAULT_CLIENT_TTL = 3600;

    @Override
    public <T extends OAuth2AuthorizedClient> T loadAuthorizedClient(String clientRegistrationId, String principalName) {
        Assert.hasText(clientRegistrationId, "clientRegistrationId must not be empty");
        Assert.hasText(principalName, "PrincipalName must not be empty");

        String key = redisKeyUtil.buildAuthorizedClientServiceKey(clientRegistrationId, principalName);
        try {
            Object stored = redisTemplate.opsForValue().get(key);
            if (stored instanceof OAuth2AuthorizedClient cachedClient) {
                if (isRefreshTokenExpired(cachedClient.getRefreshToken())) {
                    log.debug("Refresh token expired for client: {} and principal: {}", clientRegistrationId, principalName);
                    removeAuthorizedClient(clientRegistrationId, principalName);
                    return null;
                }
                log.debug("Loaded authorized client from Redis service for client: {} and principal: {}", clientRegistrationId, principalName);
                return (T) cachedClient;
            }
        } catch (Exception e) {
            log.error("Error loading authorized client from Redis service", e);
        }
        return null;
    }

    @Override
    public void saveAuthorizedClient(OAuth2AuthorizedClient authorizedClient, Authentication principal) {
        Assert.notNull(authorizedClient, "authorizedClient cannot not be null");
        Assert.notNull(principal, "principal cannot not be null");
        String clientRegistrationId = authorizedClient.getClientRegistration().getRegistrationId();
        String principalName = principal.getName();
        String key = redisKeyUtil.buildAuthorizedClientServiceKey(clientRegistrationId, principalName);
        try {
            int ttl = calculateClientTtl(authorizedClient);
            redisTemplate.opsForValue().set(key, authorizedClient, Duration.ofSeconds(ttl));
            log.debug("Saved authorized client to Redis service for client: {} and principal: {}", clientRegistrationId, principalName);
        } catch (Exception e) {
            log.error("Error saving authorized client to Redis service", e);
        }
    }

    @Override
    public void removeAuthorizedClient(String clientRegistrationId, String principalName) {
        Assert.hasText(clientRegistrationId, "clientRegistrationId cannot not be empty");
        Assert.hasText(principalName, "PrincipalName cannot not be empty");
        String key = redisKeyUtil.buildAuthorizedClientServiceKey(clientRegistrationId, principalName);
        try {
            if (key != null) redisTemplate.delete(key);
            log.debug("Removed authorized client from Redis service for client: {} and principal: {}", clientRegistrationId, principalName);
        } catch (Exception e) {
            log.error("Error removing authorized client from Redis service", e);
        }
    }

    private boolean isRefreshTokenExpired(OAuth2RefreshToken refreshToken) {
        if (refreshToken == null) return false;
        if (refreshToken.getExpiresAt() == null) return false;
        return refreshToken.getExpiresAt().isBefore(Instant.now().plusSeconds(60));
    }

    private int calculateClientTtl(OAuth2AuthorizedClient authorizedClient) {
        OAuth2RefreshToken refreshToken = authorizedClient.getRefreshToken();
        if (refreshToken != null && refreshToken.getExpiresAt() != null) {
            long ttl = Duration.between(Instant.now(), refreshToken.getExpiresAt()).getSeconds();
            return Math.max((int) ttl, DEFAULT_CLIENT_TTL);
        }
        return DEFAULT_CLIENT_TTL;
    }
}
