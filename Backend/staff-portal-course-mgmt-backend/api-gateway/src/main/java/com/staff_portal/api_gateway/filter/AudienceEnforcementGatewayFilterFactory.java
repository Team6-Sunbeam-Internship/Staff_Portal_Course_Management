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
                if (authentication instanceof JwtAuthenticationToken jwtAuth) {
                    Jwt jwt = jwtAuth.getToken();

                    // Use the detailed validation method
                    AudienceValidationService.ValidationResult result =
                            audienceValidationService.validateAudienceWithDetails(jwt, request.path());

                    if (!result.isValid()) {
                        log.error("Audience validation failed: {} - Required: {}, Found: {}",
                                result.getMessage(), result.getRequiredAudience(), result.getFoundAudiences());

                        return ServerResponse.status(HttpStatus.FORBIDDEN)
                                .contentType(MediaType.APPLICATION_JSON)
                                .body("{\"error\":\"invalid_audience\"," +
                                        "\"message\":\"" + result.getMessage() + "\"," +
                                        "\"required_audience\":\"" + result.getRequiredAudience() + "\"," +
                                        "\"found_audiences\":" + (result.getFoundAudiences() != null ?
                                        result.getFoundAudiences().toString() : "null") + "}");
                    }

                    log.debug("Audience validation successful: {}", result.getMessage());
                }
                return next.handle(request);
            } catch (Exception e) {
                log.error("Unexpected error during audience validation", e);

                String errorBody = """
                        {
                          "error": "server_error",
                          "message": "Unexpected error during audience validation"
                        }
                        """;

                return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(errorBody);
            }
        };
    }
}