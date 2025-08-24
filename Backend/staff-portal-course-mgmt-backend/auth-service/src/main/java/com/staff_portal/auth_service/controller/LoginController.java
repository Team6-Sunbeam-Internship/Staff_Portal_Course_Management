package com.staff_portal.auth_service.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@Slf4j
public class LoginController {

    @GetMapping("/login")
    public String login(@RequestParam(value = "error", required = false) String error,
                        @RequestParam(value = "logout", required = false) String logout,
                        Model model,
                        HttpServletRequest request) {
        log.info("LoginController.login() called from: {}", request.getRequestURI());
        log.info("Request parameters - error: {}, logout: {}", error, logout);

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

        if (logout != null) {
            model.addAttribute("logoutMessage", "You have been logged out successfully!");
        }
        return "login";
    }

//    @GetMapping("/dashboard")
//    public String dashboard() {
//        log.info("Dashboard accessed successfully");
//        return "dashboard";
//    }
}
