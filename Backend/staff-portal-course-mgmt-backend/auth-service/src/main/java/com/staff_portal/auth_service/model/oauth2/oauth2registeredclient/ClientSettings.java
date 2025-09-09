package com.staff_portal.auth_service.model.oauth2.oauth2registeredclient;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClientSettings {
    
    @Column(name = "require_proof_key", nullable = false)
    @Builder.Default
    private boolean requireProofKey = false;
    
    @Column(name = "require_authorization_consent", nullable = false)
    @Builder.Default
    private boolean requireAuthorizationConsent = false;
    
    @Column(name = "jwk_set_url", length = 500)
    private String jwkSetUrl;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "token_endpoint_auth_signing_algorithm")
    private SignatureAlgorithm tokenEndpointAuthenticationSigningAlgorithm;

}
