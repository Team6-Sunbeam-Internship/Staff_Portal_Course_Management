package com.staff_portal.auth_service.model.oauth2.oauth2authorization;

import lombok.Getter;

@Getter
public enum AuthorizationGrantType {
    AUTHORIZATION_CODE("authorization_code"),
    REFRESH_TOKEN("refresh_token"),
    CLIENT_CREDENTIALS("client_credentials"),
    PASSWORD("password"),
    JWT_BEARER("urn:ietf:params:oauth:grant-type:jwt-bearer"),
    DEVICE_CODE("urn:ietf:params:oauth:grant-type:device_code");
    
    private final String value;

    AuthorizationGrantType(String value) {
        this.value = value;
    }

    public static AuthorizationGrantType fromValue(String value) {
        for (AuthorizationGrantType type : AuthorizationGrantType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown grant type: " + value);
    }

}