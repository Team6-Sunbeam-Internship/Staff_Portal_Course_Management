package com.staff_portal.backend_for_frontend.controller;

import com.staff_portal.backend_for_frontend.service.StatePreservationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@RequiredArgsConstructor
@Slf4j
public class LoginController {
    private final StatePreservationService statePreservationService;
    @Value("${bff.frontend.base-url}")
    private String frontendBaseUrl;
    @Operation(summary = "Display login page", description = "Shows custom login page with OAuth2 providers")
    @GetMapping("/login")
    public String login(HttpServletRequest request, Model model) {
        String redirectTo = request.getParameter("redirectTo");
        if (redirectTo != null) {
            statePreservationService.saveOriginalRequest(request, redirectTo);
        }
        model.addAttribute("authServerLoginUrl", "/oauth2/authorization/auth-service");
        model.addAttribute("frontendUrl", frontendBaseUrl);
        return "login";
    }
    @Operation(summary = "Spinner page", description = "Shows loading spinner during OAuth2 callback processing")
    @GetMapping("/spin")
    public String spin() {
        return "spin";
    }
}