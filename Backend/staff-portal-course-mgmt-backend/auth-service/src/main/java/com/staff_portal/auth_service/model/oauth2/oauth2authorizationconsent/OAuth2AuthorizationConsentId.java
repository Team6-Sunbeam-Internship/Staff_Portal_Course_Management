package com.staff_portal.auth_service.model.oauth2.oauth2authorizationconsent;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuth2AuthorizationConsentId implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Column(name = "registered_client_id", length = 100)
    private String registeredClientId;
    
    @Column(name = "principal_name", length = 200)
    private String principalName;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OAuth2AuthorizationConsentId that = (OAuth2AuthorizationConsentId) o;
        return Objects.equals(registeredClientId, that.registeredClientId) &&
               Objects.equals(principalName, that.principalName);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(registeredClientId, principalName);
    }
}
