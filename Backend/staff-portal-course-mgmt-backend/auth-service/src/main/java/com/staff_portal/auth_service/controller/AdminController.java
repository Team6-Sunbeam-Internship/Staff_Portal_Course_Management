package com.staff_portal.auth_service.controller;

import com.staff_portal.auth_service.dto.request.AuthUserDeleteReqDTO;
import com.staff_portal.auth_service.dto.request.AuthUserRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.service.interfaces.IAuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@Slf4j
public class AdminController {

    private final IAuthService authService;

    public AdminController(IAuthService authService) {
        this.authService = authService;
    }

    // Create Staff(Admin, Course_Coordinator, General_User)
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('STAFF_WRITE')")
    @PostMapping("/createStaff")
    public ResponseEntity<ApiResponse<?>> createStaff(@RequestBody AuthUserRequestDTO authUserRequestDTO) {
        ApiResponse<?> createStaffResponse = authService.createStaff(authUserRequestDTO);
        return ResponseEntity.ok(createStaffResponse);
    }

    @PreAuthorize("hasRole('ADMIN') and hasAuthority('STAFF_WRITE')")
    @DeleteMapping("/deleteStaff")
    public ResponseEntity<ApiResponse<String>> deleteAuthUserByAdmin(@RequestBody AuthUserDeleteReqDTO authUserDeleteReqDTO) {
        return ResponseEntity.ok(authService.deleteAuthUserByAdmin(authUserDeleteReqDTO));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/updateStaff")
    public ResponseEntity<ApiResponse<String>> updateAuthUser(@RequestBody AuthUserRequestDTO authUserUpdateReqDTO, Authentication authentication) {
        return ResponseEntity.ok(authService.updateAuthUser(authUserUpdateReqDTO, authentication));
    }
}
