package com.staff_portal.auth_service.repository;

import com.staff_portal.auth_service.model.oauth2.oauth2authorization.OAuth2AuthorizationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OAuth2AuthorizationRepository extends JpaRepository<OAuth2AuthorizationEntity, String> {

    Optional<OAuth2AuthorizationEntity> findByState(String state);

    @Query("SELECT a FROM OAuth2AuthorizationEntity a " +
            "JOIN a.oauth2AuthorizationCode ac " +
            "JOIN ac.authorizationCode t " +
            "WHERE t.tokenValue = :token")
    Optional<OAuth2AuthorizationEntity> findByAuthorizationCodeValue(@Param("token") String token);

    @Query("SELECT a FROM OAuth2AuthorizationEntity a " +
            "JOIN a.oauth2AccessToken at " +
            "JOIN at.accessToken t " +
            "WHERE t.tokenValue = :token")
    Optional<OAuth2AuthorizationEntity> findByAccessTokenValue(@Param("token") String token);

    @Query("SELECT a FROM OAuth2AuthorizationEntity a " +
            "JOIN a.oauth2RefreshToken rt " +
            "JOIN rt.refreshToken t " +
            "WHERE t.tokenValue = :token")
    Optional<OAuth2AuthorizationEntity> findByRefreshTokenValue(@Param("token") String token);

    @Query("SELECT a FROM OAuth2AuthorizationEntity a " +
            "JOIN a.oidcIdToken it " +
            "JOIN it.oidcIdToken t " +
            "WHERE t.tokenValue = :token")
    Optional<OAuth2AuthorizationEntity> findByOidcIdTokenValue(@Param("token") String token);

    @Query("SELECT a FROM OAuth2AuthorizationEntity a " +
            "JOIN a.userCode uc " +
            "JOIN uc.userCode t " +
            "WHERE t.tokenValue = :token")
    Optional<OAuth2AuthorizationEntity> findByUserCodeValue(@Param("token") String token);

    @Query("SELECT a FROM OAuth2AuthorizationEntity a " +
            "JOIN a.deviceCode dc " +
            "JOIN dc.deviceCode t " +
            "WHERE t.tokenValue = :token")
    Optional<OAuth2AuthorizationEntity> findByDeviceCodeValue(@Param("token") String token);

    @Query("SELECT a FROM OAuth2AuthorizationEntity a " +
            "LEFT JOIN a.oauth2AuthorizationCode ac " +
            "LEFT JOIN ac.authorizationCode act " +
            "LEFT JOIN a.oauth2AccessToken at " +
            "LEFT JOIN at.accessToken att " +
            "LEFT JOIN a.oauth2RefreshToken rt " +
            "LEFT JOIN rt.refreshToken rtt " +
            "LEFT JOIN a.oidcIdToken it " +
            "LEFT JOIN it.oidcIdToken itt " +
            "LEFT JOIN a.userCode uc " +
            "LEFT JOIN uc.userCode uct " +
            "LEFT JOIN a.deviceCode dc " +
            "LEFT JOIN dc.deviceCode dct " +
            "WHERE a.state = :token " +
            "OR act.tokenValue = :token " +
            "OR att.tokenValue = :token " +
            "OR rtt.tokenValue = :token " +
            "OR itt.tokenValue = :token " +
            "OR uct.tokenValue = :token " +
            "OR dct.tokenValue = :token")
    Optional<OAuth2AuthorizationEntity> findByStateOrAuthorizationCodeValueOrAccessTokenValueOrRefreshTokenValueOrOidcIdTokenValueOrUserCodeValueOrDeviceCodeValue(@Param("token") String token);
}