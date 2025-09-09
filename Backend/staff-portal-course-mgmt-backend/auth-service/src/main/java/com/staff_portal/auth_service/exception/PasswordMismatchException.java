package com.staff_portal.auth_service.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class PasswordMismatchException extends RuntimeException {
    private final HttpStatus statusCode;
    public PasswordMismatchException(String mismatchOfOld, HttpStatus statusCode) {
        super(mismatchOfOld);
        this.statusCode = statusCode;
    }
}
