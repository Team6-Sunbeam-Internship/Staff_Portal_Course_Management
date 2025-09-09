package com.staff_portal.auth_service.controller;

import com.staff_portal.auth_service.dto.request.ChangePasswordRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.exception.PasswordMismatchException;
import com.staff_portal.auth_service.service.interfaces.IAuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthUserController {

    private final IAuthService authService;

    public AuthUserController(IAuthService authService) {
        this.authService = authService;
    }

    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/changePassword")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody ChangePasswordRequestDTO changePasswordRequestDTO) {
        if(!changePasswordRequestDTO.isPasswordMatching()){
            throw new PasswordMismatchException("Please enter correct confirm password", HttpStatus.CONFLICT);
        }
        ApiResponse<String> changePasswordResponse = authService.changePassword(changePasswordRequestDTO.getOldPassword(), changePasswordRequestDTO.getNewPassword());
        return ResponseEntity.ok(changePasswordResponse);
    }
}
