package com.staff_portal.user_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtDecoder jwtDecoder,
                                                   JwtAuthenticationConverter jwtAuthenticationConverter,
                                                   CustomAuthenticationEntryPoint authenticationEntryPoint,
                                                   CustomAccessDeniedHandler accessDeniedHandler) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers(HttpMethod.POST, "/staff/bootstrap").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2ResourceServer -> {
                    oauth2ResourceServer.jwt(jwtConfigurer ->
                            jwtConfigurer.decoder(jwtDecoder)
                                    .jwtAuthenticationConverter(jwtAuthenticationConverter)
                    );
                })
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(authenticationEntryPoint)
                        .accessDeniedHandler(accessDeniedHandler)
                )
        ;
        return http.build();
    }

//    @Bean
//    ObjectMapper objectMapper(){
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
//        return objectMapper;
//    }
}
