package com.staff_portal.auth_service.model.oauth2.oauth2authorizationconsent;

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
import java.util.stream.Collectors;

@Entity
@Table(name = "oauth2_authorization_consent")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuth2AuthorizationConsentEntity {
    
    @EmbeddedId
    private OAuth2AuthorizationConsentId id;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "oauth2_consent_authorities",
            joinColumns = {
                    @JoinColumn(name = "registered_client_id", referencedColumnName = "registered_client_id"),
                    @JoinColumn(name = "principal_name", referencedColumnName = "principal_name")
            }
            // Optional but recommended to avoid duplicates:
             , uniqueConstraints = @UniqueConstraint(
                 name = "uc_oauth2_consent_authority",
                 columnNames = {"registered_client_id", "principal_name", "authority"}
             )
    )
    @Column(name = "authority", nullable = false, length = 200)
    @Builder.Default
    private Set<String> authorities = new HashSet<>();
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
    
    // Constructor for convenience
    public OAuth2AuthorizationConsentEntity(String registeredClientId, String principalName, Set<String> authorities) {
        this.id = new OAuth2AuthorizationConsentId(registeredClientId, principalName);
        this.authorities = authorities != null ? new HashSet<>(authorities) : new HashSet<>();
    }
    
    // Helper methods
    public String getRegisteredClientId() {
        return id != null ? id.getRegisteredClientId() : null;
    }
    
    public String getPrincipalName() {
        return id != null ? id.getPrincipalName() : null;
    }
    
    public void addAuthority(String authority) {
        this.authorities.add(authority);
    }
    
    public void removeAuthority(String authority) {
        this.authorities.remove(authority);
    }
    
    public boolean hasAuthority(String authority) {
        return this.authorities.contains(authority);
    }
    
    public Set<String> getScopes() {
        return authorities.stream()
            .filter(authority -> authority.startsWith("SCOPE_"))
            .map(authority -> authority.substring(6))
            .collect(Collectors.toSet());
    }
}