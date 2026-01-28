package com.staff_portal.user_service.exception;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ResourceAlreadyExistException extends RuntimeException {
    private HttpStatus status;
	public ResourceAlreadyExistException(HttpStatus status, String message)
	{
		super(message);
	}
}
