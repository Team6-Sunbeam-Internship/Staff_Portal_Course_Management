package com.staff_portal.backend_for_frontend.service;

import com.staff_portal.backend_for_frontend.dto.SessionResponse;
import com.staff_portal.backend_for_frontend.repository.IRedisClientRegistrationRepository;
import com.staff_portal.backend_for_frontend.util.CookieUtil;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Slf4j
@DependsOn({"clientRegistrationRepository"})
public class SessionService implements ISessionService {
    private final TokenService tokenService;
    private final ICustomOidcUserService customOidcUserService;
    private final CookieUtil cookieUtil;
    private final IRedisClientRegistrationRepository redisClientRegistrationRepository;

    public SessionService(TokenService tokenService, ICustomOidcUserService customOidcUserService, CookieUtil cookieUtil, IRedisClientRegistrationRepository redisClientRegistrationRepository) {
        this.tokenService = tokenService;
        this.customOidcUserService = customOidcUserService;
        this.cookieUtil = cookieUtil;
        this.redisClientRegistrationRepository = redisClientRegistrationRepository;
    }

    @PostConstruct
    public void init() {
        // Verify that the repository is properly initialized
        Set<String> registrationIds = redisClientRegistrationRepository.getRegistrationIds();
        log.info("Initialized SessionService with {} registration IDs: {}",
                registrationIds.size(), registrationIds);
    }

    public SessionResponse checkSession(OidcUser oidcUser, Authentication authentication) {
        return Optional.ofNullable(oidcUser)
                .map(user -> buildSessionResponse(user, authentication))
                .orElse(SessionResponse.unauthenticated());
    }

    private SessionResponse buildSessionResponse(OidcUser oidcUser, Authentication authentication) {
        OidcUserInfo userInfo = oidcUser.getUserInfo();
        Map<String, Object> claims = userInfo.getClaims();
        Object roleAttr = oidcUser.getAttributes().get("roles");
        String role = roleAttr instanceof Collection<?> roles && !roles.isEmpty() ? String.valueOf(roles.iterator().next()) : null;
//        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
//        authorities.stream().map()
        return SessionResponse.builder()
                .authenticated(Boolean.TRUE)
                .name((String) claims.get("name"))
                .email((String) claims.get("email"))
                .emailVerified(((Boolean) claims.get("email_verified")).toString())
                .role(role)
                .gender((String) claims.get("gender"))
                .phoneNumber((String) claims.get("phone_number"))
                .phoneNumberVerified(((Boolean) claims.get("phone_number_verified")).toString())
                .address((String) claims.get("address"))
                .staffId(UUID.fromString((String) claims.get("staff_id")))
                .staffType((String) claims.get("staff_type"))
                .specialization((String) claims.get("course_specialization"))
                .build();

    }

}
