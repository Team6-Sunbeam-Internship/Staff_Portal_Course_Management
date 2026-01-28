package com.staff_portal.backend_for_frontend.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.OAuth2AuthorizationFailureHandler;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.client.OAuth2ClientHttpRequestInterceptor;
import org.springframework.web.client.RestClient;

import java.nio.charset.StandardCharsets;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class RestClientConfig {
    private final OAuth2AuthorizedClientManager authorizedClientManager;
    private final OAuth2AuthorizedClientRepository authorizedClientRepository;

    @Bean(name = "primaryRestClient")
    @Primary
    public RestClient restClient() {
        OAuth2ClientHttpRequestInterceptor requestInterceptor =
                new OAuth2ClientHttpRequestInterceptor(authorizedClientManager);
        OAuth2AuthorizationFailureHandler authorizationFailureHandler =
                OAuth2ClientHttpRequestInterceptor.authorizationFailureHandler(authorizedClientRepository);
        requestInterceptor.setAuthorizationFailureHandler(authorizationFailureHandler);
        requestInterceptor.setClientRegistrationIdResolver(clientRegistrationIdResolver());
        return RestClient.builder()
                .requestFactory(new HttpComponentsClientHttpRequestFactory())
                .requestInterceptor(requestInterceptor)
                .requestInterceptor(loggingInterceptor())
                .build();
    }

    @Bean(name = "plainRestClient")
    public RestClient plainRestClient() {
        return RestClient.builder()
                .requestFactory(new HttpComponentsClientHttpRequestFactory())
                .messageConverters(converters -> converters.add(new MappingJackson2HttpMessageConverter()))
                .requestInterceptor(loggingInterceptor())
                .build();
    }

    private OAuth2ClientHttpRequestInterceptor.ClientRegistrationIdResolver clientRegistrationIdResolver() {
        return (request) -> {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication instanceof OAuth2AuthenticationToken token) {
                return token.getAuthorizedClientRegistrationId();
            }
            return "staff-portal-client";
        };
    }

    private ClientHttpRequestInterceptor loggingInterceptor() {
        return (request, body, execution) -> {
            log.debug("Outbound request: {} {}", request.getMethod(), request.getURI());
            String bodyString = new String(body, StandardCharsets.UTF_8);
            log.debug("Request body: {}", bodyString.isEmpty() ? "[EMPTY]" : bodyString);
            log.debug("Outbound headers: {}", request.getHeaders());
            ClientHttpResponse response = execution.execute(request, body);
            log.debug("Response status: {}", response.getStatusCode());
            return response;
        };
    }
}