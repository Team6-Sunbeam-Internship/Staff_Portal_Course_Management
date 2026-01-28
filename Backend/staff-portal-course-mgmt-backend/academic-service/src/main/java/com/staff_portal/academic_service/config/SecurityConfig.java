package com.staff_portal.academic_service.config;//package com.staff_portal.user_service.config;
//
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.cache.CacheManager;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
//import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
//import org.springframework.security.oauth2.core.OAuth2TokenValidator;
//import org.springframework.security.oauth2.jwt.*;
//import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.util.StringUtils;
//
//import java.time.Duration;
//import java.util.Objects;
//
//@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity(prePostEnabled = true)
//public class SecurityConfig {
//
//    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
//    private String issuerUri;
//    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
//    private String jwkSetUri;
//    @Value("${spring.security.oauth2.resourceserver.jwt.clock-skew:60s}")
//    private Duration clockSkew;
//    private final AudienceValidatorConfig audienceValidatorConfig;
//
//    public SecurityConfig(AudienceValidatorConfig audienceValidatorConfig) {
//        this.audienceValidatorConfig = audienceValidatorConfig;
//    }
//
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtDecoder jwtDecoder,
//                                                   JwtAuthenticationConverter jwtAuthenticationConverter,
//                                                   CustomAuthenticationEntryPoint authenticationEntryPoint,
//                                                   CustomAccessDeniedHandler accessDeniedHandler) throws Exception {
//        http
//                .csrf(AbstractHttpConfigurer::disable)
//                .authorizeHttpRequests(authorizeRequests -> authorizeRequests.anyRequest().authenticated())
//                .oauth2ResourceServer(oauth2ResourceServer -> {
//                    oauth2ResourceServer.jwt(jwtConfigurer ->
//                            jwtConfigurer.decoder(jwtDecoder)
//                                    .jwtAuthenticationConverter(jwtAuthenticationConverter)
//                    );
//                })
//                .exceptionHandling(exceptions -> exceptions
//                        .authenticationEntryPoint(authenticationEntryPoint)
//                        .accessDeniedHandler(accessDeniedHandler)
//                )
//        ;
//        return http.build();
//    }
//
//
//}
