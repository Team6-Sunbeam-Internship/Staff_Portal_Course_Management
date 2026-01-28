package com.staff_portal.academic_service.config;//package com.staff_portal.user_service.config;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.staff_portal.user_service.dto.response.ApiResponse;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.web.AuthenticationEntryPoint;
//import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
//import org.springframework.security.oauth2.core.OAuth2Error;
//
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.stereotype.Component;
//
//import java.io.IOException;
//
//@Component
//public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {
//
//    private final ObjectMapper objectMapper = new ObjectMapper();
//
//    @Override
//    public void commence(HttpServletRequest request,
//                         HttpServletResponse response,
//                         AuthenticationException authException) throws IOException {
//
//        String errorCode = "";
//        String errorDescription = "";
//
//        // Handle OAuth2-specific errors
//        if (authException instanceof OAuth2AuthenticationException oauthEx) {
//            OAuth2Error error = oauthEx.getError();
//            if (error != null && error.getDescription() != null) {
//                errorCode = error.getErrorCode();
//                errorDescription = OAuth2Error.class.getName() + ": " + error.getDescription();
//            }
//        }
//
//        ApiResponse<String> apiResponse = ApiResponse.onError(errorCode, errorDescription);
//
//        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//        response.setContentType("application/json");
//        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
//    }
//}
