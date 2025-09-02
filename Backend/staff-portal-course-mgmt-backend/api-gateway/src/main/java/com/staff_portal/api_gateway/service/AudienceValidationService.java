package com.staff_portal.api_gateway.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class AudienceValidationService {
    private final RouteConfigService routeConfigService;
    public AudienceValidationService(RouteConfigService routeConfigService) {
        this.routeConfigService = routeConfigService;
    }
    public boolean validateAudience(Jwt jwt, String requestPath) {
        if (jwt == null) {
            log.error("JWT token is null");
            return false;
        }
        try {
            String requiredAudience = routeConfigService.getRequiredAudienceByPath(requestPath);
            List<String> tokenAudiences = jwt.getAudience();
            if (tokenAudiences == null || tokenAudiences.isEmpty()) {
                log.error("JWT token has no audience claims for path: {}", requestPath);
                return false;
            }
            boolean hasRequiredAudience = tokenAudiences.contains(requiredAudience);
            if (!hasRequiredAudience) {
                log.error("JWT token does not contain required audience. Required: {}, Found: {} for path: {}",
                        requiredAudience, tokenAudiences, requestPath);
                return false;
            }
            log.debug("Audience validation successful. Required: {}, Found: {} for path: {}",
                    requiredAudience, tokenAudiences, requestPath);
            return true;
        } catch (IllegalArgumentException e) {
            log.error("Invalid request path for audience validation: {}", requestPath);
            return false;
        } catch (Exception e) {
            log.error("Unexpected error during audience validation for path {}: {}", requestPath, e.getMessage(), e);
            return false;
        }
    }
    public ValidationResult validateAudienceWithDetails(Jwt jwt, String requestPath) {
        if (jwt == null) {
            return new ValidationResult(false, "JWT token is null", null, null);
        }
        try {
            String requiredAudience = routeConfigService.getRequiredAudienceByPath(requestPath);
            List<String> tokenAudiences = jwt.getAudience();
            if (tokenAudiences == null || tokenAudiences.isEmpty()) {
                return new ValidationResult(false, "JWT token has no audience claims", requiredAudience, tokenAudiences);
            }
            boolean hasRequiredAudience = tokenAudiences.contains(requiredAudience);
            if (!hasRequiredAudience) {
                return new ValidationResult(false, "Token audience does not include required service", requiredAudience, tokenAudiences);
            }
            return new ValidationResult(true, "Audience validation successful", requiredAudience, tokenAudiences);
        } catch (IllegalArgumentException e) {
            return new ValidationResult(false, "Invalid request path: " + requestPath, null, null);
        } catch (Exception e) {
            return new ValidationResult(false, "Validation error: " + e.getMessage(), null, null);
        }
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ValidationResult {
        private boolean valid;
        private String message;
        private String requiredAudience;
        private List<String> foundAudiences;
    }
}