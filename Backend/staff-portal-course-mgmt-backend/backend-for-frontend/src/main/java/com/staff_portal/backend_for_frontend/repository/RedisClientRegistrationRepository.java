package com.staff_portal.backend_for_frontend.repository;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.staff_portal.backend_for_frontend.util.RedisKeyUtil;
import jakarta.annotation.PostConstruct;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistration.ClientSettings;
import org.springframework.security.oauth2.core.AuthenticationMethod;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.util.Assert;

import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;


@Slf4j
public class RedisClientRegistrationRepository implements IRedisClientRegistrationRepository {
    private final Map<String, ClientRegistration> registrations;
    private final RedisTemplate<String, String> redisTemplate;
    private final RedisKeyUtil redisKeyUtil;
    private static final int CLIENT_REGISTRATION_TTL = 86400;
    public final ObjectMapper objectMapper;

    public RedisClientRegistrationRepository(List<ClientRegistration> registrations, RedisTemplate<String, String> redisTemplate, RedisKeyUtil redisKeyUtil, @Qualifier("defaultObjectMapper") ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        Assert.notEmpty(registrations, "registrations cannot be empty");
        Assert.notNull(redisTemplate, "redisTemplate cannot be null");
        Assert.notNull(redisKeyUtil, "redisKeyUtil cannot be null");
        this.registrations = createRegistrationsMap(registrations);
        this.redisTemplate = redisTemplate;
        this.redisKeyUtil = redisKeyUtil;
        log.debug("RedisClientRegistrationRepository initialized with {} registrations", registrations.size());
    }

    private static Map<String, ClientRegistration> createRegistrationsMap(List<ClientRegistration> registrations) {
        Assert.notEmpty(registrations, "registrations cannot be empty");
        return toUnmodifiableConcurrentMap(registrations);
    }

    private static Map<String, ClientRegistration> toUnmodifiableConcurrentMap(List<ClientRegistration> registrations) {
        ConcurrentHashMap<String, ClientRegistration> result = new ConcurrentHashMap<>();
        for (ClientRegistration registration : registrations) {
            Assert.state(!result.containsKey(registration.getRegistrationId()),
                    () -> String.format("Duplicate key %s", registration.getRegistrationId()));
            result.put(registration.getRegistrationId(), registration);
        }
        return Collections.unmodifiableMap(result);
    }

    @PostConstruct
    public void init() {
        log.info("Initializing RedisClientRegistrationRepository with {} registrations", this.registrations.size());
        for (ClientRegistration registration : this.registrations.values()) {
            String registrationId = registration.getRegistrationId();
            try {
                ClientRegistrationData clientRegistrationData = toEntity(registration);
                String key = redisKeyUtil.buildClientRegistrationKey(registrationId);
                String jsonString = objectMapper.writeValueAsString(clientRegistrationData);
                redisTemplate.opsForValue().set(key, jsonString, Duration.ofSeconds(CLIENT_REGISTRATION_TTL));
                log.debug("Initialized client registration in Redis: {}", registrationId);
            } catch (Exception e) {
                log.error("Failed to initialize client registration: {}", registrationId, e);
            }
        }
        log.info("RedisClientRegistrationRepository initialization completed");
    }

    @Override
    public ClientRegistration findByRegistrationId(String registrationId) {
        Assert.hasText(registrationId, "registrationId cannot be empty");
        String key = redisKeyUtil.buildClientRegistrationKey(registrationId);
        try {
            String jsonString = redisTemplate.opsForValue().get(key);
            if (jsonString != null && !jsonString.isEmpty()) {
                ClientRegistrationData registrationData = objectMapper.readValue(jsonString, ClientRegistrationData.class);
                ClientRegistration clientRegistration = fromEntity(registrationData);
                log.debug("Loaded client registration from Redis: {}", registrationId);
                return clientRegistration;
            }
            ClientRegistration registration = this.registrations.get(registrationId);
            if (registration != null) {
                ClientRegistrationData clientRegistrationData = toEntity(registration);
                redisTemplate.opsForValue().set(key, clientRegistrationData.toString(), Duration.ofSeconds(CLIENT_REGISTRATION_TTL));
                log.debug("Cached client registration in Redis: {}", registrationId);
                return registration;
            }
            log.debug("Client registration not found: {}", registrationId);
            return null;
        } catch (Exception e) {
            log.error("Error processing client registration for registrationId: {}", registrationId, e);
            return this.registrations.get(registrationId);
        }
    }

