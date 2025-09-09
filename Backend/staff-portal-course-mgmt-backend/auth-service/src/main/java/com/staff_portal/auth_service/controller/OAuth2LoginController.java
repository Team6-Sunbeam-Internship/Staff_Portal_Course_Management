package com.staff_portal.auth_service.controller;


import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Slf4j
public class OAuth2LoginController {

    @GetMapping("/login")
    public String login(@RequestParam(value = "error", required = false) String error,
                        Model model,
                        @ModelAttribute("changePassword") Boolean changePassword,
                        HttpServletRequest request) {
        log.info("LoginController.login() called from: {}", request.getRequestURI());
        log.info("Request parameters - error: {}", error);
        if (Boolean.TRUE.equals(changePassword)) {
            model.addAttribute("changePasswordMessage",
                    "Password changed successfully! " +
                            "Please Login with new password.");
        }
        if (error != null) {
            switch (error) {
                case "username":
                    model.addAttribute("errorMessage", "Invalid username!");
                    break;
                case "password":
                    model.addAttribute("errorMessage", "Invalid password!");
                    break;
                default:
                    model.addAttribute("errorMessage", "Login failed. Please try again.");
            }
        }

        return "login";
    }
}
