package com.staff_portal.backend_for_frontend.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.staff_portal.backend_for_frontend.util.RedisKeyUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
@Slf4j
public class StatePreservationService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisKeyUtil redisKeyUtil;
    private final ObjectMapper objectMapper;
    private static final int STATE_TTL = 600;
    private static final String ORIGINAL_REQUEST_KEY = "originalRequest";
    private static final String PRESERVATION_CONTEXT_KEY = "preservationContext";

    public StatePreservationService(RedisTemplate<String, Object> redisTemplate, RedisKeyUtil redisKeyUtil, @Qualifier("defaultObjectMapper") ObjectMapper objectMapper) {
        this.redisTemplate = redisTemplate;
        this.redisKeyUtil = redisKeyUtil;
        this.objectMapper = objectMapper;
    }

    public void saveOriginalRequest(HttpServletRequest request, String redirectTo) {
        String sessionId = getOrCreateSessionId(request);
        try {
            if (isValidRedirectUrl(redirectTo)) {
                String key = redisKeyUtil.buildStateKey(sessionId, ORIGINAL_REQUEST_KEY);
                redisTemplate.opsForValue().set(key, redirectTo, Duration.ofSeconds(STATE_TTL));
                log.debug("Saved original request URL for session {}: {}", sessionId, redirectTo);
            }
        } catch (Exception e) {
            log.error("Error saving original request", e);
        }
    }

    public String getOriginalRequestUrl(HttpServletRequest request) {
        String sessionId = getSessionId(request);
        if (sessionId == null) return null;
        try {
            String key = redisKeyUtil.buildStateKey(sessionId, ORIGINAL_REQUEST_KEY);
            Object stored = redisTemplate.opsForValue().get(key);
            return stored instanceof String ? (String) stored : null;
        } catch (Exception e) {
            log.error("Error retrieving original request", e);
            return null;
        }
    }

    public void clearOriginalRequest(HttpServletRequest request) {
        String sessionId = getSessionId(request);
        if (sessionId == null) return;
        try {
            String originalKey = redisKeyUtil.buildStateKey(sessionId, ORIGINAL_REQUEST_KEY);
            String contextKey = redisKeyUtil.buildStateKey(sessionId, PRESERVATION_CONTEXT_KEY);
            redisTemplate.delete(originalKey);
            redisTemplate.delete(contextKey);
            log.debug("Cleared original request state for session: {}", sessionId);
        } catch (Exception e) {
            log.error("Error clearing original request", e);
        }
    }

    public String preserve(String sessionId, String redirectTo, HttpServletRequest request, String body) {
        String contextId = UUID.randomUUID().toString();
        Map<String, Object> payload = new HashMap<>();
        payload.put("redirectTo", redirectTo);
        payload.put("method", request.getMethod());
        payload.put("path", request.getRequestURI());
        payload.put("queryParams", request.getQueryString());
        payload.put("createdAt", Instant.now().toString());
        if (body != null) {
            payload.put("body", body);
        }
        String contextKey = redisKeyUtil.buildStateKey(sessionId, PRESERVATION_CONTEXT_KEY);
        try {
            redisTemplate.opsForValue().set(contextKey, objectMapper.writeValueAsString(payload), Duration.ofSeconds(STATE_TTL));
            saveOriginalRequest(getCurrentRequest(sessionId), redirectTo);
            log.debug("Preserved request context {} for session: {}", contextId, sessionId);
            return contextId;
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize preservation context", e);
            return null;
        }
    }

    public Optional<Map<String, Object>> restore(String sessionId, String contextId) {
        String contextKey = redisKeyUtil.buildStateKey(sessionId, PRESERVATION_CONTEXT_KEY);
        try {
            String json = (String) redisTemplate.opsForValue().get(contextKey);
            if (json == null) {
                return Optional.empty();
            }
            Map<String, Object> context = objectMapper.readValue(json, new TypeReference<Map<String, Object>>(){});
            redisTemplate.delete(contextKey);
            log.debug("Restored and cleared preservation context {} for session: {}", contextId, sessionId);
            return Optional.of(context);
        } catch (IOException e) {
            log.error("Failed to deserialize preservation context", e);
            return Optional.empty();
        }
    }

    public String getPreservationContext(HttpServletRequest request) {
        String sessionId = getSessionId(request);
        if (sessionId == null) return null;
        try {
            String contextKey = redisKeyUtil.buildStateKey(sessionId, PRESERVATION_CONTEXT_KEY);
            Object stored = redisTemplate.opsForValue().get(contextKey);
            if (stored instanceof String) {
                Map<String, Object> context = objectMapper.readValue((String) stored, new TypeReference<Map<String, Object>>(){});
                return UUID.randomUUID().toString();
            }
        } catch (Exception e) {
            log.debug("No preservation context found for session: {}", sessionId);
        }
        return null;
    }

    private boolean isValidRedirectUrl(String url) {
        if (url == null || url.trim().isEmpty()) return false;
        try {
            if (url.startsWith("/")) {
                return true;
            }
            URI uri = new URI(url);
            return !uri.isAbsolute() || "localhost".equals(uri.getHost());
        } catch (URISyntaxException e) {
            log.warn("Invalid redirect URL: {}", url);
            return false;
        }
    }

    private String getSessionId(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        return session != null ? session.getId() : null;
    }

    private String getOrCreateSessionId(HttpServletRequest request) {
        HttpSession session = request.getSession(true);
        return session.getId();
    }

    private HttpServletRequest getCurrentRequest(String sessionId) {
        RequestAttributes attrs = RequestContextHolder.currentRequestAttributes();
        return ((ServletRequestAttributes) attrs).getRequest();
    }
}