    public void refreshRegistration(String registrationId) {
        try {
            String key = redisKeyUtil.buildClientRegistrationKey(registrationId);
            redisTemplate.delete(key);
            ClientRegistration registration = this.registrations.get(registrationId);
            if (registration != null) {
                String serializedRegistration = objectMapper.writeValueAsString(registration);
                redisTemplate.opsForValue().set(key, serializedRegistration, Duration.ofSeconds(CLIENT_REGISTRATION_TTL));
                log.info("Refreshed client registration in Redis: {}", registrationId);
            }
        } catch (Exception e) {
            log.error("Failed to refresh client registration: {}", registrationId, e);
        }
    }

    @Override
    public Iterator<ClientRegistration> iterator() {
        return this.registrations.values().iterator();
    }

    @Override
    public Set<String> getRegistrationIds() {
        return Collections.unmodifiableSet(this.registrations.keySet());
    }

    private ClientRegistrationData toEntity(ClientRegistration registration) {
        return ClientRegistrationData.builder()
                .registrationId(registration.getRegistrationId())
                .clientId(registration.getClientId())
                .clientSecret(registration.getClientSecret())
                .clientAuthenticationMethod(registration.getClientAuthenticationMethod().getValue())
                .authorizationGrantType(registration.getAuthorizationGrantType().getValue())
                .redirectUri(registration.getRedirectUri())
                .scopes(new LinkedHashSet<>(registration.getScopes()))
                .clientName(registration.getClientName())
                .authorizationUri(registration.getProviderDetails().getAuthorizationUri())
                .tokenUri(registration.getProviderDetails().getTokenUri())
                .userInfoUri(registration.getProviderDetails().getUserInfoEndpoint().getUri())
                .userInfoAuthenticationMethod(registration.getProviderDetails().getUserInfoEndpoint().getAuthenticationMethod().getValue())
                .userNameAttributeName(registration.getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName())
                .jwkSetUri(registration.getProviderDetails().getJwkSetUri())
                .issuerUri(registration.getProviderDetails().getIssuerUri())
                .requireProofKey(registration.getClientSettings().isRequireProofKey())
                .build();
    }

    private ClientRegistration fromEntity(ClientRegistrationData registrationData) {
        return ClientRegistration.withRegistrationId(registrationData.getRegistrationId())
                .clientId(registrationData.getClientId())
                .clientSecret(registrationData.getClientSecret())
                .clientAuthenticationMethod(new ClientAuthenticationMethod(registrationData.getClientAuthenticationMethod()))
                .authorizationGrantType(new AuthorizationGrantType(registrationData.getAuthorizationGrantType()))
                .redirectUri(registrationData.getRedirectUri())
                .scope(registrationData.getScopes().toArray(new String[0]))
                .clientName(registrationData.getClientName())
                .authorizationUri(registrationData.getAuthorizationUri())
                .tokenUri(registrationData.getTokenUri())
                .userInfoUri(registrationData.getUserInfoUri())
                .userInfoAuthenticationMethod(new AuthenticationMethod(registrationData.getUserInfoAuthenticationMethod()))
                .userNameAttributeName(registrationData.getUserNameAttributeName())
                .jwkSetUri(registrationData.getJwkSetUri())
                .issuerUri(registrationData.getIssuerUri())
                .clientSettings(ClientSettings.builder()
                        .requireProofKey(registrationData.isRequireProofKey())
                        .build())
                .build();
    }

    @Builder
    @Setter
    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @ToString
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ClientRegistrationData {
        private String registrationId;
        private String clientId;
        private String clientSecret;
        private String clientAuthenticationMethod;
        private String authorizationGrantType;
        private String redirectUri;
        private Set<String> scopes;
        private String clientName;
        private String authorizationUri;
        private String tokenUri;
        private String userInfoUri;
        private String userInfoAuthenticationMethod;
        private String userNameAttributeName;
        private String jwkSetUri;
        private String issuerUri;
        private boolean requireProofKey;

    }
}