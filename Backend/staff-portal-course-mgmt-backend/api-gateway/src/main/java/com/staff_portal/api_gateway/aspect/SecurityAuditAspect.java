package com.staff_portal.api_gateway.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;

@Aspect
@Component
@Slf4j
public class SecurityAuditAspect {
    @AfterThrowing(pointcut = "execution(* com.staff_portal.api_gateway.filter.*.*(..))", throwing = "ex")
    public void logSecurityViolation(JoinPoint joinPoint, Exception ex) {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "anonymous";
        log.warn("Security violation detected: {}.{} - User: {} - Error: {}",
                className, methodName, username, ex.getMessage());
    }
    @Before("execution(* com.staff_portal.api_gateway.filter.AudienceEnforcementGatewayFilterFactory.*(..))")
    public void logAudienceValidation(JoinPoint joinPoint) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth instanceof JwtAuthenticationToken jwtAuth) {
            Jwt jwt = jwtAuth.getToken();
            List<String> audiences = jwt.getAudience();
            String subject = jwt.getSubject();
            log.debug("Audience validation attempt - Subject: {} - Audiences: {}", subject, audiences);
        }
    }
}