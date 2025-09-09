package com.staff_portal.auth_service.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
@Controller
public class OAuth2ErrorController {

    @GetMapping("/oauth2-error")
    public String handleOAuth2Error(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "error_description", required = false) String errorDescription,
            @RequestParam(value = "error_uri", required = false) String errorUri,
            @RequestParam(value = "state", required = false) String state,
            Model model,
            HttpServletRequest request) {

        // Fallback to session attributes (for server-side redirects)
        if (!StringUtils.hasText(error)) {
            error = (String) request.getSession().getAttribute("oauth2_error_code");
            errorDescription = (String) request.getSession().getAttribute("oauth2_error_description");
            errorUri = (String) request.getSession().getAttribute("oauth2_error_uri");
            // Clear attributes to avoid reusing them accidentally
            request.getSession().removeAttribute("oauth2_error_code");
            request.getSession().removeAttribute("oauth2_error_description");
        }

        String errorTitle = "OAuth2 Error";
        String errorMessage = "An OAuth2 error occurred.";

        if (StringUtils.hasText(error)) {
            errorMessage = switch (error) {
                case "invalid_request" -> {
                    errorTitle = "Invalid Request";
                    yield "The request is missing a required parameter or is malformed.";
                }
                case "unauthorized_client" -> {
                    errorTitle = "Unauthorized Client";
                    yield "The client is not authorized to request an authorization code using this method.";
                }
                case "access_denied" -> {
                    errorTitle = "Access Denied";
                    yield "The resource owner or authorization server denied the request.";
                }
                case "unsupported_response_type" -> {
                    errorTitle = "Unsupported Response Type";
                    yield "The authorization server does not support this response type.";
                }
                case "invalid_scope" -> {
                    errorTitle = "Invalid Scope";
                    yield "The requested scope is invalid, unknown, or malformed.";
                }
                case "server_error" -> {
                    errorTitle = "Server Error";
                    yield "The authorization server encountered an unexpected condition.";
                }
                case "temporarily_unavailable" -> {
                    errorTitle = "Temporarily Unavailable";
                    yield "The server is temporarily unable to handle the request.";
                }
                case "invalid_client" -> {
                    errorTitle = "Invalid Client";
                    yield "Client authentication failed.";
                }
                case "invalid_grant" -> {
                    errorTitle = "Invalid Grant";
                    yield "The provided authorization grant is invalid or expired.";
                }
                case "unsupported_grant_type" -> {
                    errorTitle = "Unsupported Grant Type";
                    yield "The authorization grant type is not supported.";
                }
                default -> {
                    errorTitle = "OAuth2 Error: " + error;
                    yield StringUtils.hasText(errorDescription) ? errorDescription : "An unknown OAuth2 error occurred.";
                }
            };
        }

        if (StringUtils.hasText(errorDescription)) {
            errorMessage = errorDescription;
        }

        model.addAttribute("errorTitle", errorTitle);
        model.addAttribute("errorMessage", errorMessage);
        model.addAttribute("errorCode", error);
        model.addAttribute("state", state);
        model.addAttribute("errorUri", errorUri);

        return "error"; // Thymeleaf template name
    }
}
