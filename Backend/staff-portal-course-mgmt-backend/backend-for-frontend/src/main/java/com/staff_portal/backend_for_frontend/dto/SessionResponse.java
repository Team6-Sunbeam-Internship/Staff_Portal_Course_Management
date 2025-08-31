package com.staff_portal.backend_for_frontend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Builder
@Getter
@Setter
public class SessionResponse {
    private boolean authenticated;
    private String name;
    private String email;
    private Set<String> roles;
    private String address;
    private String phoneNumber;
    private String phoneNumberVerified;
    private String staffType;
    private String message;

    public static SessionResponse unauthenticated() {
        return SessionResponse.builder()
                .authenticated(false)
                .message("Session has been expired")
                .build();
    }
}