package com.staff_portal.academic_service.exception;

import org.springframework.http.HttpStatus;

public class ResourseAlreadyExistException extends RuntimeException {
    private HttpStatus status;
    public ResourseAlreadyExistException(String message, HttpStatus httpStatus) {
        super(message);
        this.status = httpStatus;
    }
}
