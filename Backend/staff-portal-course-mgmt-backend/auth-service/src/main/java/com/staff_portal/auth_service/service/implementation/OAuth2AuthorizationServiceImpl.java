package com.staff_portal.auth_service.service.implementation;

import com.staff_portal.auth_service.model.oauth2.oauth2authorization.*;
import com.staff_portal.auth_service.repository.AuthUserRepository;
import com.staff_portal.auth_service.repository.OAuth2AuthorizationRepository;
import com.staff_portal.auth_service.security.CustomUserDetails;
import com.staff_portal.auth_service.service.interfaces.IOAuth2AuthorizationService;
import com.staff_portal.auth_service.service.interfaces.IRegisteredClientService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataRetrievalFailureException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.*;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.oidc.endpoint.OidcParameterNames;
import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationCode;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;

import java.security.Principal;
import java.time.Instant;
import java.util.*;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class OAuth2AuthorizationServiceImpl implements IOAuth2AuthorizationService {

    private final OAuth2AuthorizationRepository authorizationRepository;
    private final IRegisteredClientService registeredClientService;
    private final AuthUserRepository authUserRepository;

    public OAuth2AuthorizationServiceImpl(OAuth2AuthorizationRepository authorizationRepository, IRegisteredClientService registeredClientService, AuthUserRepository authUserRepository) {
        this.authorizationRepository = authorizationRepository;
        this.registeredClientService = registeredClientService;
        this.authUserRepository = authUserRepository;
    }


    @Override
    public void save(OAuth2Authorization authorization) {
        Assert.notNull(authorization, "authorization cannot be null");
        this.authorizationRepository.save(toEntity(authorization));
    }

    @Override
    public void remove(OAuth2Authorization authorization) {
        Assert.notNull(authorization, "authorization cannot be null");
        this.authorizationRepository.deleteById(authorization.getId());
    }

    @Override
    public OAuth2Authorization findById(String id) {
        Assert.hasText(id, "id cannot be empty");
        return this.authorizationRepository.findById(id).map(this::toObject).orElse(null);
    }

    @Override
    public OAuth2Authorization findByToken(String token, OAuth2TokenType tokenType) {
        Assert.hasText(token, "token cannot be empty");
        Optional<OAuth2AuthorizationEntity> result;
        if (tokenType == null) {
            result = this.authorizationRepository.findByStateOrAuthorizationCodeValueOrAccessTokenValueOrRefreshTokenValueOrOidcIdTokenValueOrUserCodeValueOrDeviceCodeValue(token);
        } else if (OAuth2ParameterNames.STATE.equals(tokenType.getValue())) {
            result = this.authorizationRepository.findByState(token);
        } else if (OAuth2ParameterNames.CODE.equals(tokenType.getValue())) {
            result = this.authorizationRepository.findByAuthorizationCodeValue(token);
        } else if (OAuth2ParameterNames.ACCESS_TOKEN.equals(tokenType.getValue())) {
            result = this.authorizationRepository.findByAccessTokenValue(token);
        } else if (OAuth2ParameterNames.REFRESH_TOKEN.equals(tokenType.getValue())) {
            result = this.authorizationRepository.findByRefreshTokenValue(token);
        } else if (OidcParameterNames.ID_TOKEN.equals(tokenType.getValue())) {
            result = this.authorizationRepository.findByOidcIdTokenValue(token);
        } else if (OAuth2ParameterNames.USER_CODE.equals(tokenType.getValue())) {
            result = this.authorizationRepository.findByUserCodeValue(token);
        } else if (OAuth2ParameterNames.DEVICE_CODE.equals(tokenType.getValue())) {
            result = this.authorizationRepository.findByDeviceCodeValue(token);
        } else {
            result = Optional.empty();
        }
        return result.map(this::toObject).orElse(null);
    }

    private OAuth2Authorization toObject(OAuth2AuthorizationEntity entity) {
        RegisteredClient registeredClient = this.registeredClientService.findById(entity.getRegisteredClientId());
        if (registeredClient == null) {
            throw new DataRetrievalFailureException(
                    "The RegisteredClient with id '" + entity.getRegisteredClientId() + "' was not found in the RegisteredClientRepository.");
        }

        OAuth2Authorization.Builder builder = OAuth2Authorization.withRegisteredClient(registeredClient)
                .id(entity.getId())
                .principalName(entity.getPrincipalName())
                .authorizationGrantType(resolveAuthorizationGrantType(entity.getAuthorizationGrantType().getValue()))
                .authorizedScopes(entity.getAuthorizedScopes());

        // Add AuthorizationCode Token
        if (entity.getOauth2AuthorizationCode() != null) {
            OAuth2AuthorizationCode authorizationCode = new OAuth2AuthorizationCode(
                    entity.getOauth2AuthorizationCode().getAuthorizationCode().getTokenValue(),
                    entity.getOauth2AuthorizationCode().getAuthorizationCode().getIssuedAt(),
                    entity.getOauth2AuthorizationCode().getAuthorizationCode().getExpiresAt()
            );
            builder.token(authorizationCode, metadata -> metadata.putAll(entity.getOauth2AuthorizationCode().getMetadata()));
        }

        // Add Access Token
        if (entity.getOauth2AccessToken() != null) {
            OAuth2AccessToken.TokenType tokenType = OAuth2AccessToken.TokenType.BEARER;
            if (entity.getOauth2AccessToken().getTokenType() != null) {
                tokenType = new OAuth2AccessToken.TokenType(entity.getOauth2AccessToken().getTokenType().getValue());
            }
            OAuth2AccessToken accessToken = new OAuth2AccessToken(
                    tokenType,
                    entity.getOauth2AccessToken().getAccessToken().getTokenValue(),
                    entity.getOauth2AccessToken().getAccessToken().getIssuedAt(),
                    entity.getOauth2AccessToken().getAccessToken().getExpiresAt(),
                    entity.getOauth2AccessToken().getScopes()
            );
            Map<String, Object> accessTokenMetadata = normalizeMetadataFromDb(entity.getOauth2AccessToken().getMetadata());
            builder.token(accessToken, metadata -> metadata.putAll(accessTokenMetadata));
        }

        // Add Refresh Token
        if (entity.getOauth2RefreshToken() != null) {
            OAuth2RefreshToken refreshToken = new OAuth2RefreshToken(
                    entity.getOauth2RefreshToken().getRefreshToken().getTokenValue(),
                    entity.getOauth2RefreshToken().getRefreshToken().getIssuedAt(),
                    entity.getOauth2RefreshToken().getRefreshToken().getExpiresAt()
            );
            builder.token(refreshToken, metadata -> metadata.putAll(entity.getOauth2RefreshToken().getMetadata()));
        }

        // Add OIDC ID Token
        if (entity.getOidcIdToken() != null) {
            Map<String, Object> idTokenClaims = normalizeMetadataFromDb(entity.getOidcIdToken().getClaims());
            OidcIdToken idToken = new OidcIdToken(
                    entity.getOidcIdToken().getOidcIdToken().getTokenValue(),
                    entity.getOidcIdToken().getOidcIdToken().getIssuedAt(),
                    entity.getOidcIdToken().getOidcIdToken().getExpiresAt(),
                    idTokenClaims
            );
            Map<String, Object> idTokenMetadata = normalizeMetadataFromDb(entity.getOidcIdToken().getMetadata());

            builder.token(idToken, metadata -> metadata.putAll(idTokenMetadata));
        }

        // Add Device Code
        if (entity.getDeviceCode() != null) {
            OAuth2DeviceCode deviceCode = new OAuth2DeviceCode(
                    entity.getDeviceCode().getDeviceCode().getTokenValue(),
                    entity.getDeviceCode().getDeviceCode().getIssuedAt(),
                    entity.getDeviceCode().getDeviceCode().getExpiresAt()
            );
            builder.token(deviceCode, metadata -> metadata.putAll(entity.getDeviceCode().getMetadata()));
        }

        // Add User Code
        if (entity.getUserCode() != null) {
            OAuth2UserCode userCode = new OAuth2UserCode(
                    entity.getUserCode().getUserCode().getTokenValue(),
                    entity.getUserCode().getUserCode().getIssuedAt(),
                    entity.getUserCode().getUserCode().getExpiresAt()
            );
            builder.token(userCode, metadata -> metadata.putAll(entity.getUserCode().getMetadata()));
        }
        handleAttributesToObject(entity, builder);
        OAuth2Authorization build = builder.build();
        return build;
    }

    private void handleAttributesToObject(OAuth2AuthorizationEntity entity, OAuth2Authorization.Builder builder) {
        Map<String, Object> attributes = entity.getAttributes();
        if (attributes == null) {
            return;
        }
        // Handle OAuth2AuthorizationRequest

        Object authRequestObj = attributes.get(OAuth2AuthorizationRequest.class.getName());
        if (authRequestObj instanceof Map<?, ?> requestMap) {
            OAuth2AuthorizationRequest authRequest = OAuth2AuthorizationRequest.authorizationCode()
                    .authorizationUri((String) requestMap.get("authorizationUri"))
                    .clientId((String) requestMap.get("clientId"))
                    .redirectUri((String) requestMap.get("redirectUri"))
//                    .scopes(new HashSet<>(Arrays.asList((String) requestMap.get("scope"))))
                    .scopes(new HashSet<>((Collection<String>) requestMap.get("scopes")))
                    .state((String) requestMap.get("state"))
                    .authorizationRequestUri((String) requestMap.get("authorizationRequestUri"))
                    .additionalParameters((Map<String, Object>) requestMap.get("additionalParameters"))
                    .attributes(attr -> attr.putAll((Map<String, Object>) requestMap.get("attributes")))
                    .build();
            builder.attribute(OAuth2AuthorizationRequest.class.getName(), authRequest);
        }


        // Handle Principal
        Object principalObj = attributes.get(Principal.class.getName());
        if (principalObj instanceof Map<?, ?> principalData) {
            Object principalPrincipalObj = principalData.get(CustomUserDetails.class.getName());
            if (principalPrincipalObj instanceof Map<?, ?> userDetailsMap) {
                CustomUserDetails userDetails = CustomUserDetails.builder()
                        .id(UUID.fromString((String) userDetailsMap.get("userId")))
                        .username((String) userDetailsMap.get("username"))
                        .firstName((String) userDetailsMap.get("firstName"))
                        .build();
                authUserRepository.flush();
                @SuppressWarnings("unchecked")
                Set<String> authorities = new HashSet<>((Collection<String>) userDetailsMap.get("authorities"));
                if (authorities != null) {
                    userDetails.setAuthorities(authorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toCollection(HashSet::new)));
                }
                Object detailsData = principalData.get("details");
                WebAuthenticationDetails webAuthenticationDetails = null;
                if (detailsData instanceof Map<?, ?> webAuthDetails) {
                    webAuthenticationDetails = new WebAuthenticationDetails((String) webAuthDetails.get("remoteAddress"),
                            (String) webAuthDetails.get("sessionId")
                    );
                }
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                );
                if (webAuthenticationDetails != null) {
                    authToken.setDetails(webAuthenticationDetails);
                }
                builder.attribute(Principal.class.getName(), authToken);
            }
        }

        // Handle State
        if (entity.getState() != null) {
            builder.attribute("state", entity.getState());
        }
        // Add any other attributes
        attributes.forEach((key, value) -> {
            if (!key.equals(OAuth2AuthorizationRequest.class.getName()) &&
                    !key.equals(Principal.class.getName()) &&
                    !key.equals("state")) {
                builder.attribute(key, value);
            }
        });
    }

    private OAuth2AuthorizationEntity toEntity(OAuth2Authorization authorization) {
        OAuth2AuthorizationEntity entity = this.authorizationRepository.findById(authorization.getId())
                .orElseGet(() -> OAuth2AuthorizationEntity.builder()
                        .id(authorization.getId())
                        .build());

        // Common fields update
        entity.setRegisteredClientId(authorization.getRegisteredClientId());
        entity.setPrincipalName(authorization.getPrincipalName());
        entity.setAuthorizationGrantType(
                com.staff_portal.auth_service.model.oauth2.oauth2authorization.AuthorizationGrantType.fromValue(authorization.getAuthorizationGrantType().getValue()));
        entity.setAuthorizedScopes(authorization.getAuthorizedScopes());
        entity.setState(authorization.getAttribute(OAuth2ParameterNames.STATE));

//        OAuth2Authorization.Token<OAuth2AuthorizationCode> token = authorization.getToken(OAuth2AuthorizationCode.class);
        processOAuth2Tokens(entity, authorization.getToken(OAuth2AuthorizationCode.class),
                entity::setOauth2AuthorizationCode, entity::getOauth2AuthorizationCode,
                this::createTokenEntity);

        processOAuth2Tokens(entity, authorization.getToken(OAuth2AccessToken.class),
                entity::setOauth2AccessToken, entity::getOauth2AccessToken,
                this::createTokenEntity);

        processOAuth2Tokens(entity, authorization.getToken(OidcIdToken.class),
                entity::setOidcIdToken, entity::getOidcIdToken,
                this::createTokenEntity);

        processOAuth2Tokens(entity, authorization.getToken(OAuth2RefreshToken.class),
                entity::setOauth2RefreshToken, entity::getOauth2RefreshToken,
                this::createTokenEntity);

        processOAuth2Tokens(entity, authorization.getToken(OAuth2DeviceCode.class),
                entity::setDeviceCode, entity::getDeviceCode,
                this::createTokenEntity);

        processOAuth2Tokens(entity, authorization.getToken(OAuth2UserCode.class),
                entity::setUserCode, entity::getUserCode,
                this::createTokenEntity);

        handleOAuth2AuthorizationAttributesToEntity(authorization, entity);
        return entity;
    }

    private <T extends OAuth2Token, E> void processOAuth2Tokens(
            OAuth2AuthorizationEntity entity,
            OAuth2Authorization.Token<T> generatedToken,
            Consumer<E> entityTokenSetter,
            Supplier<E> entityTokenGetter,
            TokenEntityCreator<T, E> tokenEntityCreator) {

        Optional.ofNullable(generatedToken)
                .ifPresent(token -> {
                    Optional<E> existingTokenOpt = Optional.ofNullable(entityTokenGetter.get());

                    existingTokenOpt
                            .filter(existing -> !areTokensEqual(existing, token))
                            .ifPresent(this::invalidateExistingToken);

                    E tokenEntity = existingTokenOpt
                            .filter(existing -> areTokensEqual(existing, token))
                            .filter(existing -> isAuthorizationCode(token))
                            .map(existing -> updateExistingTokenEntity(existing, token))
                            .orElseGet(() -> tokenEntityCreator.create(token, entity));

                    entityTokenSetter.accept(tokenEntity);
                });
    }

    private <T extends OAuth2Token, E> boolean areTokensEqual(E existingTokenEntity, OAuth2Authorization.Token<T> generatedToken) {
        return extractTokenValue(existingTokenEntity)
                .map(existingValue -> existingValue.equals(generatedToken.getToken().getTokenValue()))
                .orElse(false);
    }

    private <E> Optional<String> extractTokenValue(E tokenEntity) {
        return switch (tokenEntity) {
            case OAuth2AuthorizationCodeEntity authCode -> Optional.ofNullable(authCode.getAuthorizationCode())
                    .map(Token::getTokenValue);
            case OAuth2AccessTokenEntity accessToken -> Optional.ofNullable(accessToken.getAccessToken())
                    .map(Token::getTokenValue);
            case OidcIdTokenEntity oidcToken -> Optional.ofNullable(oidcToken.getOidcIdToken())
                    .map(Token::getTokenValue);
            case OAuth2RefreshTokenEntity refreshToken -> Optional.ofNullable(refreshToken.getRefreshToken())
                    .map(Token::getTokenValue);
            case OAuth2DeviceCodeEntity deviceCode -> Optional.ofNullable(deviceCode.getDeviceCode())
                    .map(Token::getTokenValue);
            case OAuth2UserCodeEntity userCode -> Optional.ofNullable(userCode.getUserCode())
                    .map(Token::getTokenValue);
            default -> Optional.empty();
        };
    }

    private <T extends OAuth2Token> boolean isAuthorizationCode(OAuth2Authorization.Token<T> token) {
        return token.getToken() instanceof OAuth2AuthorizationCode;
    }

    private <E> void invalidateExistingToken(E existingTokenEntity) {
        extractMetadata(existingTokenEntity)
                .ifPresent(metadata -> {
                    Map<String, Object> tokenMetadata = Optional.ofNullable((Map<String, Object>) metadata.get("token"))
                            .orElseGet(() -> {
                                Map<String, Object> newTokenMetadata = new HashMap<>();
                                metadata.put("token", newTokenMetadata);
                                return newTokenMetadata;
                            });
                    tokenMetadata.put("invalidated", true);
                });
    }

    private <E> Optional<Map<String, Object>> extractMetadata(E tokenEntity) {
        return switch (tokenEntity) {
            case OAuth2AuthorizationCodeEntity authCode -> Optional.ofNullable(authCode.getMetadata());
            case OAuth2AccessTokenEntity accessToken -> Optional.ofNullable(accessToken.getMetadata());
            case OidcIdTokenEntity oidcToken -> Optional.ofNullable(oidcToken.getMetadata());
            case OAuth2RefreshTokenEntity refreshToken -> Optional.ofNullable(refreshToken.getMetadata());
            case OAuth2DeviceCodeEntity deviceCode -> Optional.ofNullable(deviceCode.getMetadata());
            case OAuth2UserCodeEntity userCode -> Optional.ofNullable(userCode.getMetadata());
            default -> Optional.empty();
        };
    }

    private <T extends OAuth2Token, E> E updateExistingTokenEntity(E existingTokenEntity, OAuth2Authorization.Token<T> token) {
        updateTokenMetadata(existingTokenEntity, token.getMetadata());
        return existingTokenEntity;
    }

    private <E> void updateTokenMetadata(E tokenEntity, Map<String, Object> newMetadata) {
        extractMetadata(tokenEntity)
                .ifPresent(existingMetadata -> {
                    existingMetadata.clear();
                    existingMetadata.putAll(newMetadata);
                });
    }

    private <T extends OAuth2Token, E> E createTokenEntity(
            OAuth2Authorization.Token<T> token,
            OAuth2AuthorizationEntity parentEntity) {

        Token commonToken = createTokenFromOAuth2Token(token);
//        Map<String, Object> metadata = new HashMap<>(token.getMetadata());
        Map<String, Object> metadata = new HashMap<>(normalizeMetadataForSave(token.getMetadata()));
        Map<String, Object> idTokenClaims = new HashMap<>(normalizeMetadataForSave(token.getClaims()));

        return (E) switch (token.getToken()) {
            case OAuth2AuthorizationCode authCode -> OAuth2AuthorizationCodeEntity.builder()
                    .authorizationCode(commonToken)
                    .metadata(metadata)
                    .build();

            case OAuth2AccessToken accessToken -> {
                OAuth2AccessTokenEntity.OAuth2AccessTokenEntityBuilder builder = OAuth2AccessTokenEntity.builder()
                        .accessToken(commonToken)
                        .metadata(metadata);

                // Add access token specific properties
                Optional.ofNullable(accessToken.getTokenType())
                        .ifPresent(tokenType -> builder.tokenType(TokenType.valueOf(tokenType.getValue().toUpperCase())));
                Optional.ofNullable(accessToken.getScopes())
                        .ifPresent(scopes -> builder.scopes(new HashSet<>(scopes)));

                yield builder.build();
            }

            case OidcIdToken oidcIdToken -> {
                OidcIdTokenEntity.OidcIdTokenEntityBuilder builder = OidcIdTokenEntity.builder()
                        .oidcIdToken(commonToken)
                        .metadata(metadata);

                // Add OIDC ID token specific properties
                Optional.ofNullable(oidcIdToken.getClaims())
                        .ifPresent(claims -> builder.claims(idTokenClaims));

                yield builder.build();
            }

            case OAuth2RefreshToken refreshToken -> OAuth2RefreshTokenEntity.builder()
                    .refreshToken(commonToken)
                    .metadata(metadata)
                    .build();

            case OAuth2DeviceCode deviceCode -> OAuth2DeviceCodeEntity.builder()
                    .deviceCode(commonToken)
                    .metadata(metadata)
                    .build();

            case OAuth2UserCode userCode -> OAuth2UserCodeEntity.builder()
                    .userCode(commonToken)
                    .metadata(metadata)
                    .build();

            default -> throw new IllegalArgumentException("Unsupported token type: " + token.getToken().getClass());
        };
    }

    private <T extends OAuth2Token> Token createTokenFromOAuth2Token(OAuth2Authorization.Token<T> oAuth2Token) {
        return Token.builder()
                .tokenValue(oAuth2Token.getToken().getTokenValue())
                .issuedAt(oAuth2Token.getToken().getIssuedAt())
                .expiresAt(oAuth2Token.getToken().getExpiresAt())
                .build();
    }

    @FunctionalInterface
    private interface TokenEntityCreator<T extends OAuth2Token, E> {
        E create(OAuth2Authorization.Token<T> token, OAuth2AuthorizationEntity parentEntity);
    }

    private void handleOAuth2AuthorizationAttributesToEntity(OAuth2Authorization authorization, OAuth2AuthorizationEntity oAuth2AuthorizationEntity) {

        Map<String, Object> attributes = new HashMap<>();

        // Handle OAuth2AuthorizationRequest
        OAuth2AuthorizationRequest authRequest = authorization.getAttribute(OAuth2AuthorizationRequest.class.getName());
        if (authRequest != null) {
            Map<String, Object> requestData = new HashMap<>();
            requestData.put("authorizationUri", authRequest.getAuthorizationUri());
            requestData.put("authorizationGrantType", com.staff_portal.auth_service.model.oauth2.oauth2authorization.AuthorizationGrantType.fromValue(authRequest.getGrantType().getValue()));
            requestData.put("responseType", authRequest.getResponseType().getValue());
            requestData.put("clientId", authRequest.getClientId());
            requestData.put("redirectUri", authRequest.getRedirectUri());
            requestData.put("scopes", new HashSet<>(authRequest.getScopes()));
            requestData.put("state", authRequest.getState());
            requestData.put("authorizationRequestUri", authRequest.getAuthorizationRequestUri());
            requestData.put("additionalParameters", new HashMap<>(authRequest.getAdditionalParameters()));
            requestData.put("attributes", new HashMap<>(authRequest.getAttributes()));

            attributes.put(OAuth2AuthorizationRequest.class.getName(), requestData);
        }

        Principal principal = authorization.getAttribute(Principal.class.getName());
        if (principal instanceof UsernamePasswordAuthenticationToken authToken) {
            if (authToken.getPrincipal() instanceof CustomUserDetails userDetails) {
                Map<String, Object> principalData = new HashMap<>();
                principalData.put("username", userDetails.getUsername());
                principalData.put("userId", userDetails.getId());
                principalData.put("firstName", userDetails.getFirstName());
                principalData.put("authorities", userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toSet()));
                principalData.put("accountNonExpired", userDetails.isAccountNonExpired());
                principalData.put("accountNonLocked", userDetails.isAccountNonLocked());
                principalData.put("credentialsNonExpired", userDetails.isCredentialsNonExpired());
                principalData.put("enabled", userDetails.isEnabled());

                Map<String, Object> authTokenData = new HashMap<>();
                authTokenData.put(CustomUserDetails.class.getName(), principalData);
                authTokenData.put("authenticated", authToken.isAuthenticated());

                if (authToken.getDetails() instanceof WebAuthenticationDetails webDetails) {
                    Map<String, Object> detailsData = new HashMap<>();
                    detailsData.put("remoteAddress", webDetails.getRemoteAddress());
                    detailsData.put("sessionId", webDetails.getSessionId());
                    authTokenData.put("details", detailsData);
                }

                attributes.put(Principal.class.getName(), authTokenData);
            }
        }

        // handle other attributes that are not specifically handled
        authorization.getAttributes().forEach((key, value) -> {
            if (!key.equals(OAuth2AuthorizationRequest.class.getName()) &&
                    !key.equals(Principal.class.getName()) &&
                    !key.equals("state") &&
                    isJsonSerializable(value)
            ) {
                attributes.put(key, value);
            }
        });
        oAuth2AuthorizationEntity.setAttributes(attributes);
    }

    private static AuthorizationGrantType resolveAuthorizationGrantType(String authorizationGrantType) {
        if (AuthorizationGrantType.AUTHORIZATION_CODE.getValue().equals(authorizationGrantType)) {
            return AuthorizationGrantType.AUTHORIZATION_CODE;
        } else if (AuthorizationGrantType.CLIENT_CREDENTIALS.getValue().equals(authorizationGrantType)) {
            return AuthorizationGrantType.CLIENT_CREDENTIALS;
        } else if (AuthorizationGrantType.REFRESH_TOKEN.getValue().equals(authorizationGrantType)) {
            return AuthorizationGrantType.REFRESH_TOKEN;
        } else if (AuthorizationGrantType.DEVICE_CODE.getValue().equals(authorizationGrantType)) {
            return AuthorizationGrantType.DEVICE_CODE;
        }
        return new AuthorizationGrantType(authorizationGrantType);              // Custom authorization grant type
    }

