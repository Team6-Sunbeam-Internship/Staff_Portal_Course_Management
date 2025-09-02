package com.staff_portal.api_gateway.config;

import com.staff_portal.api_gateway.exception.ErrorHandlerFilterFactory;
import com.staff_portal.api_gateway.filter.AudienceEnforcementGatewayFilterFactory;
import com.staff_portal.api_gateway.filter.LoggingGatewayFilterFactory;
import com.staff_portal.api_gateway.service.RouteConfigService;
import com.staff_portal.api_gateway.util.RouteUtil;
import io.github.resilience4j.circuitbreaker.CallNotPermittedException;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import io.github.resilience4j.timelimiter.TimeLimiterRegistry;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4jBulkheadProvider;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.cloud.gateway.server.mvc.filter.FilterFunctions;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;
import org.springframework.web.servlet.function.*;

import java.time.Duration;

@Configuration
@Slf4j
public class GatewayConfig {
    @Value("${gateway.services.user-service.retry.max-attempts}")
    private int userServiceMaxAttempts;
    @Value("${gateway.services.scheduling-service.retry.max-attempts:http://scheduling-service}")
    private int schedulingServiceMaxAttempts;
    @Value("${gateway.services.academic-service.retry.max-attempts}")
    private int academicServiceMaxAttempts;
    @Autowired
    private RestClient restClient;
    @Autowired
    private RouteConfigService routeConfigService;

