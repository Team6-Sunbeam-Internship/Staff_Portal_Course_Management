package com.staff_portal.auth_service.dto.request;

import com.staff_portal.auth_service.model.user.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

public record CreateAuthUserRequestDTO(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String email,
        @NotBlank String phoneNumber,
        @NotBlank String address,
        @NotBlank String type,
        @NotBlank RoleName role) {
}