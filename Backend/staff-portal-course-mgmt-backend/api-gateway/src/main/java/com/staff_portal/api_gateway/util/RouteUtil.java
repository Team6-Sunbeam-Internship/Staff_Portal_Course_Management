package com.staff_portal.api_gateway.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Component
@Slf4j
public class RouteUtil {
    private static final String PROXY_PREFIX = "/apig";
    public static String extractServiceNameFromPath(String path) {
        if (!StringUtils.hasText(path) || !path.startsWith(PROXY_PREFIX)) {
            throw new IllegalArgumentException("Invalid path format: " + path);
        }
        String pathAfterProxy = path.substring(PROXY_PREFIX.length());
        if (pathAfterProxy.startsWith("/")) {
            pathAfterProxy = pathAfterProxy.substring(1);
        }
        int nextSlashIndex = pathAfterProxy.indexOf('/');
        if (nextSlashIndex > 0) {
            return pathAfterProxy.substring(0, nextSlashIndex);
        } else {
            return pathAfterProxy;
        }
    }
    public static String buildTargetUri(String baseUri, String originalPath) {
        if (!StringUtils.hasText(baseUri) || !StringUtils.hasText(originalPath)) {
            throw new IllegalArgumentException("BaseUri and originalPath cannot be null or empty");
        }
        String pathAfterProxy = originalPath.substring(PROXY_PREFIX.length());
        if (pathAfterProxy.startsWith("/")) {
            pathAfterProxy = pathAfterProxy.substring(1);
        }
        int nextSlashIndex = pathAfterProxy.indexOf('/');
        if (nextSlashIndex > 0) {
            pathAfterProxy = pathAfterProxy.substring(nextSlashIndex);
        } else {
            pathAfterProxy = "";
        }
        return baseUri + pathAfterProxy;
    }
    public static boolean isHealthCheckPath(String path) {
        return StringUtils.hasText(path) &&
                (path.contains("/actuator/health") || path.contains("/health"));
    }
    public static boolean isSwaggerPath(String path) {
        return StringUtils.hasText(path) &&
                (path.contains("/swagger-ui") || path.contains("/v3/api-docs"));
    }
    public static String sanitizePath(String path) {
        if (!StringUtils.hasText(path)) {
            return "/";
        }
        path = path.replaceAll("//+", "/");
        if (!path.startsWith("/")) {
            path = "/" + path;
        }
        return path;
    }
    public static Map<String, String> extractQueryParameters(String uri) {
        Map<String, String> queryParams = new HashMap<>();
        if (!StringUtils.hasText(uri)) {
            return queryParams;
        }
        int queryIndex = uri.indexOf('?');
        if (queryIndex > 0 && queryIndex < uri.length() - 1) {
            String queryString = uri.substring(queryIndex + 1);
            String[] pairs = queryString.split("&");
            for (String pair : pairs) {
                String[] keyValue = pair.split("=", 2);
                if (keyValue.length == 2) {
                    try {
                        String key = URLDecoder.decode(keyValue[0], StandardCharsets.UTF_8);
                        String value = URLDecoder.decode(keyValue[1], StandardCharsets.UTF_8);
                        queryParams.put(key, value);
                    } catch (Exception e) {
                        log.warn("Failed to decode query parameter: {}", pair);
                    }
                }
            }
        }
        return queryParams;
    }
}