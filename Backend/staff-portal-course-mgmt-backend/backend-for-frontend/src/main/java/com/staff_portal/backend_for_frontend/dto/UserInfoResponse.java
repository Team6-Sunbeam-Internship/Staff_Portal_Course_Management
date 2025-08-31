package com.staff_portal.backend_for_frontend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoResponse {
    private String sub;
    private String name;
    private String email;
    private String givenName;
    private String familyName;
    private String picture;
    private Boolean emailVerified;
    private String locale;
    private Map<String, Object> additionalClaims = new HashMap<>();
}