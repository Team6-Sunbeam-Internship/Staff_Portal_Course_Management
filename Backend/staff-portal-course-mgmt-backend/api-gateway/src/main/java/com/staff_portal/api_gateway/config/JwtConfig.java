package com.staff_portal.api_gateway.config;

import com.staff_portal.api_gateway.validator.AudienceValidator;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;

@Configuration
@ConfigurationProperties(prefix = "spring.security.oauth2.resourceserver.jwt")
@Data
public class JwtConfig {
    private String issuerUri;
    private String jwkSetUri;
    private Duration clockSkew;

    @Autowired
    private AudienceValidator audienceValidator;

    @Bean
    public JwtDecoder jwtDecoder(CacheManager cacheManager) {
        // validate required configuration
        validateConfiguration();

        // Create decoder based on available configuration
        NimbusJwtDecoder jwtDecoder = createJwtDecoder(cacheManager);

        // Configure validators
        OAuth2TokenValidator<Jwt> combinedValidator = createCombinedValidator();
        jwtDecoder.setJwtValidator(combinedValidator);

        return jwtDecoder;
    }

    private void validateConfiguration() {
        if (!StringUtils.hasText(issuerUri) && !StringUtils.hasText(jwkSetUri)) {
            throw new IllegalArgumentException("Jwt configuration error: Either issuerUri or jwkSetUri must be configured");
        }
    }

    private NimbusJwtDecoder createJwtDecoder(CacheManager cacheManager) {
        var jwksCache = cacheManager.getCache("jwks");
        if (jwksCache == null) {
            throw new IllegalArgumentException("JWKS cache not found. Ensure cache manager is properly configured.");
        }

        // Prefer jwkSetUri over issuerUri
        if (StringUtils.hasText(jwkSetUri)) {
            return NimbusJwtDecoder.withJwkSetUri(jwkSetUri)
                    .cache(jwksCache)
                    .build();
        } else {
            return NimbusJwtDecoder.withIssuerLocation(issuerUri)
                    .cache(jwksCache)
                    .build();
        }
    }

    private OAuth2TokenValidator<Jwt> createCombinedValidator() {
        return new DelegatingOAuth2TokenValidator<>(
                new JwtTimestampValidator(clockSkew),
                new JwtIssuerValidator(issuerUri),
                audienceValidator
        );
    }

    @Deprecated
    public OAuth2TokenValidator<Jwt> getAudienceValidator() {
        return audienceValidator;
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
                    Collection<GrantedAuthority> authorities = new ArrayList<>();

                    // Map 'roles' claim to ROLE_ prefixed authorities
                    jwt.getClaimAsStringList("roles")
                            .stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                            .forEach(authorities::add);
                    return authorities;
                }
        );
        return jwtAuthenticationConverter;
    }

}