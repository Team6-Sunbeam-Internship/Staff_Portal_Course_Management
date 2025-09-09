package com.staff_portal.auth_service.initializer;

import com.staff_portal.auth_service.service.interfaces.IRegisteredClientService;
import com.staff_portal.auth_service.util.PasswordUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.UUID;

@Component
@Slf4j
public class RegisteredClientInitializer implements ApplicationRunner {

    private final IRegisteredClientService registeredClientService;
    private final PasswordUtil passwordUtil;

    public RegisteredClientInitializer(IRegisteredClientService registeredClientService, PasswordUtil passwordUtil) {
        this.registeredClientService = registeredClientService;
        this.passwordUtil = passwordUtil;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        initalizeDefaultClient();
    }

    private void initalizeDefaultClient() {
        String clientId = "staff-portal-client";
        if (!registeredClientService.existsByClientId(clientId)) {
            log.info("Creating a new RegisteredClient with client ID {}", clientId);
            RegisteredClient registeredClient = RegisteredClient.withId(UUID.randomUUID().toString())
                    .clientId(clientId)
                    .clientIdIssuedAt(Instant.now(Clock.system(ZoneId.of("Asia/Kolkata"))))
                    .clientName("staff-portal-cms")
                    .clientSecret(passwordUtil.encode("staff-portal-secret"))
                    .clientAuthenticationMethods(clientAuthenticationMethods -> {
                        clientAuthenticationMethods.add(ClientAuthenticationMethod.CLIENT_SECRET_BASIC);
                    })
                    .authorizationGrantTypes(authorizationGrantTypes -> {
                        authorizationGrantTypes.add(AuthorizationGrantType.AUTHORIZATION_CODE);
                        authorizationGrantTypes.add(AuthorizationGrantType.REFRESH_TOKEN);
                        authorizationGrantTypes.add(AuthorizationGrantType.CLIENT_CREDENTIALS);
                    })
                    .scopes(scopes -> {
                                scopes.add(OidcScopes.OPENID);
                                scopes.add(OidcScopes.PROFILE);
                                scopes.add(OidcScopes.EMAIL);
                                scopes.add(OidcScopes.ADDRESS);
                            }
                    )
                    .redirectUri("http://localhost:8002/login/oauth2/code/auth-service")
                    .postLogoutRedirectUri("http://localhost:8002/logout-callback")
                    .clientSettings(ClientSettings.builder()
                            .requireProofKey(true)
                            .requireAuthorizationConsent(true)
                            .tokenEndpointAuthenticationSigningAlgorithm(SignatureAlgorithm.RS256)
                            .jwkSetUrl("http://localhost:8001/oauth/v1/jwks")
                            .build()
                    )
                    .tokenSettings(TokenSettings.builder()
                            .accessTokenTimeToLive(Duration.ofMinutes(10))
                            .accessTokenFormat(OAuth2TokenFormat.SELF_CONTAINED)
                            .authorizationCodeTimeToLive(Duration.ofMinutes(5))
                            .reuseRefreshTokens(false)
                            .refreshTokenTimeToLive(Duration.ofHours(2))
                            .idTokenSignatureAlgorithm(SignatureAlgorithm.RS256)
                            .build()
                    )
                    .build();
            registeredClientService.save(registeredClient);
            log.info("Default client '{}' registered successfully", clientId);
        } else {
            log.info("Client '{}' already exists, skipping initialization", clientId);
        }
    }
}
