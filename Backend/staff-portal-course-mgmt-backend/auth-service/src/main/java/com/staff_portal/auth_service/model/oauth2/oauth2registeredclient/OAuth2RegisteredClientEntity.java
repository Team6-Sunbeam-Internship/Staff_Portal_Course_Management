package com.staff_portal.auth_service.model.oauth2.oauth2registeredclient;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

// Main Client Entity
@Entity
@Table(name = "oauth2_registered_client")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuth2RegisteredClientEntity {
    
    @Id
    @Column(name = "id", length = 100)
    private String id;
    
    @Column(name = "client_id", length = 100, nullable = false, unique = true)
    private String clientId;
    
    @CreationTimestamp
    @Column(name = "client_id_issued_at", nullable = false)
    private Instant clientIdIssuedAt;
    
    @Column(name = "client_secret", length = 200)
    private String clientSecret;
    
    @Column(name = "client_secret_expires_at")
    private Instant clientSecretExpiresAt;
    
    @Column(name = "client_name", length = 200, nullable = false)
    private String clientName;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "oauth2_client_authentication_methods",
        joinColumns = @JoinColumn(name = "client_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "authentication_method")
    @Builder.Default
    private Set<ClientAuthenticationMethod> clientAuthenticationMethods = new HashSet<>();
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "oauth2_client_grant_types",
        joinColumns = @JoinColumn(name = "client_id")
    )
    @Enumerated(EnumType.STRING)
    @Column(name = "grant_type")
    @Builder.Default
    private Set<AuthorizationGrantType> authorizationGrantTypes = new HashSet<>();
    
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "oauth2_client_redirect_uris",
        joinColumns = @JoinColumn(name = "client_id")
    )
    @Column(name = "redirect_uri", length = 500)
    @Builder.Default
    private Set<String> redirectUris = new HashSet<>();
    
    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(
        name = "oauth2_client_post_logout_redirect_uris",
        joinColumns = @JoinColumn(name = "client_id")
    )
    @Column(name = "post_logout_redirect_uri", length = 500)
    @Builder.Default
    private Set<String> postLogoutRedirectUris = new HashSet<>();
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
        name = "oauth2_client_scopes",
        joinColumns = @JoinColumn(name = "client_id")
    )
    @Column(name = "scope")
    @Builder.Default
    private Set<String> scopes = new HashSet<>();
    
    @Embedded
    private ClientSettings clientSettings;
    
    @Embedded
    private TokenSettings tokenSettings;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    @Column(name = "active", nullable = false)
    @Builder.Default
    private boolean active = true;
    
    // Helper methods
    public boolean hasGrantType(AuthorizationGrantType grantType) {
        return authorizationGrantTypes.contains(grantType);
    }
    
    public boolean hasScope(String scope) {
        return scopes.contains(scope);
    }
    
    public boolean isSecretExpired() {
        return clientSecretExpiresAt != null && Instant.now().isAfter(clientSecretExpiresAt);
    }
}




