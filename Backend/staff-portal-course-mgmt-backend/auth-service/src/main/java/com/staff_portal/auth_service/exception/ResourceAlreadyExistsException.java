package com.staff_portal.auth_service.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ResourceAlreadyExistsException extends RuntimeException {
    private final HttpStatus status;
    public ResourceAlreadyExistsException(String message, HttpStatus status) { super(message);
        this.status = status;
    }
}