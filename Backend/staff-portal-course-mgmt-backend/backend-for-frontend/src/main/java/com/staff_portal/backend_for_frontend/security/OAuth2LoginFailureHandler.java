package com.staff_portal.backend_for_frontend.security;

import com.staff_portal.backend_for_frontend.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
@RequiredArgsConstructor
public class OAuth2LoginFailureHandler implements AuthenticationFailureHandler {
    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {
        log.error("OAuth2 login failed", exception);
        String errorMessage = encodeErrorMessage(exception.getMessage());
        response.sendRedirect("/login?error=" + errorMessage);
    }
    private String encodeErrorMessage(String message) {
        return URLEncoder.encode(message != null ? message : "Authentication failed", StandardCharsets.UTF_8);
    }
}