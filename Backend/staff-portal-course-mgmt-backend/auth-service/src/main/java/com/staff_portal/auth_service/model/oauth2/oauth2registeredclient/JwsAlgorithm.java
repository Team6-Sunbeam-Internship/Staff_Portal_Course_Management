package com.staff_portal.auth_service.model.oauth2.oauth2registeredclient;

public enum JwsAlgorithm {
    RS256("RS256"),
    RS384("RS384"),
    RS512("RS512"),
    ES256("ES256"),
    ES384("ES384"),
    ES512("ES512"),
    PS256("PS256"),
    PS384("PS384"),
    PS512("PS512"),
    HS256("HS256"),
    HS384("HS384"),
    HS512("HS512");
    
    private final String name;
    
    JwsAlgorithm(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
}