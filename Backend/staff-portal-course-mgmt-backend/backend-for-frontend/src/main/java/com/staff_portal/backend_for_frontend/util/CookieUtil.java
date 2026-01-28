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

    private static final String LAST_ROUTE_COOKIE = "__BFF_LAST_ROUTE";

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

    public void clearCookie(HttpServletResponse response, String cookieName) {
        ResponseCookie cookie = ResponseCookie.from(cookieName, "")
                .path("/")
                .maxAge(0)
                .httpOnly(httpOnly)
                .secure(secure)
                .sameSite(sameSite)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
        log.debug("Cleared cookie: {}", cookieName);
    }

    public ResponseCookie createLastRouteCookie(String referrer, int maxAgeSeconds) {
        return ResponseCookie.from(LAST_ROUTE_COOKIE, referrer)
                .path("/")                     // available across SPA
                .maxAge(maxAgeSeconds)          // short-lived (e.g. 300s)
                .httpOnly(httpOnly)                 // JS should not read it
                .secure(secure)                   // required in prod (HTTPS)
                .sameSite(sameSite)                // allows redirect navigation
                .build();
    }

    public String getLastRoute(HttpServletRequest request) {
        return getCookieValue(request, LAST_ROUTE_COOKIE);
    }

    public void clearLastRoute(HttpServletResponse response) {
        clearCookie(response, LAST_ROUTE_COOKIE);
    }

}