package com.staff_portal.backend_for_frontend.controller;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@Slf4j
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {
    @RequestMapping("/error")
    public String handleError(HttpServletRequest request, Model model) {
        Integer statusCode = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Exception exception = (Exception) request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
        String errorMessage = (String) request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        model.addAttribute("statusCode", statusCode != null ? statusCode : 500);
        model.addAttribute("errorMessage", errorMessage != null ? errorMessage : "An unexpected error occurred");
        if (exception != null) {
            log.error("Error occurred", exception);
        }
        return "error";
    }
}