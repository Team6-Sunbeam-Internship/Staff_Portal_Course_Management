package com.staff_portal.auth_service.model.oauth2.oauth2registeredclient;

public enum AuthorizationGrantType {
    AUTHORIZATION_CODE("authorization_code"),
    REFRESH_TOKEN("refresh_token"),
    CLIENT_CREDENTIALS("client_credentials"),
    @Deprecated
    PASSWORD("password"),
    JWT_BEARER("urn:ietf:params:oauth:grant-type:jwt-bearer"),
    DEVICE_CODE("urn:ietf:params:oauth:grant-type:device_code"),
    TOKEN_EXCHANGE("urn:ietf:params:oauth:grant-type:token-exchange");

    private final String value;

    AuthorizationGrantType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}