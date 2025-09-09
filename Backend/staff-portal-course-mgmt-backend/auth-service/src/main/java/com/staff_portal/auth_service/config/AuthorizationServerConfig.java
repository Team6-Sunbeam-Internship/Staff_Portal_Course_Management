package com.staff_portal.auth_service.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.staff_portal.auth_service.dto.response.StaffProfileResponseDTO;
import com.staff_portal.auth_service.handler.CustomAuthorizeFlowFailureHandler;
import com.staff_portal.auth_service.scheduler.KeyRotationScheduler;
import com.staff_portal.auth_service.security.CustomUserDetails;
import com.staff_portal.auth_service.service.interfaces.IOAuth2AuthorizationConsentService;
import com.staff_portal.auth_service.service.interfaces.IOAuth2AuthorizationService;
import com.staff_portal.auth_service.service.interfaces.IRegisteredClientService;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.endpoint.OidcParameterNames;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.server.authorization.config.annotation.web.configurers.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.oauth2.server.authorization.oidc.authentication.OidcUserInfoAuthenticationContext;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.token.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.LoginUrlAuthenticationEntryPoint;
import org.springframework.security.web.util.matcher.MediaTypeRequestMatcher;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Configuration
public class AuthorizationServerConfig {

    private final KeyRotationScheduler keyRotationScheduler;
    private final RestClient userServiceRestClient;

    public AuthorizationServerConfig(KeyRotationScheduler keyRotationScheduler, @Qualifier("userServiceRestClient") RestClient userServiceClient) {
        this.keyRotationScheduler = keyRotationScheduler;
        this.userServiceRestClient = userServiceClient;
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http, OAuth2TokenGenerator<Jwt> oAuth2TokenGenerator,
                                                                      IRegisteredClientService registeredClientService,
                                                                      IOAuth2AuthorizationService oauth2AuthorizationService,
                                                                      IOAuth2AuthorizationConsentService oauth2AuthorizationConsentService,
                                                                      CustomAuthorizeFlowFailureHandler authorizeFlowFailureHandler) throws Exception {
        OAuth2AuthorizationServerConfigurer authorizationServerConfigurer = OAuth2AuthorizationServerConfigurer.authorizationServer();

        http
                .securityMatcher(authorizationServerConfigurer.getEndpointsMatcher())
                .with(authorizationServerConfigurer, (authorizationServer) ->
                        authorizationServer
                                .authorizationEndpoint(authEnpoints ->
                                        authEnpoints
                                                .errorResponseHandler(authorizeFlowFailureHandler)
                                                .consentPage("/oauth2/consent")

                                )
                                .tokenGenerator(oAuth2TokenGenerator)
                                .registeredClientRepository(registeredClientService)
                                .authorizationService(oauth2AuthorizationService)
                                .authorizationConsentService(oauth2AuthorizationConsentService)
                                .oidc(oidcConfigurer ->     // Enable OpenId Connect 1.0
                                        oidcConfigurer.userInfoEndpoint(userInfoConfigurer ->
                                                userInfoConfigurer.userInfoMapper(this::customUserInfoMapper))

                                )
                )
                .authorizeHttpRequests(authorize ->
                        authorize
                                .requestMatchers("/oauth2-error", "/error").permitAll()
                                .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2ResourceServer ->
                        oauth2ResourceServer.jwt(Customizer.withDefaults()))
                .exceptionHandling(exceptions ->
                        exceptions
                                .defaultAuthenticationEntryPointFor(
                                        new LoginUrlAuthenticationEntryPoint("/login"),
                                        new MediaTypeRequestMatcher(MediaType.TEXT_HTML)
                                )
                )
        ;
        return http.build();
    }

    // Custom OIDC userinfo mapper
    private OidcUserInfo customUserInfoMapper(OidcUserInfoAuthenticationContext context) {
        Authentication authentication = context.getAuthentication();
        JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication.getPrincipal();
        String authorization = "Bearer " + jwtAuthenticationToken.getToken().getTokenValue();
        // call user service to fetch extended staff profile
        StaffProfileResponseDTO staffProfile = userServiceRestClient
                .get()
                .header(HttpHeaders.AUTHORIZATION, authorization)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .body(StaffProfileResponseDTO.class);

        // Build OIDC userinfo response
        assert staffProfile != null;
        return OidcUserInfo.builder()
                .subject(jwtAuthenticationToken.getToken().getSubject())
                .name(staffProfile.firstName() + " " + staffProfile.lastName())
                .email(jwtAuthenticationToken.getToken().getClaims().get("email").toString())
                .emailVerified(true)
                .phoneNumber(staffProfile.phoneNumber())
                .phoneNumberVerified(true)
                .address(Map.of("formatted", staffProfile.address()).toString())
                .claim("staff_type", staffProfile.staffType())
                .build();
    }

    /*
     *  Customization of Default AuthorizationServerSettings
     */
    @Bean
    public AuthorizationServerSettings authorizationServerSettings() {
        return AuthorizationServerSettings.builder()
                .issuer("http://localhost:8001")
                .authorizationEndpoint("/oauth2/v1/authorize")
                .pushedAuthorizationRequestEndpoint("/oauth2/v1/par")
                .deviceAuthorizationEndpoint("/oauth2/v1/device_authorization")
                .deviceVerificationEndpoint("/oauth2/v1/device_verification")
                .tokenEndpoint("/oauth2/v1/token")
                .tokenIntrospectionEndpoint("/oauth2/v1/introspect")
                .tokenRevocationEndpoint("/oauth2/v1/revoke")
                .jwkSetEndpoint("/oauth2/v1/jwks")
                .oidcLogoutEndpoint("/connect/v1/logout")
                .oidcUserInfoEndpoint("/connect/v1/userinfo")
                .oidcClientRegistrationEndpoint("/connect/v1/register")
                .build();
    }

