package com.staff_portal.auth_service.service.implementation;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.staff_portal.auth_service.model.oauth2.oauth2registeredclient.*;
import com.staff_portal.auth_service.repository.OAuth2RegisteredClientRepository;
import com.staff_portal.auth_service.service.interfaces.IRegisteredClientService;
import org.springframework.security.jackson2.SecurityJackson2Modules;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.jackson2.OAuth2AuthorizationServerJackson2Module;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class RegisteredClientServiceImpl implements IRegisteredClientService {

    private final OAuth2RegisteredClientRepository clientRepository;
    private final ObjectMapper objectMapper;

    public RegisteredClientServiceImpl(OAuth2RegisteredClientRepository clientRepository) {
        Assert.notNull(clientRepository, "clientRepository cannot be null");
        this.clientRepository = clientRepository;

        this.objectMapper = new ObjectMapper();
        ClassLoader classLoader = RegisteredClientServiceImpl.class.getClassLoader();
        List<Module> securityModules = SecurityJackson2Modules.getModules(classLoader);
        this.objectMapper.registerModules(securityModules);
        this.objectMapper.registerModule(new OAuth2AuthorizationServerJackson2Module());
    }

    @Override
    public void save(RegisteredClient registeredClient) {
        Assert.notNull(registeredClient, "registeredClient cannot be null");
        this.clientRepository.save(toEntity(registeredClient));
    }

    @Override
    @Transactional(readOnly = true)
    public RegisteredClient findById(String id) {
        Assert.hasText(id, "id cannot be empty");
        return this.clientRepository.findById(id)
                .map(this::toObject)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public RegisteredClient findByClientId(String clientId) {
        Assert.hasText(clientId, "clientId cannot be empty");
        return this.clientRepository.findByClientId(clientId)
                .map(this::toObject)
                .orElse(null);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByClientId(String clientId) {
        Assert.hasText(clientId, "clientId cannot be empty");
        return this.clientRepository.existsByClientId(clientId);
    }


    private RegisteredClient toObject(OAuth2RegisteredClientEntity entity) {
        RegisteredClient.Builder builder = RegisteredClient.withId(entity.getId())
                .clientId(entity.getClientId())
                .clientIdIssuedAt(entity.getClientIdIssuedAt())
                .clientSecret(entity.getClientSecret())
                .clientSecretExpiresAt(entity.getClientSecretExpiresAt())
                .clientName(entity.getClientName())
                .clientAuthenticationMethods(authMethods ->
                        entity.getClientAuthenticationMethods().forEach(method ->
                                authMethods.add(resolveClientAuthenticationMethod(method))))
                .authorizationGrantTypes(grantTypes ->
                        entity.getAuthorizationGrantTypes().forEach(grantType ->
                                grantTypes.add(resolveAuthorizationGrantType(grantType))))
                .redirectUris(uris -> uris.addAll(entity.getRedirectUris()))
                .postLogoutRedirectUris(uris -> uris.addAll(entity.getPostLogoutRedirectUris()))
                .scopes(scopes -> scopes.addAll(entity.getScopes()));

        if (entity.getClientSettings() != null) {
            builder.clientSettings(buildClientSettings(entity.getClientSettings()));
        }

        if (entity.getTokenSettings() != null) {
            builder.tokenSettings(buildTokenSettings(entity.getTokenSettings()));
        }

        return builder.build();
    }

    private OAuth2RegisteredClientEntity toEntity(RegisteredClient registeredClient) {
        return OAuth2RegisteredClientEntity.builder()
                .id(registeredClient.getId())
                .clientId(registeredClient.getClientId())
                .clientIdIssuedAt(registeredClient.getClientIdIssuedAt())
                .clientSecret(registeredClient.getClientSecret())
                .clientSecretExpiresAt(registeredClient.getClientSecretExpiresAt())
                .clientName(registeredClient.getClientName())
                .clientAuthenticationMethods(mapClientAuthMethods(registeredClient.getClientAuthenticationMethods()))
                .authorizationGrantTypes(mapAuthorizationGrantTypes(registeredClient.getAuthorizationGrantTypes()))
                .redirectUris(new HashSet<>(registeredClient.getRedirectUris()))
                .postLogoutRedirectUris(new HashSet<>(registeredClient.getPostLogoutRedirectUris()))
                .scopes(new HashSet<>(registeredClient.getScopes()))
                .clientSettings(mapClientSettings(registeredClient.getClientSettings()))
                .tokenSettings(mapTokenSettings(registeredClient.getTokenSettings()))
                .active(true)
                .build();
    }

    private Set<ClientAuthenticationMethod> mapClientAuthMethods(Set<org.springframework.security.oauth2.core.ClientAuthenticationMethod> methods) {
        return methods.stream()
                .map(method -> ClientAuthenticationMethod.valueOf(method.getValue().toUpperCase().replace("-", "_")))
                .collect(Collectors.toSet());
    }

    private Set<AuthorizationGrantType> mapAuthorizationGrantTypes(Set<org.springframework.security.oauth2.core.AuthorizationGrantType> types) {
        return types.stream()
                .map(type -> {
                    try {
                        return AuthorizationGrantType.valueOf(type.getValue().toUpperCase().replace("-", "_").replace(":", "_").replace(".", "_"));
                    } catch (IllegalArgumentException e) {
                        return AuthorizationGrantType.AUTHORIZATION_CODE; // fallback
                    }
                })
                .collect(Collectors.toSet());
    }

    private ClientSettings mapClientSettings(org.springframework.security.oauth2.server.authorization.settings.ClientSettings settings) {
        return ClientSettings.builder()
                .requireProofKey(settings.isRequireProofKey())
                .requireAuthorizationConsent(settings.isRequireAuthorizationConsent())
                .jwkSetUrl(settings.getJwkSetUrl())
                .tokenEndpointAuthenticationSigningAlgorithm(mapSignatureAlgorithm((org.springframework.security.oauth2.jose.jws.SignatureAlgorithm) settings.getTokenEndpointAuthenticationSigningAlgorithm()))
                .build();
    }

    private TokenSettings mapTokenSettings(org.springframework.security.oauth2.server.authorization.settings.TokenSettings settings) {
        return TokenSettings.builder()
                .authorizationCodeTimeToLive(settings.getAuthorizationCodeTimeToLive())
                .accessTokenTimeToLive(settings.getAccessTokenTimeToLive())
                .accessTokenFormat(mapTokenFormat(settings.getAccessTokenFormat()))
                .reuseRefreshTokens(settings.isReuseRefreshTokens())
                .refreshTokenTimeToLive(settings.getRefreshTokenTimeToLive())
                .idTokenSignatureAlgorithm(mapSignatureAlgorithm(settings.getIdTokenSignatureAlgorithm()))
                .build();
    }

    private OAuth2TokenFormat mapTokenFormat(org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat format) {
        return format.getValue().equals("self-contained") ?
                OAuth2TokenFormat.SELF_CONTAINED : OAuth2TokenFormat.REFERENCE;
    }

    private SignatureAlgorithm mapSignatureAlgorithm(org.springframework.security.oauth2.jose.jws.SignatureAlgorithm algorithm) {
        return SignatureAlgorithm.valueOf(algorithm.getName());
    }

    private org.springframework.security.oauth2.server.authorization.settings.ClientSettings buildClientSettings(ClientSettings settings) {
        return org.springframework.security.oauth2.server.authorization.settings.ClientSettings.builder()
                .requireProofKey(settings.isRequireProofKey())
                .requireAuthorizationConsent(settings.isRequireAuthorizationConsent())
//                .jwkSetUrl(settings.getJwkSetUrl())
                .build();
    }

    private org.springframework.security.oauth2.server.authorization.settings.TokenSettings buildTokenSettings(TokenSettings settings) {
        return org.springframework.security.oauth2.server.authorization.settings.TokenSettings.builder()
                .authorizationCodeTimeToLive(settings.getAuthorizationCodeTimeToLive())
                .accessTokenTimeToLive(settings.getAccessTokenTimeToLive())
                .accessTokenFormat(buildTokenFormat(settings.getAccessTokenFormat()))
//                .deviceCodeTimeToLive(settings.getDeviceCodeTimeToLive())
                .reuseRefreshTokens(settings.isReuseRefreshTokens())
                .refreshTokenTimeToLive(settings.getRefreshTokenTimeToLive())
//                .idTokenSignatureAlgorithm(buildSignatureAlgorithm(settings.getIdTokenSignatureAlgorithm()))
                .build();
    }

    private org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat buildTokenFormat(OAuth2TokenFormat format) {
        return format == OAuth2TokenFormat.SELF_CONTAINED ?
                org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat.SELF_CONTAINED :
                org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat.REFERENCE;
    }

    private org.springframework.security.oauth2.jose.jws.SignatureAlgorithm buildSignatureAlgorithm(SignatureAlgorithm algorithm) {
        return org.springframework.security.oauth2.jose.jws.SignatureAlgorithm.from(algorithm.getName());
    }

    private static org.springframework.security.oauth2.core.AuthorizationGrantType resolveAuthorizationGrantType(AuthorizationGrantType grantType) {
        if (grantType == AuthorizationGrantType.AUTHORIZATION_CODE) {
            return org.springframework.security.oauth2.core.AuthorizationGrantType.AUTHORIZATION_CODE;
        } else if (grantType == AuthorizationGrantType.CLIENT_CREDENTIALS) {
            return org.springframework.security.oauth2.core.AuthorizationGrantType.CLIENT_CREDENTIALS;
        } else if (grantType == AuthorizationGrantType.REFRESH_TOKEN) {
            return org.springframework.security.oauth2.core.AuthorizationGrantType.REFRESH_TOKEN;
        } else if (grantType == AuthorizationGrantType.DEVICE_CODE) {
            return org.springframework.security.oauth2.core.AuthorizationGrantType.DEVICE_CODE;
        }
        return new org.springframework.security.oauth2.core.AuthorizationGrantType(grantType.getValue());
    }

    private static org.springframework.security.oauth2.core.ClientAuthenticationMethod resolveClientAuthenticationMethod(ClientAuthenticationMethod method) {
        if (method == ClientAuthenticationMethod.CLIENT_SECRET_BASIC) {
            return org.springframework.security.oauth2.core.ClientAuthenticationMethod.CLIENT_SECRET_BASIC;
        } else if (method == ClientAuthenticationMethod.CLIENT_SECRET_POST) {
            return org.springframework.security.oauth2.core.ClientAuthenticationMethod.CLIENT_SECRET_POST;
        } else if (method == ClientAuthenticationMethod.CLIENT_SECRET_JWT) {
            return org.springframework.security.oauth2.core.ClientAuthenticationMethod.CLIENT_SECRET_JWT;
        } else if (method == ClientAuthenticationMethod.PRIVATE_KEY_JWT) {
            return org.springframework.security.oauth2.core.ClientAuthenticationMethod.PRIVATE_KEY_JWT;
        } else if (method == ClientAuthenticationMethod.NONE) {
            return org.springframework.security.oauth2.core.ClientAuthenticationMethod.NONE;
        }
        return new org.springframework.security.oauth2.core.ClientAuthenticationMethod(method.getValue());
    }
}