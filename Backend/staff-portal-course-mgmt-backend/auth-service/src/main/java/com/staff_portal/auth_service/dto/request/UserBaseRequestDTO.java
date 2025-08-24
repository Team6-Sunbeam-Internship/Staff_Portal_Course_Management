package com.staff_portal.auth_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record UserBaseRequestDTO(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email String email,
        @NotBlank String phoneNumber,
        @NotBlank String type,
        @NotBlank String address
) {}
