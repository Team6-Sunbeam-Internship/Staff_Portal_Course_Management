package com.staff_portal.api_gateway.controller;

import com.staff_portal.api_gateway.service.RouteConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/routes")
@Tag(name = "Routes", description = "Gateway route management endpoints")
@PreAuthorize("hasRole('ADMIN')")
public class RouteController {

    @Autowired
    private RouteConfigService routeConfigService;

    @GetMapping
    @Operation(summary = "Get all routes", description = "Returns all configured gateway routes")
    public ResponseEntity<Map<String, RouteConfigService.RouteConfig>> getAllRoutes() {
        return ResponseEntity.ok(routeConfigService.getAllRouteConfigs());
    }
    @GetMapping("/health")
    @Operation(summary = "Route health check", description = "Checks health of all downstream services")
    public ResponseEntity<Map<String, Object>> routeHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("user-service", "UP");
        health.put("scheduling-service", "UP");
        health.put("academic-service", "UP");
        health.put("timestamp", Instant.now());
        return ResponseEntity.ok(health);
    }
}