package com.staff_portal.backend_for_frontend.dto;

import lombok.*;

import java.util.UUID;

@Builder
@Getter
@Setter
public class SessionResponse {
    private boolean authenticated;
    private String name;
    private String email;
    private String emailVerified;
    private String role;
    private String gender;
    private UUID staffId;
    private String address;
    private String phoneNumber;
    private String phoneNumberVerified;
    private String staffType;
    private String specialization;
    private String message;

    public static SessionResponse unauthenticated() {
        return SessionResponse.builder()
                .authenticated(false)
                .message("Session has been expired")
                .build();
    }
}