//    private void updateTokenEntity(Token existingToken, OAuth2Authorization.Token<?> newTokenData) {
//        if (newTokenData == null || newTokenData.getToken() == null) {
//            return;
//        }
//
//        OAuth2Token oAuth2Token = newTokenData.getToken();
//        existingToken.setTokenValue(oAuth2Token.getTokenValue());
//        existingToken.setIssuedAt(oAuth2Token.getIssuedAt());
//        existingToken.setExpiresAt(oAuth2Token.getExpiresAt());
//    }

    private boolean isJsonSerializable(Object value) {
        if (value == null) {
            return true;
        }

        // Check for primitive types and their wrappers
        if (value instanceof String || value instanceof Number || value instanceof Boolean) {
            return true;
        }

        // Check for basic collections containing serializable types
        if (value instanceof Map || value instanceof Collection) {
            return true; // Let Jackson handle the serialization
        }

        // Exclude complex Spring Security objects
        if (value.getClass().getName().startsWith("org.springframework.security")) {
            return false;
        }

        // For other objects, attempt serialization check (optional)
        return true;
    }

    private Map<String, Object> normalizeMetadataForSave(Map<String, Object> metadata) {
        if (metadata == null) return Map.of();
        return metadata.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> normalizeValueForSave(e.getKey(), e.getValue())
                ));
    }

    private Object normalizeValueForSave(String key, Object value) {
        switch (value) {
            case null -> {
                return null;
            }
            case Instant instant -> {
                return instant.getEpochSecond();
            }
            case Number number -> {
                long epoch = number.longValue();
                return epoch;
            }
            case Map map -> {
                Map<String, Object> m = (Map<String, Object>) value;
                return m.entrySet().stream()
                        .collect(Collectors.toMap(Map.Entry::getKey, e -> normalizeValueForSave(e.getKey(), e.getValue())));
            }
            default -> {
            }
        }
        return value;
    }

    private Map<String, Object> normalizeMetadataFromDb(Map<String, Object> metadata) {
        if (metadata == null) return Map.of();
        return metadata.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, e -> normalizeValueFromDb(e.getKey(), e.getValue())));
    }

    private Object normalizeValueFromDb(String key, Object value) {
        if (value == null) return null;
        if (value instanceof Instant) return value;
        if (value instanceof Number) {
            String lowerKey = key == null ? "" : key.toLowerCase();
            if (lowerKey.matches(".*(iat|exp|nbf|issued|expires|at|time).*")) {
                long epoch = ((Number) value).longValue();
                return Instant.ofEpochSecond(epoch);
            }
            return ((Number) value).longValue();
        }
        if (value instanceof Map) {
            Map<String, Object> m = (Map<String, Object>) value;
            return m.entrySet().stream()
                    .collect(Collectors.toMap(Map.Entry::getKey, en -> normalizeValueFromDb(en.getKey(), en.getValue())));
        }
        return value;
    }
}