package com.staff_portal.auth_service.controller;

import com.staff_portal.auth_service.dto.request.ChangePasswordRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.service.interfaces.IAuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class ForceChangePasswordController {

    private final IAuthService authService;

    public ForceChangePasswordController(IAuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/force-change-password")
    public String forceChangePassword() {
        return "change-password";
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/force-change-password")
    public String handleForceChange(@ModelAttribute ChangePasswordRequestDTO changePasswordRequestDTO,
                                    Model model,
                                    Authentication authentication,
                                    HttpServletRequest request) {
        String oldPassword = changePasswordRequestDTO.getOldPassword();
        String newPassword = changePasswordRequestDTO.getNewPassword();
        if (!changePasswordRequestDTO.isPasswordMatching()) {
            model.addAttribute("errorMessage", "New Password and confirm password do not match");
            return "change-password";
        }
        ApiResponse<String> changePasswordResponse = authService.changePassword(oldPassword, newPassword);
        if (changePasswordResponse.isSuccess()) {
            SecurityContextHolder.clearContext();
        } else {
            model.addAttribute("error", changePasswordResponse.getError());
        }
        return "redirect:/login";
    }

}
