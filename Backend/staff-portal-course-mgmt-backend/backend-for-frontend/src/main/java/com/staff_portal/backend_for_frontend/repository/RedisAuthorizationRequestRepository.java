package com.staff_portal.backend_for_frontend.repository;

import com.staff_portal.backend_for_frontend.util.RedisKeyUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;

import java.time.Duration;

//@Component
@RequiredArgsConstructor
@Slf4j
public class RedisAuthorizationRequestRepository implements AuthorizationRequestRepository<OAuth2AuthorizationRequest> {
    private final RedisTemplate<String, OAuth2AuthorizationRequest> redisTemplate;
    private final RedisKeyUtil redisKeyUtil;
    private static final int REQUEST_TTL = 3600;
    @Override
    public OAuth2AuthorizationRequest loadAuthorizationRequest(HttpServletRequest request) {
        String state = getStateParameter(request);
        if (state == null) {
            return null;
        }
        String key = redisKeyUtil.buildAuthRequestKey(state);
        try {
            Object stored = redisTemplate.opsForValue().get(key);
            if (stored instanceof OAuth2AuthorizationRequest) {
                log.debug("Loaded authorization request from Redis for state: {}", state);
                return (OAuth2AuthorizationRequest) stored;
            }
        } catch (Exception e) {
            log.error("Error loading authorization request from Redis", e);
        }
        return null;
    }
    @Override
    public void saveAuthorizationRequest(OAuth2AuthorizationRequest authorizationRequest,
                                         HttpServletRequest request, HttpServletResponse response) {
        String state = authorizationRequest.getState();
        String key = redisKeyUtil.buildAuthRequestKey(state);
        try {
            redisTemplate.opsForValue().set(key, authorizationRequest, Duration.ofSeconds(REQUEST_TTL));
            log.debug("Saved authorization request to Redis for state: {}", state);
        } catch (Exception e) {
            log.error("Error saving authorization request to Redis", e);
        }
    }
    @Override
    public OAuth2AuthorizationRequest removeAuthorizationRequest(HttpServletRequest request,
            HttpServletResponse response) {
        String state = getStateParameter(request);
        if (state == null) {
            return null;
        }
        String key = redisKeyUtil.buildAuthRequestKey(state);
        try {
            Object stored = redisTemplate.opsForValue().get(key);
            redisTemplate.delete(key);
            if (stored instanceof OAuth2AuthorizationRequest) {
                log.debug("Removed authorization request from Redis for state: {}", state);
                return (OAuth2AuthorizationRequest) stored;
            }
        } catch (Exception e) {
            log.error("Error removing authorization request from Redis", e);
        }
        return null;
    }
    private String getStateParameter(HttpServletRequest request) {
        return request.getParameter(OAuth2ParameterNames.STATE);
    }
}