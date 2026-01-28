package com.staff_portal.scheduling_service.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class NotInRangeException extends RuntimeException {
    private HttpStatus status;
    public NotInRangeException(HttpStatus status, String message) {
        super(message);
    }
    public NotInRangeException(String message) {
        super(message);
    }
}
