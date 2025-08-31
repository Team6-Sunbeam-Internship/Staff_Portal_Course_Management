package com.staff_portal.backend_for_frontend.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class CookieUtil {
    @Value("${bff.cookie.secure:true}")
    private boolean secure;
    @Value("${bff.cookie.http-only:true}")
    private boolean httpOnly;
    @Value("${bff.cookie.same-site:Strict}")
    private String sameSite;
    private static final String BFF_SESSION_COOKIE_NAME = "__Host-bff-session";

    public ResponseCookie createSecureBffSessionCookie(String value, int maxAge) {
        ResponseCookie cookie = ResponseCookie.from(BFF_SESSION_COOKIE_NAME, value)
                .maxAge(maxAge)
                .httpOnly(httpOnly)
                .secure(secure)
                .sameSite(sameSite)
                .path("/")
                .build();
        log.debug("Created secure BFF session cookie with maxAge: {}", maxAge);
        return cookie;
    }

    public void clearBffSessionCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(BFF_SESSION_COOKIE_NAME, "")
                .maxAge(0)
                .path("/")
                .httpOnly(httpOnly)
                .secure(secure)
                .sameSite(sameSite)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        log.debug("Cleared BFF session cookie");
    }

    public void clearCookie(HttpServletResponse response, String cookieName) {
        ResponseCookie cookie = ResponseCookie.from(BFF_SESSION_COOKIE_NAME, "")
                .maxAge(0)
                .path("/")
                .httpOnly(httpOnly)
                .secure(secure)
                .sameSite(sameSite)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        log.debug("Cleared cookie: {}", cookieName);
    }

    public String getBffSessionId(HttpServletRequest request) {
        return getCookieValue(request, BFF_SESSION_COOKIE_NAME);
    }

    public String getCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }
}