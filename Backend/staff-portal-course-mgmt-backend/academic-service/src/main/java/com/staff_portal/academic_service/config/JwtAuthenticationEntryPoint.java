package com.staff_portal.academic_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.staff_portal.academic_service.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        String errorMessage = getSpecificErrorMessage(authException);
        String exceptionType = authException.getClass().getSimpleName();

        log.error("Authentication failed - Exception: {}, Message: {}", exceptionType, authException.getMessage());

        response.setContentType("application/json");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());

        ApiResponse<String> errorResponse = ApiResponse.onError(exceptionType, errorMessage);

        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }

    private String getSpecificErrorMessage(AuthenticationException authException) {
        String message = authException.getMessage();
        String exceptionType = authException.getClass().getSimpleName();

        // Check cause first
        if (authException.getCause() instanceof BadJwtException) {
            return "JWT token is invalid or malformed";
        }
        if (authException.getCause() instanceof JwtException) {
            return "JWT token processing failed";
        }

        // Handle specific exception types
        return switch (exceptionType) {
            case "InvalidBearerTokenException" -> "Invalid Bearer token provided";
            case "InsufficientAuthenticationException" -> "JWT token is missing or insufficient";
            case "BadCredentialsException" -> "Invalid credentials provided";
            case "CredentialsExpiredException" -> "Credentials have expired";
            default -> {
                if (message != null) {
                    if (message.contains("JWT") || message.contains("token")) {
                        yield "JWT authentication failed";
                    }
                    if (message.contains("expired")) {
                        yield "Authentication token has expired";
                    }
                    if (message.contains("invalid")) {
                        yield "Invalid authentication credentials";
                    }
                }
                yield "Authentication failed";
            }
        };
    }
}
