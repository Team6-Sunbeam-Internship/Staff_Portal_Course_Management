package com.staff_portal.backend_for_frontend.exception;

public class UnauthorizedException extends BffException {
    public UnauthorizedException(String message) {
        super(message);
    }
}