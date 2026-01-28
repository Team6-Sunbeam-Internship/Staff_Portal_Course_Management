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

            // Store request ID in attributes for downstream filters
            request.attributes().put("requestId", requestId);

            try {
                log.info("[{}] -> {} {} from {}", requestId, method, path, remoteAddr);
                if (config.isLogHeaders()) {
                    logRequestHeaders(request, requestId);
                }
                ServerResponse response = next.handle(request);
                long duration = System.currentTimeMillis() - startTime;
                log.info("[{}] ← {} {} - Status: {} - Duration: {}ms",
                        requestId, method, path, response.statusCode().value(), duration);
                return response;
            } catch (Exception e) {
                long duration = System.currentTimeMillis() - startTime;
                log.error("[{}] x {} {} - Duration: {}ms - Error: {}",
                        requestId, method, path, duration, e.getMessage(), e);
                return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse(requestId));
            }
        };
    }

    private void logRequestHeaders(ServerRequest request, String requestId) {
        HttpHeaders headers = request.headers().asHttpHeaders();
        headers.forEach((name, values) -> {
            // Don't log sensitive headers
            if (!isSensitiveHeader(name)) {
                log.debug("[{}] Header: {} = {}", requestId, name, values);
            }
        });
    }

    private boolean isSensitiveHeader(String headerName) {
        String lowerName = headerName.toLowerCase();
        return lowerName.equals("authorization")
                || lowerName.equals("cookie")
                || lowerName.equals("x-api-key")
                || lowerName.equals("secret")
                || lowerName.equals("token");
    }

    private String getClientIpAddress(ServerRequest request) {
        String xForwardedFor = request.headers().firstHeader("X-Forwarded-For");
        if (StringUtils.hasText(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }

        // Check X-Real-IP header
        String xRealIp = request.headers().firstHeader("X-Real-IP");
        if (StringUtils.hasText(xRealIp)) {
            return xRealIp;
        }

        String cfConnectingIp = request.headers().firstHeader("CF-Connecting-IP");
        if (StringUtils.hasText(cfConnectingIp)) {
            return cfConnectingIp;
        }
        return "unknown";
    }

    private String generateRequestId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }

    private String createErrorResponse(String requestId) {
        return String.format(
                "{\"error\":\"logging_filter_error\",\"message\":\"Request logging failed\",\"requestId\":\"%s\"}",
                requestId
        );
    }
}