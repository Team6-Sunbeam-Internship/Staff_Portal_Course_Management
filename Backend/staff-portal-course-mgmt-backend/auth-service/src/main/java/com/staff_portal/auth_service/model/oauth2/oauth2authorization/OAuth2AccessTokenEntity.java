package com.staff_portal.auth_service.model.oauth2.oauth2authorization;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Entity
@Table(name = "oauth2_access_token")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OAuth2AccessTokenEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

//    @OneToOne
//    @JoinColumn(name = "authorization_id", referencedColumnName = "id")
//    private OAuth2AuthorizationEntity authorization;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "access_token_id", referencedColumnName = "id")
    private Token accessToken;

    @Enumerated(EnumType.STRING)
    @Column(name = "token_type")
    private TokenType tokenType;

    @Column(name = "scopes", columnDefinition = "json")
    @JdbcTypeCode(SqlTypes.JSON)
    @Builder.Default
    private Set<String> scopes = new HashSet<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name= "metadata", columnDefinition = "json")
    private Map<String, Object> metadata;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}
