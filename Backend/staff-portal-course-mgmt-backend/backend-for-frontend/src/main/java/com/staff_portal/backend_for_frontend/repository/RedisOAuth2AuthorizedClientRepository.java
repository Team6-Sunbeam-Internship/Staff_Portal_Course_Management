//package com.staff_portal.backend_for_frontend.repository;
//
//import com.staff_portal.backend_for_frontend.util.CookieUtil;
//import com.staff_portal.backend_for_frontend.util.RedisKeyUtil;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import jakarta.servlet.http.HttpSession;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.http.ResponseCookie;
//import org.springframework.security.authentication.AuthenticationTrustResolver;
//import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
//import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
//import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
//import org.springframework.security.oauth2.core.OAuth2RefreshToken;
//
//import java.time.Duration;
//import java.time.Instant;
//import java.util.UUID;
//
//
//@Slf4j
//public class RedisOAuth2AuthorizedClientRepository implements OAuth2AuthorizedClientRepository {
//
//    private static final AuthenticationTrustResolver AUTHENTICATION_TRUST_RESOLVER = new AuthenticationTrustResolverImpl();
//    private static final int DEFAULT_SESSION_TTL = 3600;
//    private static final int REFRESH_TOKEN_BUFFER_SECONDS = 60;
//
//    private final OAuth2AuthorizedClientService redisOAuth2AuthorizedClientService;
//    private final RedisTemplate<String, OAuth2AuthorizedClient> redisTemplate;
//    private final RedisKeyUtil redisKeyUtil;
//    private final CookieUtil cookieUtil;
//
//    public RedisOAuth2AuthorizedClientRepository(OAuth2AuthorizedClientService redisOAuth2AuthorizedClientService, RedisTemplate<String, OAuth2AuthorizedClient> redisTemplate, RedisKeyUtil redisKeyUtil, CookieUtil cookieUtil) {
//        this.redisOAuth2AuthorizedClientService = redisOAuth2AuthorizedClientService;
//        this.redisTemplate = redisTemplate;
//        this.redisKeyUtil = redisKeyUtil;
//        this.cookieUtil = cookieUtil;
//    }
//
//
//    @Override
//    public <T extends OAuth2AuthorizedClient> T loadAuthorizedClient(String clientRegistrationId,
//                                                                     Authentication principal, HttpServletRequest request) {
//        log.debug("Loading authorized client for client: {}", clientRegistrationId);
//        log.debug("Principal: {}", principal);
//        log.debug("isPrincipalAuthenticated: {}", isPrincipalAuthenticated(principal));
//        log.debug("loadFromService: {}", loadFromService(clientRegistrationId, principal));
//        log.debug("loadFromSession: {}", loadFromSession(clientRegistrationId, request));
//        return isPrincipalAuthenticated(principal)
//                ? loadFromService(clientRegistrationId, principal)
//                : loadFromSession(clientRegistrationId, request);
//    }
//
//    @Override
//    public void saveAuthorizedClient(OAuth2AuthorizedClient authorizedClient, Authentication principal,
//                                     HttpServletRequest request, HttpServletResponse response) {
//        if (isPrincipalAuthenticated(principal)) {
//            saveToService(authorizedClient, principal);
//        } else {
//            saveToSession(authorizedClient, request, response);
//        }
//    }
//
//    @Override
//    public void removeAuthorizedClient(String clientRegistrationId, Authentication principal,
//                                       HttpServletRequest request, HttpServletResponse response) {
//        if (isPrincipalAuthenticated(principal)) {
//            removeFromService(clientRegistrationId, principal);
//        } else {
//            removeFromSession(clientRegistrationId, request, response);
//        }
//    }
//
//    private <T extends OAuth2AuthorizedClient> T  loadFromService(String clientRegistrationId, Authentication principal) {
//        log.debug("Loading authorized client via service for principal: {}", principal.getName());
//        return redisOAuth2AuthorizedClientService.loadAuthorizedClient(clientRegistrationId, principal.getName());
//    }
//
//    private <T extends OAuth2AuthorizedClient> T loadFromSession(String clientRegistrationId, HttpServletRequest request) {
//        String sessionId = getBffSessionId(request);
//        if (sessionId == null) {
//            log.debug("No session ID found for authorized client lookup");
//            return null;
//        }
//
//        String key = redisKeyUtil.buildAuthorizedClientKey(sessionId, clientRegistrationId);
//        try {
//            Object stored = redisTemplate.opsForValue().get(key);
//            if (stored instanceof OAuth2AuthorizedClient client) {
//                if (isTokenValid(client)) {
//                    log.debug("Loaded authorized client from session: {}", clientRegistrationId);
//                    return (T) client;
//                } else {
//                    log.debug("Token expired, removing authorized client: {}", clientRegistrationId);
//                    redisTemplate.delete(key);
//                    return null;
//                }
//            }
//        } catch (Exception e) {
//            log.error("Error loading authorized client from session for client: {}", clientRegistrationId, e);
//        }
//        return null;
//    }
//
//    private void saveToService(OAuth2AuthorizedClient authorizedClient, Authentication principal) {
//        log.debug("Saving authorized client via service for principal: {}", principal.getName());
//        redisOAuth2AuthorizedClientService.saveAuthorizedClient(authorizedClient, principal);
//    }
//
//    private void saveToSession(OAuth2AuthorizedClient authorizedClient, HttpServletRequest request, HttpServletResponse response) {
//        String sessionId = getOrCreateBffSessionId(request, response);
//        String key = redisKeyUtil.buildAuthorizedClientKey(sessionId,
//                authorizedClient.getClientRegistration().getRegistrationId());
//
//        try {
//            int ttl = calculateOptimalTtl(authorizedClient);
//            redisTemplate.opsForValue().set(key, authorizedClient, Duration.ofSeconds(ttl));
//            updateBffSessionCookie(response, sessionId, ttl);
//            log.debug("Saved authorized client to session with TTL: {} seconds", ttl);
//        } catch (Exception e) {
//            log.error("Error saving authorized client to session", e);
//        }
//    }
//
//    private void removeFromService(String clientRegistrationId, Authentication principal) {
//        log.debug("Removing authorized client via service for principal: {}", principal.getName());
//        redisOAuth2AuthorizedClientService.removeAuthorizedClient(clientRegistrationId, principal.getName());
//    }
//
//    private void removeFromSession(String clientRegistrationId, HttpServletRequest request, HttpServletResponse response) {
//        String sessionId = getBffSessionId(request);
//        if (sessionId == null) {
//            return;
//        }
//
//        String key = redisKeyUtil.buildAuthorizedClientKey(sessionId, clientRegistrationId);
//        try {
//            redisTemplate.delete(key);
//            if (response != null) {
//                clearAllSessionCookies(response);
//            }
//            log.debug("Removed authorized client from session: {}", clientRegistrationId);
//        } catch (Exception e) {
//            log.error("Error removing authorized client from session", e);
//        }
//    }
//
//    private String getOrCreateBffSessionId(HttpServletRequest request, HttpServletResponse response) {
//        String sessionId = getBffSessionId(request);
//        if (sessionId == null) {
//            sessionId = UUID.randomUUID().toString();
//            log.debug("Created new BFF session ID: {}", sessionId);
//        }
//        return sessionId;
//    }
//
//    private String getBffSessionId(HttpServletRequest request) {
//        // Prioritize BFF session cookie for consistency
//        String bffSessionId = cookieUtil.getBffSessionId(request);
//        if (bffSessionId != null) {
//            return bffSessionId;
//        }
//
//        // Fallback to Spring session if available
//        HttpSession session = request.getSession(false);
//        return session != null ? session.getId() : null;
//    }
//
//    private void updateBffSessionCookie(HttpServletResponse response, String sessionId, int maxAge) {
//        ResponseCookie bffSessionCookie = cookieUtil.createSecureBffSessionCookie(sessionId, maxAge);
//        response.addHeader("Set-Cookie", bffSessionCookie.toString());
//    }
//
//    private void clearAllSessionCookies(HttpServletResponse response) {
//        cookieUtil.clearBffSessionCookie(response);
//        cookieUtil.clearCookie(response, "JSESSIONID");
//    }
//
//    private boolean isTokenValid(OAuth2AuthorizedClient client) {
//        OAuth2RefreshToken refreshToken = client.getRefreshToken();
//        if (refreshToken == null || refreshToken.getExpiresAt() == null) {
//            return true; // Assume valid if no expiration information
//        }
//        return refreshToken.getExpiresAt().isAfter(Instant.now().plusSeconds(REFRESH_TOKEN_BUFFER_SECONDS));
//    }
//
//    private int calculateOptimalTtl(OAuth2AuthorizedClient client) {
//        OAuth2RefreshToken refreshToken = client.getRefreshToken();
//        if (refreshToken != null && refreshToken.getExpiresAt() != null) {
//            long ttl = Duration.between(Instant.now(), refreshToken.getExpiresAt()).getSeconds();
//            return Math.max((int) ttl, DEFAULT_SESSION_TTL);
//        }
//        return DEFAULT_SESSION_TTL;
//    }
//
//    private boolean isPrincipalAuthenticated(Authentication authentication) {
//        return AUTHENTICATION_TRUST_RESOLVER.isAuthenticated(authentication);
//    }
//}