    @Bean
    public JWKSource<SecurityContext> jwkSource() {
        return ((jwkSelector, securityContext) -> {
            // Get only the current signing key to avoid multiple key selection issue
            RSAKey currentKey = keyRotationScheduler.getCurrentSigningKey();
            if (currentKey == null) {
                return Collections.emptyList();
            }
            // Create JWKSet with only the current signing key
            JWKSet singleKeySet = new JWKSet(currentKey);
            return jwkSelector.select(singleKeySet);
        });
    }

    @Bean
    public JwtDecoder jwtDecoder(JWKSource<SecurityContext> jwkSource) {
        return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource);
    }

    @Bean
    public OAuth2TokenGenerator<?> tokenGenerator() {
        NimbusJwtEncoder nimbusJwtEncoder = new NimbusJwtEncoder(jwkSource());
        JwtGenerator jwtGenerator = new JwtGenerator(nimbusJwtEncoder);
        jwtGenerator.setJwtCustomizer(jwtCustomizer());

        OAuth2AccessTokenGenerator oAuth2AccessTokenGenerator = new OAuth2AccessTokenGenerator();
        OAuth2RefreshTokenGenerator oAuth2RefreshTokenGenerator = new OAuth2RefreshTokenGenerator();

        return new DelegatingOAuth2TokenGenerator(jwtGenerator, oAuth2AccessTokenGenerator, oAuth2RefreshTokenGenerator);
    }

    /**
     * Add custom claims to JWT (roles + scopes)
     */
    @Bean
    public OAuth2TokenCustomizer<JwtEncodingContext> jwtCustomizer() {
        return context -> {

            CustomUserDetails principal = (CustomUserDetails) context.getPrincipal().getPrincipal();
            Collection<? extends GrantedAuthority> authorities = context.getPrincipal().getAuthorities();

            Set<String> roles = authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(auth -> auth.startsWith("ROLE_"))
                    .map(auth -> auth.substring("ROLE_".length()))
                    .collect(Collectors.toSet());

            Set<String> scopes = authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .filter(auth -> auth.startsWith("SCOPE_"))
                    .map(auth -> auth.substring("SCOPE_".length()))
                    .collect(Collectors.toSet());

            Set<String> audiences = determineAudience(scopes);

            ZoneId ist = ZoneId.of("Asia/Kolkata");
            Instant now = Instant.now();

            if (OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType())) {
                // Customize headers/claims for id_token
                context.getClaims().claim("aud", audiences);
                context.getClaims().claim("sub", principal.getId());
                context.getClaims().claim("email", principal.getUsername());
                context.getClaims().claim("roles", roles);
                context.getClaims().claim("scopes", scopes);

                // Add IST version of timestamps for display purpose
                context.getClaims().claim("iat_ist", now.atZone(ist).toString());
                Duration ttl = context.getRegisteredClient().getTokenSettings().getAccessTokenTimeToLive();
                Instant expiresAt = now.plus(ttl);
                context.getClaims().claim("exp_ist", expiresAt.atZone(ist).toString());
            } else if (OidcParameterNames.ID_TOKEN.equals(context.getTokenType().getValue())) {
                // Customize headers/claims for id_token
                context.getClaims().claim("aud", context.getRegisteredClient().getClientId());
                context.getClaims().claim("sub", principal.getId());
                context.getClaims().claim("name", principal.getFirstName());
                context.getClaims().claim("email", principal.getUsername());
                context.getClaims().claim("email_verified", true);
                context.getClaims().claim("roles", roles);

                // Add IST version of timestamps for display purpose
                context.getClaims().claim("iat_ist", now.atZone(ist).toString());
                Duration ttl = context.getRegisteredClient().getTokenSettings().getAccessTokenTimeToLive();
                Instant expiresAt = now.plus(ttl);
                context.getClaims().claim("exp_ist", expiresAt.atZone(ist).toString());
            }
        };
    }

    private Set<String> determineAudience(Set<String> scopes) {
        Set<String> audiences = new HashSet<>();
        for (String scope : scopes) {
            if (scope.contains("STAFF_") || scope.contains("PROFILE_") || scope.contains("STUDENT_") || scope.contains("MENUITEM_")) {
                audiences.add("user-service");
            }
            if (scope.contains("COURSE_") || scope.contains("MODULE_") || scope.contains("SUBJECT_") || scope.contains("SECTION_") || scope.contains("TOPIC_") || scope.contains("COURSE_GROUP_")) {
                audiences.add("academic-service");
            }
            if (scope.contains("SCHEDULE_") || scope.contains("SESSION_") || scope.contains("TIMESHEET_") || scope.contains("VIDEO_")) {
                audiences.add("schedule-service");
            }
            if (scope.contains("INFRASTRUCTURE_") || scope.contains("PREMISE_") || scope.contains("BATCHCYCLE_")) {
                audiences.add("academic-service");
            }
            if (scope.contains("CERTIFICATE_")) {
                audiences.add("document-service");
            }
        }
        return audiences;
    }

}
