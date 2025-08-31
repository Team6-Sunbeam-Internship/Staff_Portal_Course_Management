package com.staff_portal.backend_for_frontend.exception;

public abstract class BffException extends RuntimeException {
    public BffException(String message) {
        super(message);
    }
    public BffException(String message, Throwable cause) {
        super(message, cause);
    }
}