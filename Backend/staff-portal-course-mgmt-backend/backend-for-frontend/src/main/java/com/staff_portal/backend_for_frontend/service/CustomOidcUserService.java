package com.staff_portal.backend_for_frontend.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUserAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@Service
@Slf4j
public class CustomOidcUserService implements ICustomOidcUserService {
    //    @Lazy
//    private final RedisTemplate<String, Object> redisTemplate;
//    private final RedisKeyUtil redisKeyUtil;
    private static final int USER_DATA_TTL = 3600;
    private final RestClient plainRestClient;
    private static final String INVALID_USER_INFO_RESPONSE_ERROR_CODE = "invalid_user_info_response";

    public CustomOidcUserService(@Qualifier("plainRestClient") RestClient plainRestClient) {
//        this.redisTemplate = redisTemplate;
//        this.redisKeyUtil = redisKeyUtil;
        this.plainRestClient = plainRestClient;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        try {
            OidcUserInfo userInfo = null;
            OAuth2AccessToken accessToken = userRequest.getAccessToken();
            OidcIdToken idToken = userRequest.getIdToken();
            ClientRegistration clientRegistration = userRequest.getClientRegistration();
            Set<String> scopesInClientRegistration = clientRegistration.getScopes();
            Set<String> scopesInAccessToken = accessToken.getScopes();

            if (scopesInClientRegistration.contains(OidcScopes.PROFILE) && scopesInAccessToken.contains(OidcScopes.PROFILE)) {
                // Fetch User Info
                userInfo = fetchUserInfo(accessToken);
                if (userInfo.getSubject() == null) {
                    OAuth2Error oauth2Error = new OAuth2Error(INVALID_USER_INFO_RESPONSE_ERROR_CODE);
                    throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
                }
                if (!userInfo.getSubject().equals(userRequest.getIdToken().getSubject())) {
                    OAuth2Error oauth2Error = new OAuth2Error(INVALID_USER_INFO_RESPONSE_ERROR_CODE);
                    throw new OAuth2AuthenticationException(oauth2Error, oauth2Error.toString());
                }
            }
            Set<GrantedAuthority> authorities = new LinkedHashSet<>();
            ClientRegistration.ProviderDetails providerDetails = userRequest.getClientRegistration().getProviderDetails();
            String userNameAttributeName = providerDetails.getUserInfoEndpoint().getUserNameAttributeName();
            if (StringUtils.hasText(userNameAttributeName)) {
                authorities.add(new OidcUserAuthority(idToken, userInfo, userNameAttributeName));
            } else {
                authorities.add(new OidcUserAuthority(idToken, userInfo));
            }
            for (String scope : scopesInAccessToken) {
                authorities.add(new SimpleGrantedAuthority("SCOPE_" + scope));
            }

            if (StringUtils.hasText(userNameAttributeName)) {
                return new DefaultOidcUser(authorities, idToken, userInfo, userNameAttributeName);
            }
            return new DefaultOidcUser(authorities, idToken, userInfo);
        } catch (Exception e) {
            log.error("Error loading OIDC user", e);
            throw new OAuth2AuthenticationException(new OAuth2Error("user_info_error", "Failed to load user information", null));
        }
    }

//    @Override
//    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
//        log.debug("Loading OIDC user with scopes: {}", userRequest.getClientRegistration().getScopes());
//        try {
//            OidcIdToken idToken = userRequest.getIdToken();
//            Map<String, Object> userAttributes = new HashMap<>(idToken.getClaims());
//            Set<String> scopes = userRequest.getClientRegistration().getScopes();
//            OidcUserInfo userInfo = null;
//            if (scopes.contains("profile")) {
//                userInfo = fetchUserInfo(userRequest.getAccessToken());
//                if (userInfo != null) {
//                    userAttributes.putAll(userInfo.getClaims());
//                    log.debug("Enhanced user attributes with profile information");
//                }
//            }
//            String sessionId = extractSessionId();
//            if (sessionId != null) {
//                cachedUserData(sessionId, userAttributes);
//            }
//            Set<GrantedAuthority> authorities = extractAuthorities(userAttributes);
//            String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName();
//            if (userNameAttributeName == null) {
//                userNameAttributeName = "sub";
//            }
//            return new DefaultOidcUser(authorities, idToken, userInfo, userNameAttributeName);
//        } catch (Exception e) {
//            log.error("Error loading OIDC user", e);
//            throw new OAuth2AuthenticationException(new OAuth2Error("user_info_error", "Failed to load user information", null));
//        }
//    }

    private OidcUserInfo fetchUserInfo(OAuth2AccessToken accessToken) {
        try {
            String userInfoUri = determineUserInfoUri();
            ResponseEntity<Map<String, Object>> response = plainRestClient.get()
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

//    @Override
//    public void cachedUserData(String sessionId, OidcUserInfo userInfo, List<String> roles) {
//        try {
//            String key = redisKeyUtil.buildStateKey(sessionId, "userdata");
//            Map<String, Object> cacheData = new HashMap<>(userInfo.getClaims());
//            cacheData.put("cachedAt", Instant.now().toString());
//            cacheData.put("role", roles.toArray()[0].toString());
//            redisTemplate.opsForValue().set(key, cacheData, Duration.ofSeconds(USER_DATA_TTL));
//            log.debug("Cached user data for session: {}", sessionId);
//        } catch (Exception e) {
//            log.error("Failed to cache user data", e);
//        }
//    }
//
//    private String extractSessionId() {
//        try {
//            RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();
//            HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
//            HttpSession session = request.getSession(false);
//            return session != null ? session.getId() : null;
//        } catch (Exception e) {
//            log.debug("Could not extract session ID during user loading");
//            return null;
//        }
//    }

    private String determineUserInfoUri() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication instanceof OAuth2AuthenticationToken oAuth2AuthenticationToken) {
//            log.debug("Hello {}",oAuth2AuthenticationToken.getPrincipal().getAttributes().toString());
//            return oAuth2AuthenticationToken.getPrincipal().getAttribute("userinfo_endpoint");
//        }
        return "http://auth-service:8000/connect/v1/userinfo";
    }

    //
//    @Override
//    public Map<String, Object> getCachedUserData(String sessionId) {
//        try {
//            String key = redisKeyUtil.buildStateKey(sessionId, "userdata");
//            Object cached = redisTemplate.opsForValue().get(key);
//            if (cached instanceof Map) {
//                return (Map<String, Object>) cached;
//            }
//        } catch (Exception e) {
//            log.error("Failed to retrieve cached user data", e);
//        }
//        return new HashMap<>();
//    }
    public Optional<OidcUser> extractOidcUser(Authentication authentication) {
        return Optional.ofNullable(authentication)
                .filter(OAuth2AuthenticationToken.class::isInstance)
                .map(OAuth2AuthenticationToken.class::cast)
                .map(OAuth2AuthenticationToken::getPrincipal)
                .filter(OidcUser.class::isInstance)
                .map(OidcUser.class::cast);
    }
}
