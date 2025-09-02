package com.staff_portal.api_gateway.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtUtil {
    public static Optional<Jwt> extractJwtFromAuthentication(Authentication authentication) {
        if (authentication instanceof JwtAuthenticationToken jwtAuth) {
            return Optional.of(jwtAuth.getToken());
        }
        return Optional.empty();
    }
    public static boolean isJwtExpired(Jwt jwt) {
        if (jwt == null) return true;
        Instant expiration = jwt.getExpiresAt();
        return expiration != null && expiration.isBefore(Instant.now());
    }
    public static boolean isJwtNotYetValid(Jwt jwt) {
        if (jwt == null) return true;
        Instant notBefore = jwt.getNotBefore();
        return notBefore != null && notBefore.isAfter(Instant.now());
    }
    public static List<String> extractScopes(Jwt jwt) {
        if (jwt == null) return Collections.emptyList();
        List<String> scopes = new ArrayList<>();
        Object scopesClaim = jwt.getClaim("scopes");
        if (scopesClaim instanceof List) {
            ((List<?>) scopesClaim).forEach(scope -> {
                if (scope != null) {
                    scopes.add(scope.toString());
                }
            });
        }
        String scopeClaim = jwt.getClaimAsString("scope");
        if (StringUtils.hasText(scopeClaim)) {
            Arrays.stream(scopeClaim.split(" "))
                    .filter(StringUtils::hasText)
                    .forEach(scopes::add);
        }
        return scopes.stream().distinct().collect(Collectors.toList());
    }
    public static List<String> extractRoles(Jwt jwt) {
        if (jwt == null) return Collections.emptyList();
        List<String> roles = new ArrayList<>();
        Object rolesClaim = jwt.getClaim("roles");
        if (rolesClaim instanceof List) {
            ((List<?>) rolesClaim).forEach(role -> {
                if (role != null) {
                    roles.add(role.toString());
                }
            });
        } else if (rolesClaim instanceof String) {
            Arrays.stream(((String) rolesClaim).split(","))
                    .map(String::trim)
                    .filter(StringUtils::hasText)
                    .forEach(roles::add);
        }
        return roles.stream().distinct().collect(Collectors.toList());
    }
    public static String getSubject(Jwt jwt) {
        return jwt != null ? jwt.getSubject() : null;
    }
    public static String getIssuer(Jwt jwt) {
        return jwt != null ? jwt.getIssuer().toString() : null;
    }
    public static Instant getIssuedAt(Jwt jwt) {
        return jwt != null ? jwt.getIssuedAt() : null;
    }
    public static Instant getExpiresAt(Jwt jwt) {
        return jwt != null ? jwt.getExpiresAt() : null;
    }
    public static Duration getTimeToExpiry(Jwt jwt) {
        if (jwt == null || jwt.getExpiresAt() == null) {
            return Duration.ZERO;
        }
        return Duration.between(Instant.now(), jwt.getExpiresAt());
    }
    public static Map<String, Object> getAllClaims(Jwt jwt) {
        return jwt != null ? jwt.getClaims() : Collections.emptyMap();
    }
}