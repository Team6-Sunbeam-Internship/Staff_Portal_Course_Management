package com.staff_portal.api_gateway.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.servlet.function.HandlerFilterFunction;
import org.springframework.web.servlet.function.ServerResponse;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.net.ConnectException;
import java.net.SocketTimeoutException;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class ErrorHandlerFilterFactory {

    private final ObjectMapper OBJECT_MAPPER;

    public ErrorHandlerFilterFactory(ObjectMapper objectMapper) {
        this.OBJECT_MAPPER = objectMapper;
    }
    @Data
    public static class Config {
        private boolean includeStackTrace = false;
        private String serviceName;
    }

    public HandlerFilterFunction<ServerResponse, ServerResponse> apply(Config config) {
        return (request, next) -> {
            try {
                return next.handle(request);
            } catch (ConnectException e) {
                log.error("Connection refused to service {}: {}", config.getServiceName(), e.getMessage());
                return ServerResponse.status(HttpStatus.BAD_GATEWAY)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("connection_refused",
                                "Service " + config.getServiceName() + " is not reachable", e, config.isIncludeStackTrace()));
            } catch (SocketTimeoutException e) {
                log.error("Timeout connecting to service {}: {}", config.getServiceName(), e.getMessage());
                return ServerResponse.status(HttpStatus.GATEWAY_TIMEOUT)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("timeout",
                                "Service " + config.getServiceName() + " response timeout", e, config.isIncludeStackTrace()));
            } catch (HttpClientErrorException e) {
                log.error("Client error from service {}: {} - {}", config.getServiceName(), e.getStatusCode(), e.getMessage());
                return ServerResponse.status(e.getStatusCode())
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("client_error",
                                "Client error from service " + config.getServiceName(), e, config.isIncludeStackTrace()));
            } catch (HttpServerErrorException e) {
                log.error("Server error from service {}: {} - {}", config.getServiceName(), e.getStatusCode(), e.getMessage());
                return ServerResponse.status(HttpStatus.BAD_GATEWAY)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("server_error",
                                "Server error from service " + config.getServiceName(), e, config.isIncludeStackTrace()));
            } catch (ResourceAccessException e) {
                log.error("Resource access error for service {}: {}", config.getServiceName(), e.getMessage());
                return ServerResponse.status(HttpStatus.SERVICE_UNAVAILABLE)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("service_unavailable",
                                "Service " + config.getServiceName() + " is temporarily unavailable", e, config.isIncludeStackTrace()));
            } catch (Exception e) {
                log.error("Unexpected error while calling service {}: {}", config.getServiceName(), e.getMessage(), e);
                return ServerResponse.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(createErrorResponse("internal_error",
                                "Unexpected error occurred while processing request", e, config.isIncludeStackTrace()));
            }
        };
    }

    private String createErrorResponse(String errorCode, String message, Exception e, boolean includeStackTrace) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", errorCode);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", Instant.now().toString());
        if (includeStackTrace && e != null) {
            errorResponse.put("stackTrace", getStackTraceAsString(e));
        }
        try {
            return OBJECT_MAPPER.writeValueAsString(errorResponse);
        } catch (Exception jsonException) {
            log.error("Failed to serialize error response", jsonException);
            return "{\"error\":\"json_serialization_failed\",\"message\":\"Failed to serialize error response\"}";
        }
    }

    private String getStackTraceAsString(Exception e){
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }
}