package com.staff_portal.backend_for_frontend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.OAuthFlow;
import io.swagger.v3.oas.annotations.security.OAuthFlows;
import io.swagger.v3.oas.annotations.security.OAuthScope;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "STAFF-PORTAL BFF API",
        version = "1.0.0",
        description = "Backend-for-Frontend service providing OAuth2 authentication and API proxy capabilities"
    ),
    servers = {
        @Server(url = "http://localhost:8002", description = "Development server"),
        @Server(url = "https://bff.enterprise.com", description = "Production server")
    }
)
@SecurityScheme(
    name = "oauth2",
    type = SecuritySchemeType.OAUTH2,
    flows = @OAuthFlows(
        authorizationCode = @OAuthFlow(
            authorizationUrl = "http://localhost:8001/oauth2/v1/authorize",
            tokenUrl = "http://localhost:8001/oauth2/v1/token",
            scopes = {
                @OAuthScope(name = "openid", description = "OpenID Connect scope"),
                @OAuthScope(name = "profile", description = "Profile information access"),
            }
        )
    )
)
public class OpenApiConfig {
}