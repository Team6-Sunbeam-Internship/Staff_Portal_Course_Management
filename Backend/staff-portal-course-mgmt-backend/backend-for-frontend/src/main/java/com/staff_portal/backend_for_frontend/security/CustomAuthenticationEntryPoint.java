package com.staff_portal.backend_for_frontend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.staff_portal.backend_for_frontend.service.PreserveCommandStoreService;
import com.staff_portal.backend_for_frontend.util.CookieUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
@Slf4j
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final PreserveCommandStoreService preserveCommandStoreService;
    private final ObjectMapper objectMapper;
    private final CookieUtil cookieUtil;

    public CustomAuthenticationEntryPoint(
            PreserveCommandStoreService preserveCommandStoreService,
            ObjectMapper objectMapper,
            CookieUtil cookieUtil
    ) {
        this.preserveCommandStoreService = preserveCommandStoreService;
        this.objectMapper = objectMapper;
        this.cookieUtil = cookieUtil;
    }

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        String spaRoute = request.getHeader("X-SPA-Route");
        if (spaRoute != null && spaRoute.startsWith("/")) {
            ResponseCookie lastRouteCookie =
                    cookieUtil.createLastRouteCookie(spaRoute, 300);
            response.addHeader("Set-Cookie", lastRouteCookie.toString());
            log.debug("Saved last SPA route: {}", spaRoute);
        }
        if (request.getRequestURI().startsWith("/bff/apig")
                || request.getRequestURI().startsWith("/bff/auth")) {

            HttpSession session = request.getSession(true);

            if (request instanceof ContentCachingRequestWrapper wrapper) {
                byte[] bytes = wrapper.getContentAsByteArray();
                if (bytes.length > 0) {
                    JsonNode payload = objectMapper.readTree(bytes);
                    String commandType = Optional.ofNullable(request.getHeader("X-COMMAND-TYPE")).orElse("UNKNOWN");
                    preserveCommandStoreService.enqueue(
                            session.getId(),
                            commandType,
                            spaRoute,
                            payload
                    );

                    log.debug("Preserved interrupted API command for session {}",
                            session.getId());
                }
            }

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            Map<String, Object> body = Map.of(
                    "authenticated", false,
                    "error", "SESSION_EXPIRED",
                    "message", "Session has expired. Please login again."
            );

            response.getWriter().write(objectMapper.writeValueAsString(body));
            response.getWriter().flush();
            return;
        }
        response.sendRedirect("/login");
    }
}
