package com.staff_portal.auth_service.controller;

import com.staff_portal.auth_service.dto.request.UserChangePasswordRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.service.interfaces.IAuthUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final IAuthUserService authUserService;

    public AuthController(IAuthUserService authUserService) {
        this.authUserService = authUserService;
    }

    // change password
    @PreAuthorize("""
            hasAuthority('PASSWORD_CHANGE') \
            and \
            hasRole('ADMIN') \
            or \
            hasRole('COURSE_COORDINATOR') \
            or \
            hasRole('GENERAL_USER')""")
    @PutMapping("/changePassword")
    public ResponseEntity<ApiResponse<String>> changePassword(@RequestBody UserChangePasswordRequestDTO userChangePasswordRequestDTO){
        String oldPassword = userChangePasswordRequestDTO.oldPassword();
        String newPassword = userChangePasswordRequestDTO.newPassword();
        ApiResponse<String> response = authUserService.changePassword(oldPassword, newPassword);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}
