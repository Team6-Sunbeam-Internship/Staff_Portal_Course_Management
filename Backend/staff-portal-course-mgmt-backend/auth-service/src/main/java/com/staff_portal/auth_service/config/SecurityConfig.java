package com.staff_portal.auth_service.config;

import com.staff_portal.auth_service.handler.CustomAuthenticationFailureHandler;
import com.staff_portal.auth_service.handler.CustomAuthenticationSuccessHandler;
import com.staff_portal.auth_service.security.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.ArrayList;
import java.util.*;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtDecoder jwtDecoder;

    public SecurityConfig(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Bean
    @Order(1)
    public SecurityFilterChain apiSecurityFilterChain(HttpSecurity http, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) throws Exception {
        http
                .securityMatcher("/admin/**", "/createAuthUser", "/auth/**")
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2ResourceServer ->
                        oauth2ResourceServer.
                                jwt(jwt ->
                                        jwt.decoder(jwtDecoder)
                                                .jwtAuthenticationConverter(jwtAuthenticationConverter())

                                )
                                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .sessionManagement(sessionManagement ->
                        sessionManagement.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .csrf(AbstractHttpConfigurer::disable)
        ;

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain appFilterChain(HttpSecurity http,
                                              CustomAuthenticationFailureHandler failureHandler,
                                              CustomAuthenticationSuccessHandler successHandler) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/oauth2-error", "/favicon.ico", "/login", "/v3/api-docs", "/swagger-ui/index.html", "/css/**", "/js/**", "/images/**","/output.css", "/admin/**", "/error").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                                .loginPage("/login")
                                .successHandler(successHandler)
                                .failureHandler(failureHandler)
//                                .successHandler(successHandler)
//                        .loginProcessingUrl("/login")
//                                .failureUrl("/login?error=true")
                                .permitAll()
                )
                .logout(logout -> logout
                        .clearAuthentication(true)
//                        .invalidateHttpSession(true)
                        .deleteCookies("AS_SESSION")
                )
//                .logout(logout -> logout
//                                .logoutUrl("/connect/v1/logout")
//                                .logoutSuccessUrl("/login?logout=true")
//                                .invalidateHttpSession(true)
//                                .deleteCookies("JSESSIONID")
//                                .permitAll()
//                )
        ;

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Collection<GrantedAuthority> authorities = new ArrayList<>();
                    jwtAuthenticationConverter.setPrincipalClaimName("email");
                    // Map 'roles' claim to ROLE_ prefixed authorities
                    jwt.getClaimAsStringList("roles")
                            .stream()
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                            .forEach(authorities::add);

                    // Map 'scopes' claim to authorities (without SCOPE_ prefix for clean usage)
                    jwt.getClaimAsStringList("scopes")
                            .stream()
                            .map(SimpleGrantedAuthority::new)
                            .forEach(authorities::add);
                    return authorities;
                }
        );
        return jwtAuthenticationConverter;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(CustomUserDetailsService customUserDetailsService) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(customUserDetailsService);
        authenticationProvider.setHideUserNotFoundExceptions(false);
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        return authenticationProvider;
    }
}