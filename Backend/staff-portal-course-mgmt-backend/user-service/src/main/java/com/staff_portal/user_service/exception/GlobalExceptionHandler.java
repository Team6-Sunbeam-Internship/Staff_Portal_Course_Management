package com.staff_portal.user_service.exception;


import com.staff_portal.user_service.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateResourceException.class)
   public ResponseEntity<ApiResponse<String>> handleDuplicateResourceException(DuplicateResourceException e){
       log.error(e.getMessage(), e.getClass().getName());
       return ResponseEntity.status(e.getStatus())
               .body(ApiResponse.onError(null, e.getMessage()));
   }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleResourceAlreadyExists(ResourceNotFoundException e) {
        log.error(e.getMessage(), e.getClass().getName());
        return ResponseEntity.status(e.getStatus())
                .body(ApiResponse.onError(null, e.getMessage()));
    }

    @ExceptionHandler(ResourceAlreadyExistException.class)
    public ResponseEntity<ApiResponse<String>> handleResourceAlreadyExists(ResourceAlreadyExistException e) {
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
        log.error(e.getMessage(), e.getClass().getName(), e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.onError(null, "An unexpected error occurred: " + e.getMessage()));
    }
}