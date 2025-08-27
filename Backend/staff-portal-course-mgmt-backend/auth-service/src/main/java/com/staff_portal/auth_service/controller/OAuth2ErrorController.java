package com.staff_portal.auth_service.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class OAuth2ErrorController {

    @GetMapping("/error")
    public String handleOAuth2Error(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "error_description", required = false) String errorDescription,
            @RequestParam(value = "error_uri", required = false) String errorUri,
            @RequestParam(value = "state", required = false) String state,
            Model model,
            HttpServletRequest request) {

        // Handle different OAuth2 error types
        String errorTitle = "OAuth2 Error";
        String errorMessage = "An OAuth2 error occurred.";

        if (StringUtils.hasText(error)) {
            switch (error) {
                case "invalid_request":
                    errorTitle = "Invalid Request";
                    errorMessage = "The request is missing a required parameter, includes an invalid parameter value, includes a parameter more than once, or is otherwise malformed.";
                    break;
                case "unauthorized_client":
                    errorTitle = "Unauthorized Client";
                    errorMessage = "The client is not authorized to request an authorization code using this method.";
                    break;
                case "access_denied":
                    errorTitle = "Access Denied";
                    errorMessage = "The resource owner or authorization server denied the request.";
                    break;
                case "unsupported_response_type":
                    errorTitle = "Unsupported Response Type";
                    errorMessage = "The authorization server does not support obtaining an authorization code using this method.";
                    break;
                case "invalid_scope":
                    errorTitle = "Invalid Scope";
                    errorMessage = "The requested scope is invalid, unknown, or malformed.";
                    break;
                case "server_error":
                    errorTitle = "Server Error";
                    errorMessage = "The authorization server encountered an unexpected condition that prevented it from fulfilling the request.";
                    break;
                case "temporarily_unavailable":
                    errorTitle = "Temporarily Unavailable";
                    errorMessage = "The authorization server is currently unable to handle the request due to a temporary overloading or maintenance of the server.";
                    break;
                case "invalid_client":
                    errorTitle = "Invalid Client";
                    errorMessage = "Client authentication failed.";
                    break;
                case "invalid_grant":
                    errorTitle = "Invalid Grant";
                    errorMessage = "The provided authorization grant is invalid, expired, revoked, does not match the redirection URI used in the authorization request, or was issued to another client.";
                    break;
                case "unsupported_grant_type":
                    errorTitle = "Unsupported Grant Type";
                    errorMessage = "The authorization grant type is not supported by the authorization server.";
                    break;
                default:
                    errorTitle = "OAuth2 Error: " + error;
                    errorMessage = StringUtils.hasText(errorDescription) ? errorDescription : "An unknown OAuth2 error occurred.";
                    break;
            }
        }

        // Override with custom error description if provided
        if (StringUtils.hasText(errorDescription)) {
            errorMessage = errorDescription;
        }

        model.addAttribute("errorTitle", errorTitle);
        model.addAttribute("errorMessage", errorMessage);
        model.addAttribute("errorCode", error);
        model.addAttribute("state", state);

        return "error";
    }
}