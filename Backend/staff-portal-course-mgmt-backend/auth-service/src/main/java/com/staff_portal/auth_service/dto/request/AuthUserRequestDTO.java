package com.staff_portal.auth_service.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.staff_portal.auth_service.model.users.AuthUser;
import lombok.*;
import lombok.experimental.SuperBuilder;
import lombok.extern.jackson.Jacksonized;

@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
@Jacksonized
public class AuthUserRequestDTO extends BaseStaffDTO {
    @JsonIgnore
    public AuthUser toAuthUser(String encodedPassword) {
        return AuthUser.builder()
                .firstName(getFirstName())
                .email(getEmail())
                .password(encodedPassword)
                .active(true)
                .emailVerified(false)
                .passwordChangeRequired(true)
                .build();
    }
}