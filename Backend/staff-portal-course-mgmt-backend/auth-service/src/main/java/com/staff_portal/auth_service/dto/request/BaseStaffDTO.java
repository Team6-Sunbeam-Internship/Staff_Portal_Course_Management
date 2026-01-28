package com.staff_portal.auth_service.dto.request;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.staff_portal.auth_service.model.users.RoleType;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class BaseStaffDTO {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 100, message = "First name must be between 2 and 100 characters")
    private String firstName;

    @Size(max = 100, message = "Last name must not exceed 100 characters")
    private String lastName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number format")
    private String phoneNumber;

    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;

    private String gender;

    @NotNull(message = "Role is required")
    @Enumerated(EnumType.STRING)
    private RoleType role;

    @NotBlank(message = "Staff type is required")
    private String staffType;

    @NotBlank(message = "Course specialization is required")
    private String courseSpecialization;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private UUID authUserId;
}