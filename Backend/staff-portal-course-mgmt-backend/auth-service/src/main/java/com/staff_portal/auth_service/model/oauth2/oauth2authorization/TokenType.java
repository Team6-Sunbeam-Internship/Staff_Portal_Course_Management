package com.staff_portal.auth_service.model.oauth2.oauth2authorization;

public enum TokenType {
    BEARER("Bearer"),
    DPOP("DPoP");

    private final String value;

    TokenType(String value) {
        this.value = value;
    }
    public String getValue() {
        return value;
    }
    public static TokenType fromValue(String value) {
        for (TokenType type : TokenType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown grant type: " + value);
    }
}