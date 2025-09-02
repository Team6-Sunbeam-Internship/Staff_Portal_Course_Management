package com.staff_portal.api_gateway.service;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class RouteConfigService {
    @Value("${gateway.services.user-service.url:http://user-service}")
    private String userServiceUri;
    @Value("${gateway.services.user-service.audience:user-service}")
    private String userServiceAudience;
    @Value("${gateway.services.scheduling-service.url:http://scheduling-service}")
    private String schedulingServiceUri;
    @Value("${gateway.services.scheduling-service.audience:scheduling-service}")
    private String schedulingServiceAudience;
    @Value("${gateway.services.academic-service.url:http://academic-service}")
    private String academicServiceUri;
    @Value("${gateway.services.academic-service.audience:academic-service}")
    private String academicServiceAudience;
    private final Map<String, RouteConfig> routeConfigs = new ConcurrentHashMap<>();
    @PostConstruct
    public void initializeRoutes() {
        routeConfigs.put("user-service", new RouteConfig("user-service", userServiceUri, userServiceAudience));
        routeConfigs.put("scheduling-service", new RouteConfig("scheduling-service", schedulingServiceUri, schedulingServiceAudience));
        routeConfigs.put("academic-service", new RouteConfig("academic-service", academicServiceUri, academicServiceAudience));
        log.info("Initialized {} route configurations", routeConfigs.size());
    }
    public Optional<RouteConfig> getRouteConfig(String serviceName) {
        return Optional.ofNullable(routeConfigs.get(serviceName));
    }
    public Map<String, RouteConfig> getAllRouteConfigs() {
        return new HashMap<>(routeConfigs);
    }
    public String getServiceUriByPath(String path) {
        if (path.startsWith("/apig/user")) {
            return userServiceUri;
        } else if (path.startsWith("/apig/scheduling")) {
            return schedulingServiceUri;
        } else if (path.startsWith("/apig/academic")) {
            return academicServiceUri;
        }
        throw new IllegalArgumentException("No route configuration found for path: " + path);
    }
    public String getRequiredAudienceByPath(String path) {
        if (path.startsWith("/apig/user")) {
            return userServiceAudience;
        } else if (path.startsWith("/apig/scheduling")) {
            return schedulingServiceAudience;
        } else if (path.startsWith("/apig/academic")) {
            return academicServiceAudience;
        }
        throw new IllegalArgumentException("No audience configuration found for path: " + path);
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RouteConfig {
        private String serviceName;
        private String serviceUri;
        private String requiredAudience;
    }
}