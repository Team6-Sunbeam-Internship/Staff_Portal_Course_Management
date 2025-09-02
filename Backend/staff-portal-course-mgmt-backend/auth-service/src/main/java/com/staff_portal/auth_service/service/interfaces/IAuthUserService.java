package com.staff_portal.auth_service.service.interfaces;

import com.staff_portal.auth_service.dto.request.CreateAuthUserRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;

import java.util.UUID;

public interface IAuthUserService {
    UUID createAuthUser(CreateAuthUserRequestDTO createStaffRequest);
    void forgotPassword(String email);
    ApiResponse<String> changePassword(String oldPassword, String newPassword);
    ApiResponse<String> createStaff(CreateAuthUserRequestDTO createStaffRequest);
}
