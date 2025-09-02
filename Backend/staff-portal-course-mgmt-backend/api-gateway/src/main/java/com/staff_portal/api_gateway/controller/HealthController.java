package com.staff_portal.api_gateway.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/actuator")
@Tag(name = "Health", description = "Health and status endpoints")
public class HealthController {
    @GetMapping("/health")
    @Operation(summary = "Health check", description = "Returns the health status of the gateway")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("timestamp", Instant.now());
        health.put("version", "1.0.0");
        return ResponseEntity.ok(health);
    }
    @GetMapping("/info")
    @Operation(summary = "Application info", description = "Returns application information")
    public ResponseEntity<Map<String, Object>> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("app", "API Gateway");
        info.put("version", "1.0.0");
        info.put("description", "Enterprise API Gateway");
        info.put("timestamp", Instant.now());
        return ResponseEntity.ok(info);
    }
}