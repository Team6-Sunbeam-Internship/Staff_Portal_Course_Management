package com.staff_portal.backend_for_frontend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);

        // Allowed origins (frontend)
        corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));

        // Or use patterns (if you want flexibility)
        // corsConfiguration.setAllowedOriginPatterns(List.of("http://localhost:*"));

        // Allowed headers
        corsConfiguration.setAllowedHeaders(List.of("*"));

        // Allowed methods
        corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Expose headers (if needed by frontend)
        corsConfiguration.setExposedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }
}
