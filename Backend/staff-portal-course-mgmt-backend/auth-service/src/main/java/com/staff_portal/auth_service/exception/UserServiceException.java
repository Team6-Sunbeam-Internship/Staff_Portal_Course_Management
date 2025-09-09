package com.staff_portal.auth_service.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatusCode;

@Getter
@Setter
public class UserServiceException extends RuntimeException {
    private final HttpStatusCode statusCode;

    public UserServiceException(String message, HttpStatusCode statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
