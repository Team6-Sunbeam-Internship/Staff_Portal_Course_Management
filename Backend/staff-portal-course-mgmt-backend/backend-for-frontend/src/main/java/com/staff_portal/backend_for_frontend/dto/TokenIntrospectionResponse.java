package com.staff_portal.backend_for_frontend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TokenIntrospectionResponse {
    private boolean active;
    private String scope;
    private String clientId;
    private String username;
    private String tokenType;
    private Long exp;
    private Long iat;
    private Long nbf;
    private String sub;
    private String aud;
    private String iss;
    private String jti;
}