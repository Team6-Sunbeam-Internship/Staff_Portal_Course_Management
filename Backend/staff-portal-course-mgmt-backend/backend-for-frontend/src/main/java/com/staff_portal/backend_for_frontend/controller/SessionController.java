package com.staff_portal.backend_for_frontend.controller;

import com.staff_portal.backend_for_frontend.dto.SessionResponse;
import com.staff_portal.backend_for_frontend.service.ISessionService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/bff")
@RequiredArgsConstructor
@Slf4j
public class SessionController {

    private final ISessionService sessionService;

    @Operation(summary = "Check session status", description = "Returns current authentication status and user information")
    @GetMapping("/session")
    public ResponseEntity<SessionResponse> checkSession(@AuthenticationPrincipal OidcUser user, Authentication authentication) {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(sessionService.checkSession(user, authentication));
    }
}