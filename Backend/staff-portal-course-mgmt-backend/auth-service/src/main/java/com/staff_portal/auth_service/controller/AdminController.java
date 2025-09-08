package com.staff_portal.auth_service.controller;

import com.staff_portal.auth_service.dto.request.AuthUserRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.service.interfaces.IAuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@Slf4j
public class AdminController {

    private final IAuthService authService;

    public AdminController(IAuthService authService) {
        this.authService = authService;
    }

    // Create Staff(Admin, Course_Coordinator, General_User)
    @PreAuthorize("hasRole('ADMIN') and hasAuthority('STAFF_WRITE')" )
    @PostMapping("/createStaff")
    public ResponseEntity<ApiResponse<String>> createStaff(@RequestBody AuthUserRequestDTO authUserRequestDTO) {
        ApiResponse<String> createStaffResponse = authService.createStaff(authUserRequestDTO);
        return ResponseEntity.ok(createStaffResponse);
    }
}
