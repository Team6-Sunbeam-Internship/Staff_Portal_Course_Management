package com.staff_portal.backend_for_frontend.service;

import com.staff_portal.backend_for_frontend.config.OAuth2EndpointsConfig;
import com.staff_portal.backend_for_frontend.dto.UserInfoResponse;
import com.staff_portal.backend_for_frontend.exception.ProxyException;
import com.staff_portal.backend_for_frontend.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

import static org.springframework.security.oauth2.client.web.client.RequestAttributeClientRegistrationIdResolver.clientRegistrationId;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProxyService {
    private final RestClient restClient;
    private final RestClient plainRestClient;
    private final OAuth2EndpointsConfig endpointsConfig;
    private final TokenService tokenService;

    @Value("${bff.api-gateway.base-url}")
    private String apiGatewayBaseUrl;

    public ResponseEntity<String> proxyToApiGateway(String path, HttpMethod method,
                                                    Map<String, String> headers, Object body, Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        try {
            OAuth2AuthorizedClient client = tokenService.getValidAuthorizedClient(authentication,request, response);
            if (client == null) {
                throw new UnauthorizedException("No valid access token available");
            }
            String url = apiGatewayBaseUrl + path;
            RestClient.RequestHeadersSpec<?> requestSpec = buildRequest(method, url, headers, body);
            String apiGatewayResponse = requestSpec
                    .attributes(clientRegistrationId("staff-portal-client"))
                    .headers(httpHeaders -> httpHeaders.setBearerAuth(client.getAccessToken().getTokenValue()))
                    .retrieve()
                    .body(String.class);
            log.debug("Successfully proxied request to API Gateway: {}", path);
            return ResponseEntity.ok(apiGatewayResponse);
        } catch (Exception e) {
            log.error("Error proxying request to API Gateway", e);
            throw new ProxyException("Failed to proxy request", e);
        }
    }

    public ResponseEntity<String> proxyToAuthServer(String path, HttpMethod method,
                                                    Map<String, String> headers, String body, Authentication authentication,  HttpServletRequest request, HttpServletResponse response) {
        try {
            OAuth2AuthorizedClient client = tokenService.getValidAuthorizedClient(authentication, request, response );
            if (client == null) {
                throw new UnauthorizedException("No valid tokens available");
            }
            String url = endpointsConfig.getIssuer() + path;
            RestClient.RequestHeadersSpec<?> requestSpec = buildRequest(method, url, headers, body);
            String authServerResponse = requestSpec
                    .attributes(clientRegistrationId("staff-portal-client"))
                    .headers(httpHeaders -> httpHeaders.setBearerAuth(client.getAccessToken().getTokenValue()))
                    .retrieve()
                    .body(String.class);
            log.debug("Successfully proxied request to Auth Server: {}", path);
            return ResponseEntity.ok(authServerResponse);
        } catch (Exception e) {
            log.error("Error proxying request to Auth Server", e);
            throw new ProxyException("Failed to proxy request", e);
        }
    }

    public UserInfoResponse getUserInfo(Authentication authentication, HttpServletRequest request, HttpServletResponse response) {
        try {
            OAuth2AuthorizedClient client = tokenService.getValidAuthorizedClient(authentication, request,response );
            if (client == null) {
                throw new UnauthorizedException("No valid access token available");
            }
            UserInfoResponse userInfoResponse = restClient.get()
                    .uri(endpointsConfig.getUserInfoUri())
                    .attributes(clientRegistrationId("auth-server"))
                    .retrieve()
                    .body(UserInfoResponse.class);
            log.debug("Successfully retrieved user info");
            return userInfoResponse;
        } catch (Exception e) {
            log.error("Error retrieving user info", e);
            throw new ProxyException("Failed to retrieve user info", e);
        }
    }

    private RestClient.RequestHeadersSpec<?> buildRequest(HttpMethod method, String url,
                                                          Map<String, String> headers, Object body) {
        RestClient.RequestBodySpec requestSpec;

        if (HttpMethod.GET.equals(method)) {
            requestSpec = (RestClient.RequestBodySpec) restClient.get().uri(url);
        } else if (HttpMethod.POST.equals(method)) {
            requestSpec = restClient.post().uri(url);
        } else if (HttpMethod.PUT.equals(method)) {
            requestSpec = restClient.put().uri(url);
        } else if (HttpMethod.DELETE.equals(method)) {
            requestSpec = (RestClient.RequestBodySpec) restClient.delete().uri(url);
        } else if (HttpMethod.PATCH.equals(method)) {
            requestSpec = restClient.patch().uri(url);
        } else {
            throw new IllegalArgumentException("Unsupported HTTP method: " + method);
        }

        if (headers != null) {
            headers.forEach(requestSpec::header);
        }
        if (body != null && (HttpMethod.POST.equals(method) || HttpMethod.PUT.equals(method) || HttpMethod.PATCH.equals(method))) {
            return requestSpec.body(body);
        }
        return requestSpec;
    }
}