package com.staff_portal.backend_for_frontend.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
@Slf4j
public class SecurityAspect {
    @Around("@annotation(org.springframework.security.access.prepost.PreAuthorize)")
    public Object logSecureAccess(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "anonymous";
        try {
            log.info("Secure access attempt: {}.{} by user: {}", className, methodName, username);
            Object result = joinPoint.proceed();
            log.info("Secure access granted: {}.{} for user: {}", className, methodName, username);
            return result;
        } catch (AccessDeniedException e) {
            log.warn("Secure access denied: {}.{} for user: {} - {}", className, methodName, username, e.getMessage());
            throw e;
        }
    }
    @Before("execution(* com.enterprise.bff.service.TokenService.revokeToken(..))")
    public void logTokenRevocation(JoinPoint joinPoint) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth != null ? auth.getName() : "unknown";
        log.info("Token revocation initiated for user: {}", username);
    }
}