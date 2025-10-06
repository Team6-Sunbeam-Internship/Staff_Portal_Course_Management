package com.staff_portal.academic_service.exception;

import org.springframework.http.HttpStatusCode;

public class CannotUpdateException extends RuntimeException {
    private final HttpStatusCode statusCode;

    public CannotUpdateException(String message, HttpStatusCode statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
