package com.staff_portal.api_gateway.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class AudienceValidationService {
    private final RouteConfigService routeConfigService;
    public AudienceValidationService(RouteConfigService routeConfigService) {
        this.routeConfigService = routeConfigService;
    }
   public boolean validateAudience(Jwt jwt, String requestPath){
        return validateAudienceWithDetails(jwt, requestPath).isValid();
   }
   public ValidationResult validateAudienceWithDetails(Jwt jwt, String requestPath){
        log.info("REQUEST PATH: {}", requestPath);

        // Validate Jwt Token
       if(jwt == null){
           return ValidationResult.failure("JWT token is null");
       }

       // Get token audiences
       List<String> tokenAudiences = jwt.getAudience();
       log.info("Token Audiences: {}", tokenAudiences);
       if(tokenAudiences == null || tokenAudiences.isEmpty()){
           return ValidationResult.failure("JWT token has no audience claims", null, tokenAudiences);
       }

       return getRequiredAudienceForPath(requestPath)
               .map(requiredAudience -> validateAudienceMatch(tokenAudiences, requiredAudience))
               .orElseGet(()-> ValidationResult.failure("No route configuration found for path: " + requestPath, null, tokenAudiences));
   }

   private Optional<String> getRequiredAudienceForPath(String requestPath){
        try{
            return routeConfigService.getRouteConfigByPath(requestPath)
                    .map(RouteConfigService.RouteConfig::getRequiredAudience);
        } catch (Exception e){
            log.error("Error getting required audience for path {}: {}", requestPath, e.getMessage());
            return Optional.empty();
        }
   }

   private ValidationResult validateAudienceMatch(List<String> tokenAudiences, String requiredAudience){
        if(tokenAudiences.contains(requiredAudience)){
            log.debug("Audience validation successful. Required: {}, Found: {}", requiredAudience, tokenAudiences);
            return ValidationResult.success(requiredAudience, tokenAudiences);
        } else {
            log.error("JWT token does not contain required audience. Required: {}, Found: {}", requiredAudience, tokenAudiences);
            return ValidationResult.failure(
                    "Token audience does not include required service: " + requiredAudience, requiredAudience, tokenAudiences
            );
        }
   }

   @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ValidationResult {
        private boolean valid;
        private String message;
        private String requiredAudience;
        private List<String> foundAudiences;

        public static ValidationResult success(String requiredAudience, List<String> foundAudiences){
            return new ValidationResult(true, "Audience validation successful", requiredAudience, foundAudiences);
        }

        public static ValidationResult failure(String message){
            return new ValidationResult(false, message, null, null);
        }
        public static ValidationResult failure(String message, String requiredAudience, List<String> foundAudiences){
            return new ValidationResult(false, message, requiredAudience, foundAudiences);
        }

        public String toJsonError(){
            return String.format(
                    "{\"error\":\"invalid_audience\", \"message\":\"%s\", \"required\":\"%s\", \"found\":%s}",
                    message, requiredAudience !=null ? requiredAudience : "unknown", foundAudiences !=null ? foundAudiences.toString() : "[]"
            );
        }
   }
}