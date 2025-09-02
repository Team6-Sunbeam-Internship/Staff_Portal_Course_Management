package com.staff_portal.api_gateway.config;

import com.staff_portal.api_gateway.validator.AudienceValidator;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Objects;

@Configuration
@ConfigurationProperties(prefix = "spring.security.oauth2.resourceserver.jwt")
@Data
public class JwtConfig {
    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;
    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String jwkSetUri;
    @Value("${spring.security.oauth2.resourceserver.jwt.clock-skew:60s}")
    private Duration clockSkew;
    @Autowired
    private AudienceValidator audienceValidator;

    @Bean
    public JwtDecoder jwtDecoder(CacheManager cacheManager) {
        NimbusJwtDecoder jwtDecoder;
        if (StringUtils.hasText(jwkSetUri)) {
            jwtDecoder = NimbusJwtDecoder.withJwkSetUri(jwkSetUri)
                    .cache(Objects.requireNonNull(cacheManager.getCache("jwks")))
                    .build();
        } else {
            jwtDecoder = NimbusJwtDecoder.withIssuerLocation(issuerUri)
                    .cache(Objects.requireNonNull(cacheManager.getCache("jwks")))
                    .build();
        }
        OAuth2TokenValidator<Jwt> audienceValidator = getAudienceValidator();
        OAuth2TokenValidator<Jwt> timestampValidator = new JwtTimestampValidator(clockSkew);
        OAuth2TokenValidator<Jwt> issuerValidator = new JwtIssuerValidator(issuerUri);
        OAuth2TokenValidator<Jwt> withDefaults = new DelegatingOAuth2TokenValidator<>(
                timestampValidator, issuerValidator, audienceValidator);
        jwtDecoder.setJwtValidator(withDefaults);
        return jwtDecoder;
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