package com.staff_portal.backend_for_frontend.exception;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.core.OAuth2AuthorizationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException e) {
        log.warn("Unauthorized access: {}", e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("unauthorized", e.getMessage()));
    }
    @ExceptionHandler(ProxyException.class)
    public ResponseEntity<ErrorResponse> handleProxy(ProxyException e) {
        log.error("Proxy error: {}", e.getMessage(), e);
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
            .body(new ErrorResponse("proxy_error", "Failed to process request"));
    }
    @ExceptionHandler(OAuth2AuthorizationException.class)
    public ResponseEntity<ErrorResponse> handleOAuth2Authorization(OAuth2AuthorizationException e) {
        log.error("OAuth2 authorization error: {}", e.getError().getDescription());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new ErrorResponse("oauth2_error", e.getError().getDescription()));
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneral(Exception e) {
        log.error("Unexpected error", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(new ErrorResponse("internal_error", "An unexpected error occurred"));
    }
    @Data
    @AllArgsConstructor
    public static class ErrorResponse {
        private String error;
        private String message;
    }
}