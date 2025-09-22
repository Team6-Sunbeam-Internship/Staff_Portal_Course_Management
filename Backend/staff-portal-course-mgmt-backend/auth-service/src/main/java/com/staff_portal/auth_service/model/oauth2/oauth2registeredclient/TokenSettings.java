package com.staff_portal.auth_service.model.oauth2.oauth2registeredclient;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenSettings {
    
    @Column(name = "authorization_code_time_to_live", nullable = false)
    @Builder.Default
    private Duration authorizationCodeTimeToLive = Duration.ofMinutes(5);
    
    @Column(name = "access_token_time_to_live", nullable = false)
    @Builder.Default
    private Duration accessTokenTimeToLive = Duration.ofMinutes(30);
    
    @Enumerated(EnumType.STRING)
    @Column(name = "access_token_format")
    @Builder.Default
    private OAuth2TokenFormat accessTokenFormat = OAuth2TokenFormat.SELF_CONTAINED;
    
    @Column(name = "reuse_refresh_tokens", nullable = false)
    @Builder.Default
    private boolean reuseRefreshTokens = true;
    
    @Column(name = "refresh_token_time_to_live", nullable = false)
    @Builder.Default
    private Duration refreshTokenTimeToLive = Duration.ofDays(30);
    
    @Enumerated(EnumType.STRING)
    @Column(name = "id_token_signature_algorithm")
    @Builder.Default
    private SignatureAlgorithm idTokenSignatureAlgorithm = SignatureAlgorithm.RS256;
}