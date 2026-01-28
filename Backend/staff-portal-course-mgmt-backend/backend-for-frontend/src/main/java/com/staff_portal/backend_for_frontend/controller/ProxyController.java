package com.staff_portal.backend_for_frontend.controller;

import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.HEAD;
import static org.springframework.web.bind.annotation.RequestMethod.OPTIONS;
import static org.springframework.web.bind.annotation.RequestMethod.PATCH;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;
import static org.springframework.web.bind.annotation.RequestMethod.TRACE;

import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.staff_portal.backend_for_frontend.service.ProxyService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/bff")
@RequiredArgsConstructor
@Slf4j
public class ProxyController {
    private final ProxyService proxyService;

    @Operation(summary = "Proxy to API Gateway", description = "Forwards requests to API Gateway with OAuth2 token")
    @RequestMapping(value = "/apig/**", method = { GET, POST, PUT, DELETE, PATCH, OPTIONS, TRACE, HEAD })
    public ResponseEntity<?> proxyToApiGateway(
            HttpServletRequest request,
            Authentication authentication,
            @RequestHeader HttpHeaders headers,
            @RequestBody(required = false) JsonNode body) {
        String path = extractPath(request);
        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        return proxyService.proxyToApiGateway(path, method, body, authentication, headers);
    }

    @Operation(summary = "Proxy to Auth Server", description = "Forwards requests to Auth Server with OAuth2 token")
    @RequestMapping(value = "/auth/**", method = { GET, POST, PUT, DELETE, PATCH, OPTIONS, TRACE, HEAD })
    public ResponseEntity<?> proxyToAuthServer(
            HttpServletRequest request,
            Authentication authentication,
            @RequestHeader HttpHeaders headers,
            @RequestBody(required = false) Map<String, Object> body) {
        String path = extractPath(request);
        HttpMethod method = HttpMethod.valueOf(request.getMethod());
        return proxyService.proxyToAuthServer(path, method, body, authentication, headers);
    }

    private String extractPath(HttpServletRequest request) {
        String requestURI = request.getRequestURI();
        String queryString = request.getQueryString();

        String path = requestURI.startsWith("/bff/apig") ? requestURI.substring("/bff/apig".length())
                : requestURI.substring("/bff/auth".length());

        if (queryString != null && !queryString.isEmpty()) {
            return path + "?" + queryString;
        }
        return path;
    }
}
