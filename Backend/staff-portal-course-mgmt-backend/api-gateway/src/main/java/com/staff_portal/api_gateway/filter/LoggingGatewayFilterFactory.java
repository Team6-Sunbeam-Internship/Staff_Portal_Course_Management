package com.staff_portal.api_gateway.filter;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.util.UUID;

@Component
@Slf4j
public class LoggingGatewayFilterFactory {
    @Data
    public static class Config {
        private boolean logHeaders = false;
        private boolean logBody = false;
    }
    public HandlerFilterFunction<ServerResponse, ServerResponse> apply(Config config) {
        return (request, next) -> {
            long startTime = System.currentTimeMillis();
            String method = request.method().name();
            String path = request.path();
            String remoteAddr = getClientIpAddress(request);
            String requestId = generateRequestId();
            try {
                log.info("[{}] Incoming request: {} {} from {}", requestId, method, path, remoteAddr);
                if (config.isLogHeaders()) {
                    HttpHeaders headers = request.headers().asHttpHeaders();
                    headers.forEach((name, values) -> {
                        if (!name.equalsIgnoreCase("authorization")) {
                            log.debug("[{}] Request Header: {} = {}", requestId, name, values);
                        }
                    });
                }
                ServerResponse response = next.handle(request);
                long duration = System.currentTimeMillis() - startTime;
                log.info("[{}] Request completed: {} {} - Status: {} - Duration: {}ms",
                        requestId, method, path, response.statusCode().value(), duration);
                return response;
            } catch (Exception e) {
                long duration = System.currentTimeMillis() - startTime;
                log.error("[{}] Filter execution error: {} {} - Duration: {}ms - Error: {}",
                        requestId, method, path, duration, e.getMessage(), e);
                return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"error\":\"logging_filter_error\",\"message\":\"Request logging failed\",\"requestId\":\"" + requestId + "\"}");
            }
        };
    }
    private String getClientIpAddress(ServerRequest request) {
        String xForwardedFor = request.headers().firstHeader("X-Forwarded-For");
        if (StringUtils.hasText(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.headers().firstHeader("X-Real-IP");
        if (StringUtils.hasText(xRealIp)) {
            return xRealIp;
        }
        return "unknown";
    }
    private String generateRequestId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}