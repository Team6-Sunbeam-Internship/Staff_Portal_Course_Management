package com.staff_portal.auth_service.model.oauth2;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "oauth2_registered_client")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Client {
    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String clientId;

    private Instant clientIdIssuedAt;

    @Column(length = 500)
    private String clientSecret;

    private Instant clientSecretExpiresAt;

    @Column(length = 200)
    private String clientName;

    @Column(columnDefinition = "TEXT")
    private String clientAuthenticationMethods;

    @Column(columnDefinition = "TEXT")
    private String authorizationGrantTypes;

    @Column(columnDefinition = "TEXT")
    private String redirectUris;

    @Column(columnDefinition = "TEXT")
    private String postLogoutRedirectUris;

    @Column(columnDefinition = "TEXT")
    private String scopes;

    @Column(columnDefinition = "TEXT")
    private String clientSettings;

    @Column(columnDefinition = "TEXT")
    private String tokenSettings;
}
