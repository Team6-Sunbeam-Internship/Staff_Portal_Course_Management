package com.staff_portal.auth_service.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.staff_portal.auth_service.model.user.RoleName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Builder
@Setter
@Getter
public class CreateAuthUserRequestDTO {
    @NotBlank
    String firstName;
    @NotBlank
    String lastName;
    @JsonIgnore
    @Email
    @NotBlank
    String email; // Ignore while sending to UserService
    @NotBlank
    String phoneNumber;
    @NotBlank
    String address;
    @NotBlank
    String type;
    @JsonIgnore
    @NotBlank
    RoleName role; // Ignore while sending to UserService
    @JsonInclude(JsonInclude.Include.NON_NULL)
    UUID authUserId;
}