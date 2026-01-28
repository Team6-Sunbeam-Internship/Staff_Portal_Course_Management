package com.staff_portal.api_gateway.filter;

import com.staff_portal.api_gateway.service.AudienceValidationService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerResponse;

@Component
@Slf4j
public class AudienceEnforcementGatewayFilterFactory {

    @Autowired
    private AudienceValidationService audienceValidationService;

    @Data
    public static class Config {
        private String requiredAudience;
    }

    public HandlerFilterFunction<ServerResponse, ServerResponse> apply(Config config) {
        return (request, next) -> {
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

                if (authentication == null) {
                    log.warn("No authentication found in SecurityContext for path: {}", request.path());
                    return ServerResponse.status(HttpStatus.UNAUTHORIZED)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body("{\"error\":\"unauthorized\",\"message\":\"Authentication required\"}");
                }

                if (!(authentication instanceof JwtAuthenticationToken jwtAuth)) {
                    log.warn("Authentication is not JWT-based for path: {}", request.path());
                    return ServerResponse.status(HttpStatus.UNAUTHORIZED)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body("{\"error\":\"unauthorized\",\"message\":\"JWT authentication required\"}");
                }

                Jwt jwt = jwtAuth.getToken();

                // Validate audience using the service
                AudienceValidationService.ValidationResult result =
                        audienceValidationService.validateAudienceWithDetails(jwt, request.path());

                if (!result.isValid()) {
                    log.error("Audience validation failed for path {}: {} - Required: {}, Found: {}",
                            request.path(), result.getMessage(),
                            result.getRequiredAudience(), result.getFoundAudiences());

                    return ServerResponse.status(HttpStatus.FORBIDDEN)
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(result.toJsonError());
                }

                log.debug("Audience validation successful for path {}: {}",
                        request.path(), result.getMessage());

                return next.handle(request);

            } catch (Exception e) {
                log.error("Unexpected error during audience validation for path {}: {}",
                        request.path(), e.getMessage(), e);

                return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":\"server_error\",\"message\":\"Unexpected error during audience validation\"}");
            }
        };
    }
}