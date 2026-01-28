package com.staff_portal.api_gateway.config;

import com.staff_portal.api_gateway.exception.ErrorHandlerFilterFactory;
import com.staff_portal.api_gateway.filter.AudienceEnforcementGatewayFilterFactory;
import com.staff_portal.api_gateway.filter.LoggingGatewayFilterFactory;
import com.staff_portal.api_gateway.service.RouteConfigService;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.RequestPredicate;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.stripPrefix;
import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.uri;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.method;
import static org.springframework.cloud.gateway.server.mvc.predicate.GatewayRequestPredicates.path;
import static org.springframework.http.HttpMethod.*;

@Configuration
@Slf4j
public class GatewayConfig {
    @Autowired
    private RouteConfigService routeConfigService;
    @Autowired
    private ErrorHandlerFilterFactory errorHandlerFilterFactory;
    @Autowired
    private LoggingGatewayFilterFactory loggingFilterFactory;
    @Autowired
    private AudienceEnforcementGatewayFilterFactory audienceEnforcementFilterFactory;
    @Autowired
    JwtDecoder jwtDecoder;
    private static final HttpMethod[] ALL_METHODS = {
            GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD, TRACE
    };

    @Bean
    RouterFunction<ServerResponse> gatewayRoutes(CircuitBreakerFactory<?,?> circuitBreakerFactory) {
        log.info("=== Initializing API Gateway Routes ===");

        return routeConfigService.getAllRouteConfigs()
                .values()
                .stream()
                .map(config -> createRoute(config, circuitBreakerFactory))
                .reduce(RouterFunction::and)
                .orElseThrow(() -> new IllegalStateException("No routes configured"));
    }

    private RouterFunction<ServerResponse> createRoute(RouteConfigService.RouteConfig config, CircuitBreakerFactory<?, ?> circuitBreakerFactory) {
        String pathPrefix = config.getPathPrefix();
        String serviceUrl = config.getServiceUri();
        String serviceName = config.getServiceName();
        String requiredAudience = config.getRequiredAudience();
        String routeId = serviceName + "_route";

        log.info("Registering route: {} -> {} (audience: {}, retries: {}", pathPrefix, serviceUrl, requiredAudience, config.getMaxRetryAttempts());

        RequestPredicate predicate = path(pathPrefix + "/**").and(method(ALL_METHODS));

        return route(routeId)
                .route(predicate, http())
                .filter(createLoggingFilter())
                .filter(createAudienceFilter(requiredAudience))
                .before(stripPrefix(1))
                .before(uri(serviceUrl))
                .filter(createRetryFilter(config.getMaxRetryAttempts(), serviceName))
                .filter(createCircuitBreakerFilter(circuitBreakerFactory, serviceName))
                .filter(createErrorHandlerFilter(serviceName))
                .build();
    }

    /**
     * Creates logging filter using factory
     */
    private HandlerFilterFunction<ServerResponse, ServerResponse> createLoggingFilter() {
        LoggingGatewayFilterFactory.Config config = new LoggingGatewayFilterFactory.Config();
        config.setLogHeaders(false); // Set to true for debug
        config.setLogBody(false);
        return loggingFilterFactory.apply(config);
    }

    /**
     * Creates audience enforcement filter using factory
     */
    private HandlerFilterFunction<ServerResponse, ServerResponse> createAudienceFilter(String requiredAudience) {
        AudienceEnforcementGatewayFilterFactory.Config config =
                new AudienceEnforcementGatewayFilterFactory.Config();
        config.setRequiredAudience(requiredAudience);
        return audienceEnforcementFilterFactory.apply(config);
    }

    /**
     * Creates error handler filter using factory
     */
    private HandlerFilterFunction<ServerResponse, ServerResponse> createErrorHandlerFilter(String serviceName) {
        ErrorHandlerFilterFactory.Config config = new ErrorHandlerFilterFactory.Config();
        config.setServiceName(serviceName);
        config.setIncludeStackTrace(false); // Set to true for development
        return errorHandlerFilterFactory.apply(config);
    }

    private HandlerFilterFunction<ServerResponse, ServerResponse> createRetryFilter(int maxAttempts, String serviceName) {
        return (request, next) -> {
            int attempt = 0;

            while (attempt < maxAttempts) {
                try {
                    return next.handle(request);
                } catch (Exception e) {
                    attempt++;
                    if (attempt >= maxAttempts) {
                        log.error("All retry attempts failed for service: {}", serviceName);
                        return ServerResponse.status(HttpStatus.SERVICE_UNAVAILABLE)
                                .contentType(MediaType.APPLICATION_JSON)
                                .body("{\"error\":\"max_retries_exceeded\",\"message\":\"Request failed after " + maxAttempts + " attempts\"}");
                    }
                    long backoffMs = calculateBackoff(attempt);
                    log.warn("Retry attempt {}/{} failed for service '{}', retrying after {}ms", attempt, maxAttempts, serviceName, backoffMs);
                    try {
                        Thread.sleep(backoffMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
            log.error("All retry attempts failed");
            return ServerResponse.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\":\"max_retries_exceeded\",\"message\":\"Request failed after " + maxAttempts + " attempts\"}");
        };
    }

    private long calculateBackoff(int attempt) {
        return (long) Math.min(1000L * Math.pow(2, attempt - 1), 10000L);
    }

    /**
     * Circuit Breaker Filter
     */
    private HandlerFilterFunction<ServerResponse, ServerResponse> createCircuitBreakerFilter(
            CircuitBreakerFactory<?, ?> circuitBreakerFactory, String serviceName) {
        return (request, next) -> {
            CircuitBreaker circuitBreaker = circuitBreakerFactory.create(serviceName);
            try {
                return circuitBreaker.run(() -> {
                    try {
                        return next.handle(request);
                    } catch (Exception e) {
                        log.error("Error in circuit breaker execution for service: '{}':{}", serviceName, e.getMessage());
                        throw new RuntimeException("Service call failed", e);
                    }
                });
            } catch (CallNotPermittedException e) {
                log.error("Circuit breaker is open for service: '{}' - request blocked", serviceName);
                return ServerResponse.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":\"circuit_breaker_open\",\"message\":\"Circuit breaker is open for service " + serviceName + "\"}");
            } catch (Exception e) {
                log.error("Circuit breaker execution failed for service: '{}': {}", serviceName, e.getMessage(), e);
                return ServerResponse.status(HttpStatus.BAD_GATEWAY)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":\"circuit_breaker_error\",\"message\":\"Circuit breaker failed for service " + serviceName + "\"}");
            }
        };
    }
}