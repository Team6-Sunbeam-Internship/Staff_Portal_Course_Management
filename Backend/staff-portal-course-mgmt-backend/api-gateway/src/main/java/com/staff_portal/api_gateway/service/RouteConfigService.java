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

    @Value("${gateway.services.user-service.url:http://user-service:8003}")
    private String userServiceUri;
    @Value("${gateway.services.user-service.audience:user-service}")
    private String userServiceAudience;
    @Value("${gateway.services.user-service.retry.max-attempts:3}")
    private int userServiceMaxAttempts;
    @Value("${gateway.services.user-service.path-prefix:/user}")
    private String userServicePathPrefix;

    @Value("${gateway.services.scheduling-service.url:http://schedule-session-timesheet-service:8005}")
    private String schedulingServiceUri;
    @Value("${gateway.services.scheduling-service.audience:scheduling-service}")
    private String schedulingServiceAudience;
    @Value("${gateway.services.scheduling-service.retry.max-attempts:3}")
    private int schedulingServiceMaxAttempts;
    @Value("${gateway.services.scheduling-service.path-prefix:/scheduling}")
    private String schedulingServicePathPrefix;

    @Value("${gateway.services.academic-service.url:http://academic-service:8004}")
    private String academicServiceUri;
    @Value("${gateway.services.academic-service.audience:academic-service}")
    private String academicServiceAudience;
    @Value("${gateway.services.academic-service.retry.max-attempts:3}")
    private int academicServiceMaxAttempts;
    @Value("${gateway.services.academic-service.path-prefix:/academic}")
    private String academicServicePathPrefix;

    private final Map<String, RouteConfig> routeConfigs = new ConcurrentHashMap<>();

    @PostConstruct
    public void initializeRoutes() {
        routeConfigs.put("user-service", new RouteConfig("user-service", userServiceUri, userServiceAudience, userServiceMaxAttempts, userServicePathPrefix));
        routeConfigs.put("schedule-session-timesheet-service", new RouteConfig("schedule-session-timesheet--service", schedulingServiceUri, schedulingServiceAudience, schedulingServiceMaxAttempts, schedulingServicePathPrefix));
        routeConfigs.put("academic-service", new RouteConfig("academic-service", academicServiceUri, academicServiceAudience, academicServiceMaxAttempts, academicServicePathPrefix));

        log.info("Initialized {} route configurations", routeConfigs.size());
        routeConfigs.forEach((key, config) ->
                log.info("Route: {} -> {} (audience: {}, retries: {}, path-prefix: {})", key, config.getServiceUri(), config.getRequiredAudience(), config.getMaxRetryAttempts(), config.getPathPrefix()));
    }

    public Optional<RouteConfig> getRouteConfig(String serviceName) {
        return Optional.ofNullable(routeConfigs.get(serviceName));
    }

    public Map<String, RouteConfig> getAllRouteConfigs() {
        return new HashMap<>(routeConfigs);
    }

    /**
     * Get route config by path prefix
     */
    public Optional<RouteConfig> getRouteConfigByPath(String path) {
        log.info("PATH: {}", path);
        return routeConfigs.values().stream().filter(config -> path.startsWith(config.getPathPrefix())).findFirst();
    }

    @Deprecated
    public String getServiceUriByPath(String path) {
        log.debug("getServiceUriByPath {}", path);
        return getRouteConfigByPath(path)
                .map(RouteConfig::getServiceUri)
                .orElseThrow(() -> new IllegalArgumentException("No route configuration found for path: " + path));
    }

    @Deprecated
    public String getRequiredAudienceByPath(String path) {
        return getRouteConfigByPath(path)
                .map(RouteConfig::getRequiredAudience)
                .orElseThrow(() -> new IllegalArgumentException("No audience configuration found for path: " + path));
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RouteConfig {
        private String serviceName;
        private String serviceUri;
        private String requiredAudience;
        private int maxRetryAttempts;
        private String pathPrefix;
    }
}