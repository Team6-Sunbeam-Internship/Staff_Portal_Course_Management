package com.staff_portal.academic_service.config;//package com.staff_portal.user_service.config;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.security.oauth2.core.OAuth2Error;
//import org.springframework.security.oauth2.core.OAuth2TokenValidator;
//import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//
//@Slf4j
//@Component
//public class AudienceValidatorConfig implements OAuth2TokenValidator<Jwt> {
//
//    @Value("${spring.security.oauth2.resourceserver.jwt.audiences}")
//    private String jwtAudiences;
//
//    private static final OAuth2Error INVALID_AUDIENCE = new OAuth2Error(
//            "invalid_audience",
//            "The required audience is missing",
//            "https://tools.ietf.org/html/rfc6750#section-3.1"
//    );
//    @Override
//    public OAuth2TokenValidatorResult validate(Jwt jwt) {
//        List<String> audiences = jwt.getAudience();
//        if (audiences == null || audiences.isEmpty()) {
//            log.warn("JWT token has no audience claim");
//            return OAuth2TokenValidatorResult.failure(INVALID_AUDIENCE);
//        }
//        boolean hasRequiredAudience = audiences.contains(jwtAudiences);
//
//        log.debug("JWT audiences: {}", audiences);
//        return OAuth2TokenValidatorResult.success();
//    }
//
//    @Data
//    @AllArgsConstructor
//    @NoArgsConstructor
//    public static class ValidationResult {
//        private boolean valid;
//        private String message;
//        private String requiredAudience;
//        private List<String> foundAudiences;
//    }
//}