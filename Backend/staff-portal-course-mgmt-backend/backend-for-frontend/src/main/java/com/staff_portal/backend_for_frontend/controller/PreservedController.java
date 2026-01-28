package com.staff_portal.backend_for_frontend.controller;

import com.staff_portal.backend_for_frontend.dto.PreserveCommandDTO;
import com.staff_portal.backend_for_frontend.service.PreserveCommandStoreService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/bff")
public class PreservedController {
    private final PreserveCommandStoreService preserveCommandStoreService;

    public PreservedController(PreserveCommandStoreService preserveCommandStoreService) {
        this.preserveCommandStoreService = preserveCommandStoreService;
    }

    @GetMapping("/session/preserved-commands")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<PreserveCommandDTO>> getPreservedCommands(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return ResponseEntity.ok(List.of());
        }
        return ResponseEntity.ok(preserveCommandStoreService.drain(session.getId()));
    }
}
