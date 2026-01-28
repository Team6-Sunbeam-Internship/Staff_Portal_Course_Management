package com.staff_portal.backend_for_frontend.config;

import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.*;

@Getter
@Validated
public class RegistrationProperties {

    private Map<String, Registration> registration = new HashMap<>();
    private Map<String, Provider> provider = new HashMap<>();

    public void setRegistration(Map<String, Registration> registration) {
        this.registration = registration;
    }

    public void setProvider(Map<String, Provider> provider) {
        this.provider = provider;
    }

    // ------------------- Nested Classes -------------------

    @Validated
    @Getter
    @Builder
    public static class Registration {

        @NotBlank
        private String provider;

        @NotBlank
        private String clientId;

        @NotBlank
        private String clientSecret;

        private String clientAuthenticationMethod = "client_secret_basic";

        @NotBlank
        private String authorizationGrantType;

        @NotBlank
        private String redirectUri;
        @Builder.Default
        private Set<String> scope = new LinkedHashSet<>();

        @NotBlank
        private String clientName;

        private boolean requireProofKey;

        public void setScope(Set<String> scope) {
            this.scope = scope != null ? new LinkedHashSet<>(scope) : new LinkedHashSet<>();
        }

        // Getter that returns unmodifiable view
        public Set<String> getScope() {
            return Collections.unmodifiableSet(this.scope);
        }
    }

    @Validated
    @Builder
    @Setter
    @Getter
    public static class Provider {

        @NotBlank
        private String issuerUri;

        @NotBlank
        private String authorizationUri;

        @NotBlank
        private String tokenUri;

        private String userInfoUri;
        private String userInfoAuthenticationMethod;
        private String userNameAttribute = "sub";
        private String jwkSetUri;
    }
}
