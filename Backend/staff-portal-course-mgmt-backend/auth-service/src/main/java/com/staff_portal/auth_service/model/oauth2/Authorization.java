package com.staff_portal.auth_service.model.oauth2;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "`oauth2_authorization`")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Authorization {
    @Id
    private String id;

    @Column(nullable = false)
    private String registeredClientId;

    @Column(nullable = false)
    private String principalName;

    @Column(nullable = false)
    private String authorizationGrantType;

    @Column(columnDefinition = "TEXT")
    private String authorizedScopes;

    @Column(columnDefinition = "TEXT")
    private String attributes;

    @Column(length = 500)
    private String state;

    @Column(columnDefinition = "TEXT")
    private String authorizationCodeValue;
    private Instant authorizationCodeIssuedAt;
    private Instant authorizationCodeExpiresAt;
    @Column(columnDefinition = "TEXT")
    private String authorizationCodeMetadata;

    @Column(columnDefinition = "TEXT")
    private String accessTokenValue;
    private Instant accessTokenIssuedAt;
    private Instant accessTokenExpiresAt;
    @Column(columnDefinition = "TEXT")
    private String accessTokenMetadata;
    private String accessTokenType;
    @Column(columnDefinition = "TEXT")
    private String accessTokenScopes;

    @Column(columnDefinition = "TEXT")
    private String refreshTokenValue;
    private Instant refreshTokenIssuedAt;
    private Instant refreshTokenExpiresAt;
    @Column(columnDefinition = "TEXT")
    private String refreshTokenMetadata;

    @Column(columnDefinition = "TEXT")
    private String oidcIdTokenValue;
    private Instant oidcIdTokenIssuedAt;
    private Instant oidcIdTokenExpiresAt;
    @Column(columnDefinition = "TEXT")
    private String oidcIdTokenMetadata;
    @Column(columnDefinition = "TEXT")
    private String oidcIdTokenClaims;

    @Column(columnDefinition = "TEXT")
    private String userCodeValue;
    private Instant userCodeIssuedAt;
    private Instant userCodeExpiresAt;
    @Column(columnDefinition = "TEXT")
    private String userCodeMetadata;

    @Column(columnDefinition = "TEXT")
    private String deviceCodeValue;
    private Instant deviceCodeIssuedAt;
    private Instant deviceCodeExpiresAt;
    @Column(columnDefinition = "TEXT")
    private String deviceCodeMetadata;

    @PrePersist
    protected void onCreate() {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
    }

}
