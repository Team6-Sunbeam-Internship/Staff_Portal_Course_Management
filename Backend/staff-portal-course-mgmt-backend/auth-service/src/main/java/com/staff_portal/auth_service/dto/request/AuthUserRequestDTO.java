package com.staff_portal.auth_service.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.staff_portal.auth_service.model.users.AuthUser;
import com.staff_portal.auth_service.model.users.RoleType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class AuthUserRequestDTO extends BaseStaffDTO {
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;
    
    @NotNull(message = "Role is required")
    @Enumerated(EnumType.STRING)
    private RoleType role;
    
    @JsonIgnore
    public AuthUser toAuthUser(String encodedPassword) {
        return AuthUser.builder()
                .firstName(getFirstName())
                .email(email)
                .password(encodedPassword)
                .active(true)
                .emailVerified(false)
                .passwordChangeRequired(true)
                .build();
    }
}