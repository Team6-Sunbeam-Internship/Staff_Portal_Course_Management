package com.staff_portal.backend_for_frontend.exception;

public class ProxyException extends BffException {
    public ProxyException(String message) {
        super(message);
    }
    public ProxyException(String message, Throwable cause) {
        super(message, cause);
    }
}