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
import org.springframework.util.StringUtils;

import java.security.Principal;
import java.util.*;
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
            Set<String> scopes = Collections.singleton(StringUtils.collectionToDelimitedString(entity.getOauth2AccessToken().getScopes(), ","));
            OAuth2AccessToken accessToken = new OAuth2AccessToken(
                    tokenType,
                    entity.getOauth2AccessToken().getAccessToken().getTokenValue(),
                    entity.getOauth2AccessToken().getAccessToken().getIssuedAt(),
                    entity.getOauth2AccessToken().getAccessToken().getExpiresAt(),
                    scopes
            );
            builder.token(accessToken, metadata -> metadata.putAll(entity.getOauth2AccessToken().getMetadata()));
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
            OidcIdToken idToken = new OidcIdToken(
                    entity.getOidcIdToken().getOidcIdToken().getTokenValue(),
                    entity.getOidcIdToken().getOidcIdToken().getIssuedAt(),
                    entity.getOidcIdToken().getOidcIdToken().getExpiresAt(),
                    entity.getOidcIdToken().getClaims()
            );
            builder.token(idToken, metadata -> metadata.putAll(entity.getOidcIdToken().getMetadata()));
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
                    .state(entity.getState())
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
        // find existing entity
        Optional<OAuth2AuthorizationEntity> existingEntityOpt = this.authorizationRepository.findById(authorization.getId());
        OAuth2AuthorizationEntity entity;
        OAuth2AuthorizationRequest authRequest = authorization.getAttribute(OAuth2AuthorizationRequest.class.getName());
        assert authRequest != null;
        if(existingEntityOpt.isPresent()) {
            entity = existingEntityOpt.get();
            entity.setRegisteredClientId(authorization.getRegisteredClientId());
            entity.setPrincipalName(authorization.getPrincipalName());
            entity.setAuthorizationGrantType(com.staff_portal.auth_service.model.oauth2.oauth2authorization.AuthorizationGrantType.fromValue(authorization.getAuthorizationGrantType().getValue()));
            entity.setAuthorizedScopes(authorization.getAuthorizedScopes());
            entity.setState(authRequest.getState());
        } else {
            entity = OAuth2AuthorizationEntity.builder()
                    .id(authorization.getId())
                    .registeredClientId(authorization.getRegisteredClientId())
                    .principalName(authorization.getPrincipalName())
                    .authorizationGrantType(com.staff_portal.auth_service.model.oauth2.oauth2authorization.AuthorizationGrantType.fromValue(authorization.getAuthorizationGrantType().getValue()))
                    .authorizedScopes(authorization.getAuthorizedScopes())
                    .state(authRequest.getState())
                    .build();
        }

        // AuthorizationCode
        OAuth2Authorization.Token<OAuth2AuthorizationCode> authorizationCode = authorization.getToken(OAuth2AuthorizationCode.class);
        if (authorizationCode != null) {
            OAuth2AuthorizationCodeEntity existingCodeEntity = entity.getOauth2AuthorizationCode();
            if (existingCodeEntity == null) {
                    OAuth2AuthorizationCodeEntity codeEntity = OAuth2AuthorizationCodeEntity.builder()
                        .authorization(entity)
                        .metadata(authorizationCode.getMetadata())
                        .build();
                Token tokenEntity = createTokenEntity(authorizationCode);
//                tokenEntity.setOauth2AuthorizationCode(codeEntity);
                codeEntity.setAuthorizationCode(tokenEntity);
                entity.setOauth2AuthorizationCode(codeEntity);
            } else {
                existingCodeEntity.setMetadata(authorizationCode.getMetadata());
                Token existingToken = existingCodeEntity.getAuthorizationCode();
                if(existingToken != null) {
                    updateTokenEntity(existingToken, authorizationCode);
                } else {
                    Token tokenEntity = createTokenEntity(authorizationCode);
                    existingCodeEntity.setAuthorizationCode(tokenEntity);
                }
            }
        }
        // AccessToken
        OAuth2Authorization.Token<OAuth2AccessToken> accessToken = authorization.getToken(OAuth2AccessToken.class);
        if (accessToken != null) {
            OAuth2AccessTokenEntity existingAccessTokenEntity = entity.getOauth2AccessToken();
            if (existingAccessTokenEntity == null) {
                OAuth2AccessTokenEntity accessTokenEntity = OAuth2AccessTokenEntity.builder()
                        .authorization(entity)
                        .tokenType(TokenType.fromValue(accessToken.getToken().getTokenType().getValue()))
                        .scopes(accessToken.getToken().getScopes() != null ? accessToken.getToken().getScopes() : null)
                        .metadata(accessToken.getMetadata())
                        .build();
                Token tokenEntity = createTokenEntity(accessToken);
//                tokenEntity.setOauth2AccessToken(accessTokenEntity);
                accessTokenEntity.setAccessToken(tokenEntity);
                entity.setOauth2AccessToken(accessTokenEntity);
            } else {
                existingAccessTokenEntity.setTokenType(TokenType.fromValue(accessToken.getToken().getTokenType().getValue()));
                existingAccessTokenEntity.setScopes(accessToken.getToken().getScopes());
                existingAccessTokenEntity.setMetadata(accessToken.getMetadata());

                Token existingToken = existingAccessTokenEntity.getAccessToken();
                if(existingToken != null) {
                    updateTokenEntity(existingToken, accessToken);
                } else {
                    Token tokenEntity = createTokenEntity(accessToken);
                    existingAccessTokenEntity.setAccessToken(tokenEntity);
                }
            }

        }
        // RefreshToken
        OAuth2Authorization.Token<OAuth2RefreshToken> refreshToken = authorization.getToken(OAuth2RefreshToken.class);
        if (refreshToken != null) {
            OAuth2RefreshTokenEntity existingRefreshTokenEntity = entity.getOauth2RefreshToken();
            if (existingRefreshTokenEntity == null) {
                OAuth2RefreshTokenEntity refreshTokenEntity = OAuth2RefreshTokenEntity.builder()
                        .authorization(entity)
                        .metadata(refreshToken.getMetadata())
                        .build();
                Token tokenEntity = createTokenEntity(refreshToken);
//                tokenEntity.setOauth2RefreshToken(refreshTokenEntity);
                refreshTokenEntity.setRefreshToken(tokenEntity);
                entity.setOauth2RefreshToken(refreshTokenEntity);
            } else {
                existingRefreshTokenEntity.setMetadata(refreshToken.getMetadata());
                Token existingToken = existingRefreshTokenEntity.getRefreshToken();
                if (existingToken != null) {
                    updateTokenEntity(existingToken, refreshToken);
                } else {
                    Token tokenEntity = createTokenEntity(refreshToken);
                    existingRefreshTokenEntity.setRefreshToken(tokenEntity);
                }
            }

        }

        // OidcIdToken
        OAuth2Authorization.Token<OidcIdToken> oidcIdToken = authorization.getToken(OidcIdToken.class);
        if (oidcIdToken != null) {
            OidcIdTokenEntity existingIdTokenEntity = entity.getOidcIdToken();
            if (existingIdTokenEntity == null) {
                OidcIdTokenEntity oidcIdTokenEntity = OidcIdTokenEntity.builder()
                        .authorization(entity)
                        .claims(oidcIdToken.getClaims())
                        .metadata(oidcIdToken.getMetadata())
                        .build();
                Token tokenEntity = createTokenEntity(oidcIdToken);
//                tokenEntity.setOidcIdToken(oidcIdTokenEntity);
                oidcIdTokenEntity.setOidcIdToken(tokenEntity);
                entity.setOidcIdToken(oidcIdTokenEntity);
            } else {
                existingIdTokenEntity.setClaims(oidcIdToken.getToken().getClaims());
                existingIdTokenEntity.setMetadata(oidcIdToken.getMetadata());

                Token existingToken = existingIdTokenEntity.getOidcIdToken();
                if (existingToken != null) {
                    updateTokenEntity(existingToken, oidcIdToken);
                } else {
                    Token tokenEntity = createTokenEntity(oidcIdToken);
                    existingIdTokenEntity.setOidcIdToken(tokenEntity);
                }
            }

        }
        // DeviceCode
        OAuth2Authorization.Token<OAuth2DeviceCode> deviceCode = authorization.getToken(OAuth2DeviceCode.class);
        if (deviceCode != null) {
            OAuth2DeviceCodeEntity existingDeviceCodeEntity = entity.getDeviceCode();
            if (existingDeviceCodeEntity == null) {
                OAuth2DeviceCodeEntity deviceCodeEntity = OAuth2DeviceCodeEntity.builder()
                        .authorization(entity)
                        .metadata(deviceCode.getMetadata())
                        .build();
                Token tokenEntity = createTokenEntity(deviceCode);
//                tokenEntity.setOauth2DeviceCode(deviceCodeEntity);
                deviceCodeEntity.setDeviceCode(tokenEntity);
                entity.setDeviceCode(deviceCodeEntity);
            } else {
                existingDeviceCodeEntity.setMetadata(deviceCode.getMetadata());
                Token existingToken = existingDeviceCodeEntity.getDeviceCode();
                if (existingToken != null) {
                    updateTokenEntity(existingToken, deviceCode);
                } else  {
                    Token tokenEntity = createTokenEntity(deviceCode);
                    existingDeviceCodeEntity.setDeviceCode(tokenEntity);
                }
            }

        }
        // UserCode
        OAuth2Authorization.Token<OAuth2UserCode> userCode = authorization.getToken(OAuth2UserCode.class);
        if (userCode != null) {
            OAuth2UserCodeEntity existingUserCodeEntity = entity.getUserCode();
            if (existingUserCodeEntity == null) {
                OAuth2UserCodeEntity userCodeEntity = OAuth2UserCodeEntity.builder()
                        .authorization(entity)
                        .metadata(userCode.getMetadata())
                        .build();
                Token tokenEntity = createTokenEntity(userCode);
//                tokenEntity.setOauth2UserCodeEntity(userCodeEntity);
                userCodeEntity.setUserCode(tokenEntity);
                entity.setUserCode(userCodeEntity);
            } else {
                existingUserCodeEntity.setMetadata(userCode.getMetadata());

                Token existingToken = existingUserCodeEntity.getUserCode();
                if (existingToken != null) {
                    updateTokenEntity(existingToken, userCode);
                }  else {
                    Token tokenEntity = createTokenEntity(userCode);
                    existingUserCodeEntity.setUserCode(tokenEntity);
                }
            }

        }
        handleOAuth2AuthorizationAttributesToEntity(authorization, entity);
        return entity;
    }

    private Token createTokenEntity(OAuth2Authorization.Token<?> token) {
        if (token == null || token.getToken() == null) {
            return null;
        }

        OAuth2Token oAuth2Token = token.getToken();
        return Token.builder()
                .tokenValue(oAuth2Token.getTokenValue())
                .issuedAt(oAuth2Token.getIssuedAt() != null ? oAuth2Token.getIssuedAt() : null)
                .expiresAt(oAuth2Token.getExpiresAt() != null ? oAuth2Token.getExpiresAt() : null)
                .build();
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

    private void updateTokenEntity(Token existingToken, OAuth2Authorization.Token<?> newTokenData) {
        if (newTokenData == null || newTokenData.getToken() == null) {
            return;
        }

        OAuth2Token oAuth2Token = newTokenData.getToken();
        existingToken.setTokenValue(oAuth2Token.getTokenValue());
        existingToken.setIssuedAt(oAuth2Token.getIssuedAt());
        existingToken.setExpiresAt(oAuth2Token.getExpiresAt());
    }

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
}