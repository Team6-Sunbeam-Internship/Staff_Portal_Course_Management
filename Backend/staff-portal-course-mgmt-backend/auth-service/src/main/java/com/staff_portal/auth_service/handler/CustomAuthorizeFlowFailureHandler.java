package com.staff_portal.auth_service.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AuthorizationCodeRequestAuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@Slf4j
public class CustomAuthorizeFlowFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        if (exception instanceof OAuth2AuthenticationException ex) {
            OAuth2Error error = ex.getError();
            String errorCode = error.getErrorCode();
            String description = error.getDescription();
            String errorUri = error.getUri();

            log.error("OAuth2 failure: {} - {}", errorCode, description);

            boolean handled = false;

            // Handle internal errors (don’t redirect to client)
            if ("invalid_request".equals(errorCode) ||
                    "unauthorized_client".equals(errorCode) ||
                    "unsupported_response_type".equals(errorCode)) {

                request.getSession().setAttribute("oauth2_error_code", errorCode);
                request.getSession().setAttribute("oauth2_error_description", description);
                request.getSession().setAttribute("oauth2_error_uri", errorUri);
                response.sendRedirect("/oauth2-error");
                handled = true;
            }
            else if (ex.getAuthenticationRequest() instanceof OAuth2AuthorizationCodeRequestAuthenticationToken authRequest) {
                String redirectUri = authRequest.getRedirectUri();
                String state = authRequest.getState();

                if (redirectUri != null) {
                    UriComponentsBuilder uri = UriComponentsBuilder.fromUriString(redirectUri)
                            .queryParam("error", errorCode);

                    if (description != null) {
                        uri.queryParam("error_description",
                                URLEncoder.encode(description, StandardCharsets.UTF_8));
                    }
                    if (state != null) {
                        uri.queryParam("state", state);
                    }

                    response.sendRedirect(uri.build().toUriString());
                    handled = true;
                }
            }

            if (!handled) {
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "OAuth2 error: " + errorCode);
            }
        }
    }
}
