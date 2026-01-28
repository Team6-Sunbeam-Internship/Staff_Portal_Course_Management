package com.staff_portal.user_service.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class DuplicateResourceException extends RuntimeException {
    private HttpStatus status;
	public DuplicateResourceException(HttpStatus status, String message)
	{
		super(message);
	}
}
