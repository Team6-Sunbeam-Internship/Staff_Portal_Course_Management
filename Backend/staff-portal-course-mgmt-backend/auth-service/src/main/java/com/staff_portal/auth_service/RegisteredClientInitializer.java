package com.staff_portal.auth_service;

import com.staff_portal.auth_service.service.interfaces.IJpaRegisteredClientRepositoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.oidc.OidcScopes;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Base64;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class RegisteredClientInitializer implements ApplicationRunner {

    private final IJpaRegisteredClientRepositoryService registeredClientRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) throws Exception {
        initializeDefaultClients();
        generateCodeChallengeAndCodeVerifier();
    }

    private void generateCodeChallengeAndCodeVerifier() throws NoSuchAlgorithmException {
        SecureRandom secureRandom = new SecureRandom();
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        String codeVerifier = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        MessageDigest instance = MessageDigest.getInstance("SHA-256");
        byte[] digested = instance.digest(codeVerifier.getBytes());
        String codeChallenge = Base64.getUrlEncoder().withoutPadding().encodeToString(digested);

        System.out.println("CodeVerifier = " + codeVerifier);
        System.out.println("CodeChallenge = " + codeChallenge);
    }

    private void initializeDefaultClients() {
        String clientId = "staff-portal-client";

        if (!registeredClientRepository.existsByClientId(clientId)) {

            RegisteredClient registeredClient = RegisteredClient.withId(UUID.randomUUID().toString())
                    .clientId(clientId)
                    .clientIdIssuedAt(Instant.now(Clock.system(ZoneId.of("Asia/Kolkata"))))
                    .clientName("my-client")
                    .clientSecret(passwordEncoder.encode("staff-portal-secret"))
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
                    .redirectUri("http://localhost:8002/auth/callback")
                    .postLogoutRedirectUri("http://localhost:8002/login")
                    .clientSettings(ClientSettings.builder()
                            .requireProofKey(true)
                            .requireAuthorizationConsent(true)
                            .build()
                    )
                    .tokenSettings(TokenSettings.builder()
                            .accessTokenTimeToLive(Duration.ofMinutes(10))
                            .accessTokenFormat(OAuth2TokenFormat.SELF_CONTAINED)
                            .authorizationCodeTimeToLive(Duration.ofMinutes(5))
                            .reuseRefreshTokens(false)
                            .refreshTokenTimeToLive(Duration.ofHours(2))
                            .build()
                    )
                    .build();
            registeredClientRepository.save(registeredClient);
            log.info("Default client '{}' registered successfully", clientId);
        } else {
            log.info("Client '{}' already exists, skipping initialization", clientId);
        }

    }
}
