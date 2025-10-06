package com.staff_portal.academic_service.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Getter
@Setter
public class ApiResponse<T> {
    private T apiResponse;
    private boolean success;
    private LocalDateTime timestamp;
    private String error;

    private ApiResponse(T apiResponse,  boolean success, String error, LocalDateTime timestamp) {
        this.apiResponse = apiResponse;
        this.success = success;
        this.error = error;
        this.timestamp = timestamp;
    }

    public static <T> ApiResponse<T> onSuccess(T apiResponse) {
        LocalDateTime timeStamp = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        return new ApiResponse<T>(apiResponse, true, null, timeStamp);
    }

    public static <T> ApiResponse<T> onError(T apiResponse, String error) {
        LocalDateTime timeStamp = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
        return new ApiResponse<T>(apiResponse, false, error, timeStamp);
    }
}