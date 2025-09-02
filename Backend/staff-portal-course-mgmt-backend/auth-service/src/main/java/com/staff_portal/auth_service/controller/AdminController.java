package com.staff_portal.auth_service.controller;

import com.staff_portal.auth_service.dto.request.CreateAuthUserRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.service.interfaces.IAuthUserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final IAuthUserService authUserService;

    public AdminController(IAuthUserService authUserService) {
        this.authUserService = authUserService;
    }

    @PreAuthorize("hasRole('ADMIN') and hasAuthority('STAFF_WRITE')")
    @PostMapping("/createAuthUser")
    public ResponseEntity<ApiResponse<String>> createAuthUser(@RequestBody CreateAuthUserRequestDTO createAuthUserRequestDTO) {
        UUID authUserId = authUserService.createAuthUser(createAuthUserRequestDTO);
        createAuthUserRequestDTO.setAuthUserId(authUserId);
        ApiResponse<String> response = authUserService.createStaff(createAuthUserRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
