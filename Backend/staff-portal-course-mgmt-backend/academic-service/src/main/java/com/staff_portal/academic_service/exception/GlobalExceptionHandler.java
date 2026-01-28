package com.staff_portal.academic_service.exception;

import com.staff_portal.academic_service.dto.response.ApiResponse;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @Getter
    public static class ErrorResponse {
        // Getters
        private final LocalDateTime timestamp;
        private final int status;
        private final String error;
        private final String message;
        private final String path;

        public ErrorResponse(HttpStatus status, String message, String path) {
            this.timestamp = LocalDateTime.now();
            this.status = status.value();
            this.error = status.getReasonPhrase();
            this.message = message;
            this.path = path;
        }

    }

    // Handle ResourceNotFoundException globally
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, WebRequest request) {
        ErrorResponse error = new ErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(),
                request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    // Handle all other exceptions (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex, WebRequest request) {
        ErrorResponse error = new ErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage(),
                request.getDescription(false).replace("uri=", ""));
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(UserServiceException.class)
    public ResponseEntity<ApiResponse<String>> handleUserServiceException(UserServiceException e) {
        log.error(e.getMessage(), e.getClass().getName());
        HttpStatus status = HttpStatus.valueOf(e.getStatusCode().value());
        return ResponseEntity.status(status)
                .body(ApiResponse.onError(null, e.getMessage()));
    }
}
