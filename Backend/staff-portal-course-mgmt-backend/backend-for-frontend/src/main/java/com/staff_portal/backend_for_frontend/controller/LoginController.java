package com.staff_portal.backend_for_frontend.controller;

import com.staff_portal.backend_for_frontend.repository.IRedisClientRegistrationRepository;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.Map;

@Controller
@Slf4j
public class LoginController {
    @Value("${bff.frontend.base-url}")
    private String frontendBaseUrl;
    private final IRedisClientRegistrationRepository redisClientRegistrationRepository;

    public LoginController(IRedisClientRegistrationRepository redisClientRegistrationRepository) {
        this.redisClientRegistrationRepository = redisClientRegistrationRepository;
    }

    @Operation(summary = "Display login page", description = "Shows custom login page with OAuth2 providers")
    @GetMapping("/login")
    public String login(HttpServletRequest request, Model model) {
        Map<String, String> authUrls = new HashMap<>();
        redisClientRegistrationRepository.iterator().forEachRemaining(provider ->
                authUrls.put(
                        provider.getRegistrationId(),
                        "/oauth2/authorization/" + provider.getRegistrationId()
                ) );
        model.addAttribute("authUrls", authUrls);
//        model.addAttribute("authServerLoginUrl", "/oauth2/authorization/auth-service");
        model.addAttribute("frontendUrl", frontendBaseUrl);
        return "login";
    }

    @Operation(summary = "Spinner page", description = "Shows loading spinner during OAuth2 callback processing")
    @GetMapping("/spin")
    public String spin() {
        return "spin";
    }
}