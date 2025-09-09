package com.staff_portal.auth_service.model.oauth2.oauth2authorization;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

// Main Authorization Entity
@Entity
@Table(name = "oauth2_authorization")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuth2AuthorizationEntity {

    @Id
    private String id;

    @Column(name = "registered_client_id", length = 50, nullable = false)
    private String registeredClientId;

    @Column(name = "principal_name", length = 50, nullable = false)
    private String principalName;

    @Enumerated(EnumType.STRING)
    @Column(name = "authorization_grant_type", nullable = false)
    private AuthorizationGrantType authorizationGrantType;

    @Column(name = "authorized_scopes")
    @Builder.Default
    @JdbcTypeCode(SqlTypes.JSON)
    private Set<String> authorizedScopes = new HashSet<>();

    @Column(name = "state")
    private String state;

    // One-to-One Relationships with Tokens
    // AuthorizationCode
    @OneToOne(mappedBy = "authorization", cascade = CascadeType.ALL, orphanRemoval = true)
    private OAuth2AuthorizationCodeEntity oauth2AuthorizationCode;
    // Access Token
    @OneToOne(mappedBy = "authorization", cascade = CascadeType.ALL, orphanRemoval = true)
    private OAuth2AccessTokenEntity oauth2AccessToken;
    // Refresh Token
    @OneToOne(mappedBy = "authorization", cascade = CascadeType.ALL, orphanRemoval = true)
    private OAuth2RefreshTokenEntity oauth2RefreshToken;
    // OIDC ID Token
    @OneToOne(mappedBy = "authorization", cascade = CascadeType.ALL, orphanRemoval = true)
    private OidcIdTokenEntity oidcIdToken;
    // Device Code
    @OneToOne(mappedBy = "authorization", cascade = CascadeType.ALL, orphanRemoval = true)
    private OAuth2DeviceCodeEntity deviceCode;
    // User Code
    @OneToOne(mappedBy = "authorization", cascade = CascadeType.ALL, orphanRemoval = true)
    private OAuth2UserCodeEntity userCode;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "attributes", columnDefinition = "json")
    private Map<String, Object> attributes;
}