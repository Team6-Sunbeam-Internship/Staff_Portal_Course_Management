package com.staff_portal.backend_for_frontend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.staff_portal.backend_for_frontend.config.OAuth2EndpointsConfig;
import com.staff_portal.backend_for_frontend.dto.AuthenticationResponse;
import com.staff_portal.backend_for_frontend.exception.ProxyException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.net.URI;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.springframework.http.HttpMethod.*;
import static org.springframework.security.oauth2.client.web.client.RequestAttributeClientRegistrationIdResolver.clientRegistrationId;

@Service
@Slf4j
public class ProxyService {
    private final RestClient restClient;
    private final OAuth2EndpointsConfig endpointsConfig;
    private final TokenService tokenService;

    @Value("${bff.api-gateway.base-url}")
    private String apiGatewayBaseUrl;

    public ProxyService(@Qualifier("primaryRestClient") RestClient restClient, OAuth2EndpointsConfig endpointsConfig, TokenService tokenService) {
        this.restClient = restClient;
        this.endpointsConfig = endpointsConfig;
        this.tokenService = tokenService;
    }

//    private static final Set<String> CORS_HEADERS = Set.of(
//            "access-control-allow-origin",
//            "access-control-allow-credentials",
//            "access-control-allow-methods",
//            "access-control-allow-headers",
//            "access-control-expose-headers"
//    );
//
//    private void copyResponseHeaders(HttpHeaders source, HttpHeaders target) {
//        source.forEach((name, values) -> {
//            if (!CORS_HEADERS.contains(name.toLowerCase())) {
//                target.addAll(name, values);
//            }
//        });
//    }

    public ResponseEntity<?> proxyToApiGateway(String path,
                                               HttpMethod method,
                                               JsonNode body,
                                               Authentication authentication,
                                               HttpHeaders headers) {
        try {
            // Check Authentication Validity
            if (!checkValidAuthentication(authentication)) {
                return ResponseEntity.ok(AuthenticationResponse.builder()
                        .authenticated(false)
                        .message("Session has been expired")
                        .build());
            }
            String registrationId = null;
            if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
                registrationId = oauth2Token.getAuthorizedClientRegistrationId();
            }
            log.info("REGISTRATION ID: {}", registrationId);
            RestClient.RequestBodySpec requestBodySpec = restClient.method(method).uri(apiGatewayBaseUrl + path);
            if (body != null && (method == POST || method == PUT || method == PATCH)) {
                requestBodySpec = requestBodySpec.contentType(MediaType.APPLICATION_JSON).body(body);
            }
            ResponseEntity<byte[]> apiGatewayResponse = requestBodySpec
                    .attributes(clientRegistrationId(registrationId))
                    .headers(header -> header.addAll(sanitizeHeaders(headers)))
                    .retrieve()
                    .toEntity(byte[].class);
            log.debug("Successfully proxied request to API Gateway: {}", path);
            return ResponseEntity
                    .status(apiGatewayResponse.getStatusCode())
                    .body(apiGatewayResponse.getBody());
        } catch (Exception e) {
            log.error("Error proxying request to API Gateway", e);
            throw new ProxyException("Failed to proxy request", e);
        }
    }

    public ResponseEntity<?> proxyToAuthServer(String path,
                                               HttpMethod method,
                                               Map<String, Object> body,
                                               Authentication authentication,
                                               HttpHeaders headers) {
        try {
            if (!checkValidAuthentication(authentication)) {
                return ResponseEntity.ok(AuthenticationResponse.builder()
                        .authenticated(false)
                        .message("Session has been expired")
                        .build());
            }
            String registrationId = null;
            if (authentication instanceof OAuth2AuthenticationToken oauth2Token) {
                registrationId = oauth2Token.getAuthorizedClientRegistrationId();
            }
            String url = endpointsConfig.getIssuer() + path;
            RestClient.RequestBodySpec requestBodySpec = restClient.method(method).uri(URI.create(url));

            if (body != null && (method == POST || method == PUT || method == PATCH)) {
                requestBodySpec = requestBodySpec.contentType(MediaType.APPLICATION_JSON).body(body);
            }

            ResponseEntity<byte[]> authServerResponse = requestBodySpec
                    .attributes(clientRegistrationId(registrationId))
                    .retrieve()
                    .toEntity(byte[].class);
            log.debug("Successfully proxied request to Auth Server: {}", path);
            return ResponseEntity
                    .status(authServerResponse.getStatusCode())
                    .body(authServerResponse.getBody());
        } catch (Exception e) {
            log.error("Error proxying request to Auth Server", e);
            throw new ProxyException("Failed to proxy request", e);
        }
    }

    private boolean checkValidAuthentication(Authentication authentication) {
        return Optional.ofNullable(authentication)
                .map(Authentication::isAuthenticated)
                .orElse(false);
    }

    private static final Set<String> HOP_BY_HOP_HEADERS = Set.of(
            HttpHeaders.HOST.toLowerCase(),
            HttpHeaders.CONNECTION.toLowerCase(),
            HttpHeaders.CONTENT_LENGTH.toLowerCase(),
            HttpHeaders.TRANSFER_ENCODING.toLowerCase(),
            HttpHeaders.UPGRADE.toLowerCase(),
            HttpHeaders.ACCEPT_ENCODING.toLowerCase()
    );

    private HttpHeaders sanitizeHeaders(HttpHeaders incoming) {
        HttpHeaders sanitized = new HttpHeaders();
        incoming.forEach((name, values) -> {
            String key = name.toLowerCase(); // Skip these headers
            // SKIP HOP_BY_HOP_HEADERS
            if (HOP_BY_HOP_HEADERS.contains(key)) return;
            // Skip internal-only headers
            if (key.startsWith("x-internal")) return;
            // Skip BFF-only cookies/csrf
            if (key.equals(HttpHeaders.COOKIE.toLowerCase()) || key.equals("x-xsrf-token")) return;

            sanitized.addAll(name, values);
        });
        return sanitized;
    }
}