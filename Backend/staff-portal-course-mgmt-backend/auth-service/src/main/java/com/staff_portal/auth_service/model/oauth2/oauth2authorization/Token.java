package com.staff_portal.auth_service.model.oauth2.oauth2authorization;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "token_data")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Token {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "token_value", columnDefinition = "TEXT")
    private String tokenValue;

    @Column(name = "issued_at")
    private Instant issuedAt;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @OneToOne(mappedBy = "authorizationCode")
    private OAuth2AuthorizationCodeEntity oauth2AuthorizationCode;

    @OneToOne(mappedBy = "accessToken")
    private OAuth2AccessTokenEntity oauth2AccessToken;

    @OneToOne(mappedBy = "refreshToken")
    private OAuth2RefreshTokenEntity oauth2RefreshToken;

    @OneToOne(mappedBy = "oidcIdToken")
    private OidcIdTokenEntity oidcIdToken;

    @OneToOne(mappedBy = "deviceCode")
    private OAuth2DeviceCodeEntity oauth2DeviceCode;

    @OneToOne(mappedBy = "userCode")
    private OAuth2UserCodeEntity oauth2UserCodeEntity;
}
