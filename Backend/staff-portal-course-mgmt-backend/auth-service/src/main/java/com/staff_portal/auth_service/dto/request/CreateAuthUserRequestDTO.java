package com.staff_portal.auth_service.dto.request;

import com.staff_portal.auth_service.model.user.RoleName;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

@Builder
public record CreateAuthUserRequestDTO(UserBaseRequestDTO base, @NotBlank RoleName role) {}