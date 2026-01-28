package com.staff_portal.backend_for_frontend.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;

import java.util.Optional;

public interface ICustomOidcUserService extends OAuth2UserService<OidcUserRequest, OidcUser> {
//    void cachedUserData(String sessionId, OidcUserInfo userInfo, List<String> roles);
//    Map<String, Object> getCachedUserData(String sessionId);
    Optional<OidcUser> extractOidcUser(Authentication authentication);
}
