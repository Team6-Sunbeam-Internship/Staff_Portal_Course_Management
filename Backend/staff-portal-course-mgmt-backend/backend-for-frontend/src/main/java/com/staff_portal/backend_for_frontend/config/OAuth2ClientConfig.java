package com.staff_portal.backend_for_frontend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.staff_portal.backend_for_frontend.repository.IRedisClientRegistrationRepository;
import com.staff_portal.backend_for_frontend.repository.RedisAuthorizationRequestRepository;
import com.staff_portal.backend_for_frontend.repository.RedisClientRegistrationRepository;
import com.staff_portal.backend_for_frontend.repository.RedisOAuth2AuthorizedClientService;
import com.staff_portal.backend_for_frontend.util.RedisKeyUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.DependsOn;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.web.AuthorizationRequestRepository;
import org.springframework.security.oauth2.core.AuthenticationMethod;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;


/**
 * Configuration class for setting up OAuth2 Client support.
 * <p>
 * Defines beans for client registration, authorization request handling,
 * and managing authorized client services/repositories.
 */

@Configuration
@Slf4j
public class OAuth2ClientConfig {

    // Create the properties bean directly in this config
    @Bean
    @Primary
    @ConfigurationProperties(prefix = "bff.oauth2.client")
    public RegistrationProperties registrationProperties() {
        log.info("Creating RegistrationProperties bean with ConfigurationProperties");
        return new RegistrationProperties();
    }


    //----ClientRegistrationRepository Bean----
    @Bean
    @Primary
    @DependsOn({"registrationProperties"})
    public IRedisClientRegistrationRepository clientRegistrationRepository(RegistrationProperties properties, RedisTemplate<String, String> redisTemplate, RedisKeyUtil redisKeyUtil, @Qualifier("defaultObjectMapper") ObjectMapper objectMapper) {

        log.info("OAuth2ClientConfig: Creating client registration repository");
        log.debug("Registration properties: {}", properties.getRegistration().keySet());
        log.debug("Provider properties: {}", properties.getProvider().keySet());

        List<ClientRegistration> registrations = properties.getRegistration().entrySet().stream()
                .map(entry -> buildClientRegistration(entry.getKey(), entry.getValue(), properties))
                .toList();

        log.info("Creating RedisClientRegistrationRepository with {} registrations: {}",
                registrations.size(),
                registrations.stream().map(ClientRegistration::getRegistrationId).toList());

        if (registrations.isEmpty()) {
            log.error("No OAuth2 client registrations found in configuration!");
            log.error("Available registration keys: {}", properties.getRegistration().keySet());
            log.error("Available provider keys: {}", properties.getProvider().keySet());
            throw new IllegalStateException("At least one OAuth2 client registration must be configured");
        }

        return new RedisClientRegistrationRepository(registrations, redisTemplate, redisKeyUtil,  objectMapper);
    }

    private ClientRegistration buildClientRegistration(
            String registrationId,
            RegistrationProperties.Registration regProps,
            RegistrationProperties properties) {

        RegistrationProperties.Provider provider = properties.getProvider().get(regProps.getProvider());
        // Create scopes as UnmodifiableSet to match Spring Security's pattern
        Set<String> scopeSet = regProps.getScope() != null && !regProps.getScope().isEmpty()
                ? Collections.unmodifiableSet(new LinkedHashSet<>(regProps.getScope()))
                : Collections.unmodifiableSet(Collections.emptySet());

        return ClientRegistration.withRegistrationId(registrationId)
                .clientId(regProps.getClientId())
                .clientSecret(regProps.getClientSecret())
                .clientAuthenticationMethod(
                        new ClientAuthenticationMethod(regProps.getClientAuthenticationMethod()))
                .authorizationGrantType(new AuthorizationGrantType(regProps.getAuthorizationGrantType()))
                .redirectUri(regProps.getRedirectUri())
                .scope(scopeSet)
                .clientName(regProps.getClientName())
                .clientSettings(ClientRegistration.ClientSettings.builder()
                        .requireProofKey(regProps.isRequireProofKey())
                        .build())
                // provider details
                .authorizationUri(provider.getAuthorizationUri())
                .tokenUri(provider.getTokenUri())
                .jwkSetUri(provider.getJwkSetUri())
                .issuerUri(provider.getIssuerUri())
                .userInfoUri(provider.getUserInfoUri())
                .userInfoAuthenticationMethod(
                        provider.getUserInfoAuthenticationMethod() != null
                                ? new AuthenticationMethod(provider.getUserInfoAuthenticationMethod())
                                : null)
                .userNameAttributeName(provider.getUserNameAttribute() != null
                        ? provider.getUserNameAttribute()
                        : "sub")
                .build();
    }


    //----AuthorizationRequestRepository Bean----
    @Bean
    public AuthorizationRequestRepository<OAuth2AuthorizationRequest> authorizationRequestRepository(RedisTemplate<String, OAuth2AuthorizationRequest> redisTemplate, RedisKeyUtil redisKeyUtil) {
        return new RedisAuthorizationRequestRepository(redisTemplate, redisKeyUtil);
    }

    //----OAuth2AuthorizedClientService Bean----
    @Bean
    public OAuth2AuthorizedClientService oAuth2AuthorizedClientService( RedisTemplate<String, OAuth2AuthorizedClient> redisTemplate, RedisKeyUtil redisKeyUtil) {
        return new RedisOAuth2AuthorizedClientService(redisTemplate, redisKeyUtil);
    }

    //----OAuth2AuthorizedClientRepository Bean----
//    @Bean
//    public OAuth2AuthorizedClientRepository oAuth2AuthorizedClientRepository(OAuth2AuthorizedClientService oAuth2AuthorizedClientService, RedisTemplate<String, OAuth2AuthorizedClient> redisTemplate, RedisKeyUtil redisKeyUtil, CookieUtil cookieUtil) {
//        return new RedisOAuth2AuthorizedClientRepository(oAuth2AuthorizedClientService, redisTemplate, redisKeyUtil, cookieUtil);
//    }
}