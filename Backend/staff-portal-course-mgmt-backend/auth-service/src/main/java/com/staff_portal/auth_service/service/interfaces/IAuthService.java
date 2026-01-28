package com.staff_portal.auth_service.service.interfaces;

import com.staff_portal.auth_service.dto.request.AuthUserDeleteReqDTO;
import com.staff_portal.auth_service.dto.request.AuthUserRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.model.users.AuthUser;
import org.springframework.security.core.Authentication;

import java.util.Optional;

public interface IAuthService {

    AuthUser createAuthUser(AuthUserRequestDTO createUserRequest);

    ApiResponse<String> changePassword(String oldPassword, String newPassword);

    ApiResponse<String> forgotPassword(String email);

    ApiResponse<?> createStaff(AuthUserRequestDTO createStaffRequest);

    Optional<AuthUser> findByEmail(String email);

    ApiResponse<String> deleteAuthUserSelf(Authentication authentication);

    ApiResponse<String> updateAuthUser(AuthUserRequestDTO authUserUpdateReqDTO, Authentication authentication);

    ApiResponse<String> deleteAuthUserByAdmin(AuthUserDeleteReqDTO userDeleteReqDTO);
}