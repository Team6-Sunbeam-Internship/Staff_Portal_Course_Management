package com.staff_portal.backend_for_frontend.controller;


import com.staff_portal.backend_for_frontend.dto.UserInfoResponse;
import com.staff_portal.backend_for_frontend.service.ProxyService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/bff/proxy")
@RequiredArgsConstructor
@Slf4j
public class ProxyController {
    private final ProxyService proxyService;
    @Operation(summary = "Proxy to API Gateway", description = "Forwards requests to API Gateway with OAuth2 token")
    @RequestMapping(value = "/api/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<String> proxyToApiGateway(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication,
            @RequestBody(required = false) Object body) {
        String path = extractPath(request, "/proxy/api");
        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        Map<String, String> headers = extractHeaders(request);
        return proxyService.proxyToApiGateway(path, method, headers, body, authentication, request, response);
    }
    @Operation(summary = "Proxy to Auth Server", description = "Forwards requests to Auth Server with OAuth2 token")
    @RequestMapping(value = "/auth/**", method = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH})
    public ResponseEntity<String> proxyToAuthServer(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication,
            @RequestBody(required = false) String body) {
        String path = extractPath(request, "/bff/proxy/auth");
        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        Map<String, String> headers = extractHeaders(request);
        return proxyService.proxyToAuthServer(path, method, headers, body, authentication, request, response);
    }
    @Operation(summary = "Get user profile", description = "Retrieves user profile from Auth Server userinfo endpoint")
    @GetMapping("/profile")
    public ResponseEntity<UserInfoResponse> getUserProfile(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        UserInfoResponse userInfo = proxyService.getUserInfo(authentication, request, response);
        return ResponseEntity.ok(userInfo);
    }

    private String extractPath(HttpServletRequest request, String prefix) {
        String requestURI = request.getRequestURI();
        return requestURI.substring(prefix.length());
    }
    private Map<String, String> extractHeaders(HttpServletRequest request) {
        Map<String, String> headers = new HashMap<>();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            if (!headerName.equalsIgnoreCase("authorization") &&
                !headerName.equalsIgnoreCase("cookie")) {
                headers.put(headerName, request.getHeader(headerName));
            }
        }
        return headers;
    }
}
