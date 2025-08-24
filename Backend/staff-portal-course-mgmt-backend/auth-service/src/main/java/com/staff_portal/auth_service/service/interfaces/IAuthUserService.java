package com.staff_portal.auth_service.service.interfaces;

import com.staff_portal.auth_service.dto.request.CreateAuthUserRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;

public interface IAuthUserService {
    ApiResponse<String> createAuthUser(CreateAuthUserRequestDTO createStaffRequest);
    void forgotPassword(String email);
    ApiResponse<String> changePassword(String oldPassword, String newPassword);
}
