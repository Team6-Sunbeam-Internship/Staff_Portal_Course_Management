package com.staff_portal.backend_for_frontend.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "bff.auth-service")
@Getter
@Setter
@Slf4j
public class OAuth2EndpointsConfig {
    private String issuer;
    private String introspectUri;
    private String revokeUri;
    private String logoutUri;

    @PostConstruct
    public void logConfiguration(){
        log.info("OAuth2 Endpoints configured - Issuer: {}", issuer);
    }

    public String getAuthorizationUri() {
        return issuer + "/oauth2/v1/authorize";
    }

    public String getTokenUri() {
        return issuer + "/oauth2/v1/token";
    }

    public String getUserInfoUri() {
        return issuer + "/connect/v1/userinfo";
    }

    public String getJwtsUri(){
        return issuer + "/oauth2/v1/jwks";
    }
}
