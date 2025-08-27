package com.staff_portal.auth_service.exception;

import com.staff_portal.auth_service.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<ApiResponse<String>> handlePasswordMismatchException(PasswordMismatchException e) {
        log.error(e.getMessage(), e.getClass().getName());
        return ResponseEntity.status(e.getStatusCode())
                .body(ApiResponse.onError(null, e.getMessage()));
    }

    @ExceptionHandler(UserServiceException.class)
    public ResponseEntity<ApiResponse<String>> handleUserServiceException(UserServiceException e) {
        log.error(e.getMessage(), e.getClass().getName());
        HttpStatus status = HttpStatus.valueOf(e.getStatusCode().value());
        return ResponseEntity.status(status)
                .body(ApiResponse.onError(null, e.getMessage()));
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<ApiResponse<String>> handleResourceAlreadyExists(ResourceAlreadyExistsException e) {
        log.error(e.getMessage(), e.getClass().getName());
        return ResponseEntity.status(e.getStatus())
                .body(ApiResponse.onError(null, e.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<String>> handleIllegalState(IllegalStateException e) {
        log.error(e.getMessage(), e.getClass().getName());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.onError(null, e.getMessage()));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<String>> handleAccessDenied(AccessDeniedException e) {
        log.error(e.getMessage(), e.getClass().getName());
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.onError(null, e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGenericException(Exception e) {
        log.error(e.getMessage(), e.getClass().getName());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.onError(null, "An unexpected error occurred: " + e.getMessage()));
    }
}