package com.staff_portal.auth_service.model.oauth2.oauth2authorization;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "oidc_id_token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OidcIdTokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

//    @OneToOne
//    @JoinColumn(name = "authorization_id", referencedColumnName = "id")
//    private OAuth2AuthorizationEntity authorization;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "oidc_id_token_id", referencedColumnName = "id")
    private Token oidcIdToken;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "claims", columnDefinition = "json")
    private Map<String, Object> claims;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name= "metadata", columnDefinition = "json")
    private Map<String, Object> metadata;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}
