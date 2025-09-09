package com.staff_portal.auth_service.service.interfaces;

import com.staff_portal.auth_service.dto.request.AuthUserRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.model.users.AuthUser;

import java.util.Optional;

public interface IAuthService {
    
    AuthUser createAuthUser(AuthUserRequestDTO createUserRequest);
    
    ApiResponse<String> changePassword(String oldPassword, String newPassword);
    
    ApiResponse<String> forgotPassword(String email);

    ApiResponse<String> createStaff(AuthUserRequestDTO createStaffRequest);
    
    Optional<AuthUser> findByEmail(String email);
}