package com.staff_portal.backend_for_frontend.dto;

import lombok.Builder;
import lombok.Setter;

@Setter
@Builder
public class AuthenticationResponse {
    boolean authenticated;
    String message;
}