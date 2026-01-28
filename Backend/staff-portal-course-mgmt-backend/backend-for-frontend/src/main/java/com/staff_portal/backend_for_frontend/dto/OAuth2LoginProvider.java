package com.staff_portal.backend_for_frontend.dto;

public record OAuth2LoginProvider(
        String registrationId,
        String displayName,
        String authorizationUrl
) {}
