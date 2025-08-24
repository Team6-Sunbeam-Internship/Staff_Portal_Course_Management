package com.staff_portal.auth_service.config;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.staff_portal.auth_service.dto.response.StaffProfileResponseDTO;
import com.staff_portal.auth_service.model.user.AuthUser;
import com.staff_portal.auth_service.scheduler.KeyRotationScheduler;
import com.staff_portal.auth_service.security.CustomUserDetails;
import com.staff_portal.auth_service.service.interfaces.IJpaOAuth2AuthorizationConsentService;
import com.staff_portal.auth_service.service.interfaces.IJpaOAuth2AuthorizationService;
import com.staff_portal.auth_service.service.interfaces.IJpaRegisteredClientRepositoryService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.oidc.OidcUserInfo;
import org.springframework.security.oauth2.core.oidc.endpoint.OidcParameterNames;
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

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Configuration
public class AuthorizationServerConfig {

    private final KeyRotationScheduler keyRotationScheduler;
    private final UserServiceClient userServiceClient;
    @Value("${authservice.security.issuer}")
    private String issuer;

    public AuthorizationServerConfig(KeyRotationScheduler keyRotationScheduler, UserServiceClient userServiceClient) {
        this.keyRotationScheduler = keyRotationScheduler;
        this.userServiceClient = userServiceClient;
    }

    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public SecurityFilterChain authorizationServerSecurityFilterChain(HttpSecurity http, OAuth2TokenGenerator oAuth2TokenGenerator,
                                                                      IJpaRegisteredClientRepositoryService jpaRegisteredClientRepositoryService,
                                                                      IJpaOAuth2AuthorizationService jpaOAuth2AuthorizationService,
                                                                      IJpaOAuth2AuthorizationConsentService jpaOAuth2AuthorizationConsentService) throws Exception {
        OAuth2AuthorizationServerConfigurer authorizationServerConfigurer = OAuth2AuthorizationServerConfigurer.authorizationServer();

        http
                .securityMatcher(authorizationServerConfigurer.getEndpointsMatcher())
                .with(authorizationServerConfigurer, (authorizationServer) ->
                        authorizationServer
                                .authorizationEndpoint(authEnpoints ->
                                        authEnpoints.consentPage("/oauth2/consent")
                                )
                                .tokenGenerator(oAuth2TokenGenerator)
                                .registeredClientRepository(jpaRegisteredClientRepositoryService)
                                .authorizationService(jpaOAuth2AuthorizationService)
                                .authorizationConsentService(jpaOAuth2AuthorizationConsentService)
                                .oidc(oidcConfigurer ->     // Enable OpenId Connect 1.0
                                        oidcConfigurer.userInfoEndpoint(userInfoConfigurer ->
                                                userInfoConfigurer.userInfoMapper(this::customUserInfoMapper))
                                        )
                )
                .authorizeHttpRequests(authorize ->
                        authorize
                                .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2ResourceServer ->
                        oauth2ResourceServer.jwt(Customizer.withDefaults()))
                .exceptionHandling(exceptions ->
                        exceptions
                                .defaultAuthenticationEntryPointFor(
                                        new LoginUrlAuthenticationEntryPoint("/login"),
                                        new MediaTypeRequestMatcher(MediaType.TEXT_HTML)
                                ))
        ;
        return http.build();
    }

    // Custom OIDC userinfo mapper
    private OidcUserInfo customUserInfoMapper(OidcUserInfoAuthenticationContext context) {
        Authentication authentication = context.getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        AuthUser authUser = userDetails.getAuthUser();
        JwtAuthenticationToken jwtAuthenticationToken = (JwtAuthenticationToken) authentication;
        String bearer = "Bearer " + jwtAuthenticationToken.getToken().getTokenValue();
        // call user service to fetch extended staff profile
        StaffProfileResponseDTO staffProfile = userServiceClient.getStaffProfile(bearer);

        // Build OIDC userinfo response
        return OidcUserInfo.builder()
                .subject(authUser.getId().toString())
                .name(staffProfile.firstName() + " " + staffProfile.lastName())
                .email(authUser.getUsername())
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
            if (OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType())) {
                CustomUserDetails principal = (CustomUserDetails) context.getPrincipal().getPrincipal();
                Collection<? extends GrantedAuthority> authorities = context.getPrincipal().getAuthorities();
                AuthUser authUser = principal.getAuthUser();

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

                context.getClaims().claim("sub", authUser.getId());
                context.getClaims().claim("roles", roles);
                context.getClaims().claim("scopes", scopes);
                context.getClaims().claim("email", principal.getUsername());
            } else if (OidcParameterNames.ID_TOKEN.equals(context.getTokenType().getValue())) {
                    // Customize headers/claims for id_token
            }
        };
    }

}
