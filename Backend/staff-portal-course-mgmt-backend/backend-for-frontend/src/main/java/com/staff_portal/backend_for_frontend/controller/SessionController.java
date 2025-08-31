package com.staff_portal.backend_for_frontend.controller;

import com.staff_portal.backend_for_frontend.dto.SessionResponse;
import com.staff_portal.backend_for_frontend.repository.CustomOidcUserService;
import com.staff_portal.backend_for_frontend.service.TokenService;
import com.staff_portal.backend_for_frontend.util.CookieUtil;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class SessionController {
    private final TokenService tokenService;
    private final CustomOidcUserService customOidcUserService;
    private final CookieUtil cookieUtil;

    @Operation(summary = "Check session status", description = "Returns current authentication status and user information")
    @GetMapping("/session")
    public ResponseEntity<SessionResponse> checkSession(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.ok(SessionResponse.unauthenticated());
            }
            OAuth2AuthorizedClient client = tokenService.getValidAuthorizedClient(authentication, request, response);
            if (client == null) {
                return ResponseEntity.ok(SessionResponse.unauthenticated());
            }
            String sessionId = getSessionId(request);
            if (sessionId == null) {
                return ResponseEntity.ok(SessionResponse.unauthenticated());
            }
            Map<String, Object> cachedUserData = customOidcUserService.getCachedUserData(sessionId);
            SessionResponse sessionResponse = buildSessionResponse(cachedUserData);
            log.debug("Session check successful for user: {}", cachedUserData.get("email"));
            return ResponseEntity.ok(sessionResponse);
        } catch (Exception e) {
            log.error("Error during session check", e);
            return ResponseEntity.ok(SessionResponse.unauthenticated());
        }
    }

    private String getSessionId(HttpServletRequest request) {
        String customSessionId = cookieUtil.getCookieValue(request, "__Host-bff-session");
        if (customSessionId != null) {
            return customSessionId;
        }
        HttpSession session = request.getSession(false);
        return session != null ? session.getId() : null;
    }

    @SuppressWarnings("unchecked")
    private SessionResponse buildSessionResponse(Map<String, Object> cachedUserData) {

        if (cachedUserData == null || !cachedUserData.containsKey("profile")) {
            return SessionResponse.unauthenticated();
        }

        Object profileObj = cachedUserData.get("profile");
        if (!(profileObj instanceof Map)) {
            return SessionResponse.unauthenticated();
        }

        Map<String, Object> profile = (Map<String, Object>) profileObj;

        // Handle roles safely
        Set<String> roles = new HashSet<>();
        Object rolesObj = profile.get("roles");
        if (rolesObj instanceof List) {
            roles.addAll((List<String>) rolesObj);
        } else if (rolesObj instanceof String) {
            roles.add((String) rolesObj);
        }
        SessionResponse build = SessionResponse.builder()
                .authenticated(true)
                .name((String) profile.getOrDefault("name", ""))
                .email((String) profile.getOrDefault("email", ""))
                .roles(roles)
                .build();

        if (profile.containsKey("phoneNumber")) {
            build.setPhoneNumber((String) profile.get("phoneNumber"));
        }
        if (profile.containsKey("address")) {
            build.setAddress((String) profile.get("address"));
        }
        if (profile.containsKey("staff_type")) {
            build.setStaffType((String) profile.get("staff_type"));
        }

        return build;
    }



}