    @Bean
    public RouterFunction<ServerResponse> gatewayRoutes(
            AudienceEnforcementGatewayFilterFactory audienceFilterFactory,
            LoggingGatewayFilterFactory loggingFilterFactory,
            ErrorHandlerFilterFactory errorHandlerFilterFactory,
            CircuitBreakerFactory circuitBreakerFactory) {
        return RouterFunctions.route()
                .POST("/apig/user/**", createServiceHandler())
                .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                .filter(audienceFilterFactory.apply(createAudienceConfig("user-service")))
                .filter(errorHandlerFilterFactory.apply(createErrorConfig("user-service")))
                .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                .filter(FilterFunctions.stripPrefix(1))
                .filter(createCircuitBreakerFilter(circuitBreakerFactory, "user-service"))
                .filter(createRetryFilter(userServiceMaxAttempts))
                .build()
                .and(RouterFunctions.route()
                        .GET("/apig/user/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("user-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("user-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "user-service"))
                        .filter(createRetryFilter(userServiceMaxAttempts))
                        .build())
                .and(RouterFunctions.route()
                        .PUT("/apig/user/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("user-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("user-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "user-service"))
                        .filter(createRetryFilter(userServiceMaxAttempts))
                        .build())
                .and(RouterFunctions.route()
                        .DELETE("/apig/user/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("user-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("user-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "user-service"))
                        .filter(createRetryFilter(userServiceMaxAttempts))
                        .build())
                .and(RouterFunctions.route()
                        .POST("/apig/scheduling/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("scheduling-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("scheduling-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "scheduling-service"))
                        .filter(createRetryFilter(schedulingServiceMaxAttempts))
                        .build())
                .and(RouterFunctions.route()
                        .GET("/apig/scheduling/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("scheduling-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("scheduling-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "scheduling-service"))
                        .filter(createRetryFilter(schedulingServiceMaxAttempts))
                        .build())
                .and(RouterFunctions.route()
                        .PUT("/apig/scheduling/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("scheduling-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("scheduling-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "scheduling-service"))
                        .filter(createRetryFilter(schedulingServiceMaxAttempts))
                        .build())
                .and(RouterFunctions.route()
                        .DELETE("/apig/scheduling/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("scheduling-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("scheduling-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "scheduling-service"))
                        .filter(createRetryFilter(schedulingServiceMaxAttempts))
                        .build())
                .and(RouterFunctions.route()
                        .POST("/apig/academic/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("academic-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("academic-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "academic-service"))
                        .filter(createRetryFilter(academicServiceMaxAttempts))
                        .build())
                .and(RouterFunctions.route()
                        .GET("/apig/academic/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("academic-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("academic-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "academic-service"))
                        .filter(createRetryFilter(academicServiceMaxAttempts))
                        .build())
                .and(RouterFunctions.route()
                        .PUT("/apig/academic/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("academic-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("academic-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "academic-service"))
                        .filter(createRetryFilter(academicServiceMaxAttempts))
                        .build())
                .and(RouterFunctions.route()
                        .DELETE("/apig/academic/**", createServiceHandler())
                        .filter(loggingFilterFactory.apply(new LoggingGatewayFilterFactory.Config()))
                        .filter(audienceFilterFactory.apply(createAudienceConfig("academic-service")))
                        .filter(errorHandlerFilterFactory.apply(createErrorConfig("academic-service")))
                        .filter(FilterFunctions.addRequestHeader("X-Forwarded-For", "gateway"))
                        .filter(FilterFunctions.stripPrefix(1))
                        .filter(createCircuitBreakerFilter(circuitBreakerFactory, "academic-service"))
                        .filter(createRetryFilter(academicServiceMaxAttempts))
                        .build());
    }

    private HandlerFunction<ServerResponse> createServiceHandler() {
        return this::forwardRequest;
    }

    private ServerResponse forwardRequest(ServerRequest request) {
        String targetUri = routeConfigService.getServiceUriByPath(request.path()) +
                request.path().substring("/apig".length());
        String sanitizedPath = RouteUtil.sanitizePath(request.path());
        String serviceName = RouteUtil.extractServiceNameFromPath(sanitizedPath);
        String finalTargetUri = RouteUtil.buildTargetUri(targetUri, sanitizedPath);

        try {
            String requestBody = null;
            if (request.method().name().equals("POST") || request.method().name().equals("PUT")) {
                requestBody = request.body(String.class);
            }
            assert requestBody != null;
            ResponseEntity<String> response = restClient.method(request.method())
                    .uri(finalTargetUri)
                    .headers(headers -> {
                        HttpHeaders requestHeaders = request.headers().asHttpHeaders();
                        requestHeaders.forEach((name, values) -> {
                            if (!name.equalsIgnoreCase("host") && !name.equalsIgnoreCase("content-length")) {
                                headers.addAll(name, values);
                            }
                        });
                    })
                    .body(requestBody)
                    .retrieve()
                    .toEntity(String.class);
            assert response.getBody() != null;
            return ServerResponse.status(response.getStatusCode())
                    .headers(responseHeaders -> {
                        response.getHeaders().forEach((name, values) -> {
                            if (!name.equalsIgnoreCase("transfer-encoding")) {
                                responseHeaders.addAll(name, values);
                            }
                        });
                    })
                    .body(response.getBody());
        } catch (Exception e) {
            log.error("Failed to forward request to service {} at {}: {}", serviceName, finalTargetUri, e.getMessage());
            return ServerResponse.status(HttpStatus.BAD_GATEWAY)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("{\"error\":\"gateway_error\",\"message\":\"Failed to forward request to service " + serviceName + "\"}");
        }
    }

    private AudienceEnforcementGatewayFilterFactory.Config createAudienceConfig(String requiredAudience) {
        AudienceEnforcementGatewayFilterFactory.Config config = new AudienceEnforcementGatewayFilterFactory.Config();
        config.setRequiredAudience(requiredAudience);
        return config;
    }

    private ErrorHandlerFilterFactory.Config createErrorConfig(String serviceName) {
        ErrorHandlerFilterFactory.Config config = new ErrorHandlerFilterFactory.Config();
        config.setServiceName(serviceName);
        config.setIncludeStackTrace(false);
        return config;
    }

    private HandlerFilterFunction<ServerResponse, ServerResponse> createRetryFilter(int maxAttempts) {
        return (request, next) -> {
            int attempt = 0;
            Exception lastException = null;
            while (attempt < maxAttempts) {
                try {
                    return next.handle(request);
                } catch (Exception e) {
                    lastException = e;
                    attempt++;
                    if (attempt >= maxAttempts) {
                        break;
                    }
                    log.warn("Retry attempt {} failed, retrying...", attempt);
                    try {
                        Thread.sleep(1000L * attempt);
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

    private HandlerFilterFunction<ServerResponse, ServerResponse> createCircuitBreakerFilter(
            CircuitBreakerFactory circuitBreakerFactory, String serviceName) {
        return (request, next) -> {
            CircuitBreaker circuitBreaker = circuitBreakerFactory.create(serviceName);
            try {
                return circuitBreaker.run(() -> {
                    try {
                        return next.handle(request);
                    } catch (Exception e) {
                        log.error("Error in circuit breaker execution for service: {}", serviceName, e);
                        throw new RuntimeException("Service call failed", e);
                    }
                });
            } catch (CallNotPermittedException e) {
                log.error("Circuit breaker is open for service: {}", serviceName);
                return ServerResponse.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":\"circuit_breaker_open\",\"message\":\"Circuit breaker is open for service " + serviceName + "\"}");
            } catch (Exception e) {
                log.error("Circuit breaker execution failed for service: {}", serviceName, e);
                return ServerResponse.status(HttpStatus.BAD_GATEWAY)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":\"circuit_breaker_error\",\"message\":\"Circuit breaker failed for service " + serviceName + "\"}");
            }
        };
    }

    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        return CircuitBreakerRegistry.ofDefaults();
    }

    @Bean
    public TimeLimiterRegistry timeLimiterRegistry() {
        return TimeLimiterRegistry.ofDefaults();
    }

    @Bean
    public CircuitBreakerFactory circuitBreakerFactory(
            CircuitBreakerRegistry circuitBreakerRegistry,
            TimeLimiterRegistry timeLimiterRegistry,
            Resilience4jBulkheadProvider bulkheadProvider) {
        return new Resilience4JCircuitBreakerFactory(circuitBreakerRegistry, timeLimiterRegistry, bulkheadProvider);
    }

    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> defaultCustomizer() {
        return factory -> {
            factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
                    .circuitBreakerConfig(CircuitBreakerConfig.custom()
                            .slidingWindowSize(10)
                            .permittedNumberOfCallsInHalfOpenState(3)
                            .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                            .minimumNumberOfCalls(5)
                            .failureRateThreshold(50.0f)
                            .waitDurationInOpenState(Duration.ofSeconds(30))
                            .automaticTransitionFromOpenToHalfOpenEnabled(true)
                            .build())
                    .timeLimiterConfig(TimeLimiterConfig.custom()
                            .timeoutDuration(Duration.ofSeconds(10))
                            .build())
                    .build());
        };
    }
}