package com.staff_portal.backend_for_frontend.repository;

import com.staff_portal.backend_for_frontend.util.RedisKeyUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Duration;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomOidcUserService implements OAuth2UserService<OidcUserRequest, OidcUser> {
    @Lazy
    private final RestClient restClient;
    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisKeyUtil redisKeyUtil;
    private static final int USER_DATA_TTL = 3600;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        log.debug("Loading OIDC user with scopes: {}", userRequest.getClientRegistration().getScopes());
        try {
            OidcIdToken idToken = userRequest.getIdToken();
            Map<String, Object> userAttributes = new HashMap<>(idToken.getClaims());
            Set<String> scopes = userRequest.getClientRegistration().getScopes();
            OidcUserInfo userInfo = null;
            if (scopes.contains("profile")) {
                userInfo = fetchUserInfo(userRequest.getAccessToken());
                if (userInfo != null) {
                    userAttributes.putAll(userInfo.getClaims());
                    log.debug("Enhanced user attributes with profile information");
                }
            }
            String sessionId = extractSessionId();
            if (sessionId != null) {
                cachedUserData(sessionId, userAttributes);
            }
            Set<GrantedAuthority> authorities = extractAuthorities(userAttributes);
            String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
            if (userNameAttributeName == null) {
                userNameAttributeName = "sub";
            }
            return new DefaultOidcUser(authorities, idToken, userInfo, userNameAttributeName);
        } catch (Exception e) {
            log.error("Error loading OIDC user", e);
            throw new OAuth2AuthenticationException(new OAuth2Error("user_info_error", "Failed to load user information", null));
        }
    }

    private OidcUserInfo fetchUserInfo(OAuth2AccessToken accessToken) {
        try {
            String userInfoUri = determineUserInfoUri();
            ResponseEntity<Map<String, Object>> response = restClient.get()
                    .uri(userInfoUri)
                    .headers(header -> header.setBearerAuth(accessToken.getTokenValue()))
                    .retrieve()
                    .toEntity(new ParameterizedTypeReference<>() {
                    });
            Map<String, Object> userInfo = response.getBody();
            log.debug("Successfully fetched OIDC user information from Authorization Server");
            return userInfo != null ? new OidcUserInfo(userInfo) : new OidcUserInfo(Map.of());
        } catch (Exception e) {
            log.error("Failed to fetch user info from Authorization Server", e);
            return new OidcUserInfo(Map.of());
        }
    }

    private Set<GrantedAuthority> extractAuthorities(Map<String, Object> userAttributes) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        Object rolesClaim = userAttributes.get("roles");
        if (rolesClaim instanceof Collection) {
            Collection<String> roles = (Collection<String>) rolesClaim;
            roles.forEach(role -> authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())));
        } else if (rolesClaim instanceof String) {
            String role = (String) rolesClaim;
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
        }
        Object scopesClaim = userAttributes.get("scopes");
        if (scopesClaim instanceof String) {
            String[] scopes = ((String) scopesClaim).split(" ");
            Arrays.stream(scopes).forEach(scope -> authorities.add(new SimpleGrantedAuthority(scope)));
        }
        if (authorities.isEmpty()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        }
        log.debug("Extracted authorities: {}", authorities);
        return authorities;
    }

    public void cachedUserData(String sessionId, Map<String, Object> userAttributes) {
        try {
            String key = redisKeyUtil.buildStateKey(sessionId, "userdata");
            Map<String, Object> cacheData = new HashMap<>();
            cacheData.put("profile", userAttributes);
            cacheData.put("cachedAt", Instant.now().toString());
            redisTemplate.opsForValue().set(key, cacheData, Duration.ofSeconds(USER_DATA_TTL));
            log.debug("Cached user data for session: {}", sessionId);
        } catch (Exception e) {
            log.error("Failed to cache user data", e);
        }
    }

    private String extractSessionId() {
        try {
            RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
            HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
            HttpSession session = request.getSession(false);
            return session != null ? session.getId() : null;
        } catch (Exception e) {
            log.debug("Could not extract session ID during user loading");
            return null;
        }
    }

    private String determineUserInfoUri() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof OAuth2AuthenticationToken oAuth2AuthenticationToken) {
            return oAuth2AuthenticationToken.getPrincipal().getAttribute("userinfo_endpoint");
        }
        return "http://localhost:8001/connect/v1/userinfo";
    }

    public Map<String, Object> getCachedUserData(String sessionId) {
        try {
            String key = redisKeyUtil.buildStateKey(sessionId, "userdata");
            Object cached = redisTemplate.opsForValue().get(key);
            if (cached instanceof Map) {
                return (Map<String, Object>) cached;
            }
        } catch (Exception e) {
            log.error("Failed to retrieve cached user data", e);
        }
        return new HashMap<>();
    }
}
