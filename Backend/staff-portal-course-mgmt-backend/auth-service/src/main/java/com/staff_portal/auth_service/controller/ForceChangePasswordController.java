package com.staff_portal.auth_service.controller;

import com.staff_portal.auth_service.dto.request.ChangePasswordRequestDTO;
import com.staff_portal.auth_service.dto.response.ApiResponse;
import com.staff_portal.auth_service.service.interfaces.IAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

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
    public String handleForceChange(
            @ModelAttribute ChangePasswordRequestDTO changePasswordRequestDTO,
            Model model,
            RedirectAttributes redirectAttributes,
            Authentication authentication,
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        // Validation: new + confirm mismatch
        if (!changePasswordRequestDTO.isPasswordMatching()) {
            model.addAttribute("errorMessage",
                    "New Password and confirm password do not match");
            return "change-password";
        }

        // Attempt password change
        ApiResponse<String> changePasswordResponse =
                authService.changePassword(
                        changePasswordRequestDTO.getOldPassword(),
                        changePasswordRequestDTO.getNewPassword()
                );

        // Backend failure → stay on same page
        if (!changePasswordResponse.isSuccess()) {
            model.addAttribute("error",
                    changePasswordResponse.getError());
            return "change-password";
        }

        // SUCCESS: logout properly (preserves SavedRequest!)
        SecurityContextLogoutHandler securityContextLogoutHandler = new SecurityContextLogoutHandler();
        securityContextLogoutHandler.setInvalidateHttpSession(false);
        securityContextLogoutHandler.logout(request, response, authentication);

        // Flash attribute for login page
        redirectAttributes.addFlashAttribute(
                "changePassword",
                true
        );

        // Redirect to login (OAuth flow resumes automatically after re-login)
        return "redirect:/login";
    }
}
