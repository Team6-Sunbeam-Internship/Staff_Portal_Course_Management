package com.staff_portal.auth_service.model.oauth2.oauth2registeredclient;

public enum OAuth2TokenFormat {
    SELF_CONTAINED("self-contained"),
    REFERENCE("reference");
    
    private final String value;
    
    OAuth2TokenFormat(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
}