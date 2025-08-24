package com.staff_portal.auth_service.dto.request;

public record UserChangePasswordRequestDTO(String oldPassword, String newPassword) {
}
