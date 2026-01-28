package com.staff_portal.api_gateway.config;

import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.github.resilience4j.timelimiter.TimeLimiterConfig;
import io.github.resilience4j.timelimiter.TimeLimiterRegistry;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JCircuitBreakerFactory;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4JConfigBuilder;
import org.springframework.cloud.circuitbreaker.resilience4j.Resilience4jBulkheadProvider;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.cloud.client.circuitbreaker.Customizer;
import org.springframework.context.annotation.Bean;

import java.time.Duration;

public class CircuitBreakerConfiguration {

    @Bean
    public CircuitBreakerRegistry circuitBreakerRegistry() {
        return CircuitBreakerRegistry.ofDefaults();
    }

    @Bean
    public TimeLimiterRegistry timeLimiterRegistry() {
        return TimeLimiterRegistry.ofDefaults();
    }

    @Bean
    public CircuitBreakerFactory<?, ?> circuitBreakerFactory(
            CircuitBreakerRegistry circuitBreakerRegistry,
            TimeLimiterRegistry timeLimiterRegistry,
            Resilience4jBulkheadProvider bulkheadProvider) {
        return new Resilience4JCircuitBreakerFactory(
                circuitBreakerRegistry,
                timeLimiterRegistry,
                bulkheadProvider);
    }

    @Bean
    public Customizer<Resilience4JCircuitBreakerFactory> defaultCustomizer() {
        return factory -> factory.configureDefault(id -> new Resilience4JConfigBuilder(id)
                .circuitBreakerConfig(CircuitBreakerConfig.custom()
                        .slidingWindowSize(10)
                        .permittedNumberOfCallsInHalfOpenState(3)
                        .slidingWindowType(CircuitBreakerConfig.SlidingWindowType.COUNT_BASED)
                        .minimumNumberOfCalls(5)
                        .failureRateThreshold(50.0f)
                        .waitDurationInOpenState(Duration.ofSeconds(30))
                        .automaticTransitionFromOpenToHalfOpenEnabled(true)
                        .recordExceptions(Exception.class)
                        .build())
                .timeLimiterConfig(TimeLimiterConfig.custom()
                        .timeoutDuration(Duration.ofSeconds(10))
                        .cancelRunningFuture(true)
                        .build())
                .build());
    }
}
