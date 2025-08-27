package com.staff_portal.user_service.exception;

public class ResourceNotFoundException extends RuntimeException{

	public ResourceNotFoundException(String message)
	{
		super(message);
	}
}
