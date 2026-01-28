package com.staff_portal.backend_for_frontend.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.jboss.logging.MDC;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.stereotype.Component;

import java.util.UUID;

@EnableAspectJAutoProxy
@Component
@Slf4j
public class LoggingAspect {
    @Around("execution(* com.enterprise.bff.controller.*.*(..))")
    public Object logControllerExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String requestId = generateRequestId();
        MDC.put("requestId", requestId);
        long startTime = System.currentTimeMillis();
        try {
            log.info("Starting [{}] {}.{}", requestId, className, methodName);
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            log.info("Completed [{}] {}.{} in {}ms", requestId, className, methodName, duration);
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("Failed [{}] {}.{} in {}ms: {}", requestId, className, methodName, duration, e.getMessage());
            throw e;
        } finally {
            MDC.remove("requestId");
        }
    }
    @Around("execution(* com.enterprise.bff.service.*.*(..))")
    public Object logServiceExecution(ProceedingJoinPoint joinPoint) throws Throwable {
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        try {
            log.debug("Executing service method: {}.{}", className, methodName);
            return joinPoint.proceed();
        } catch (Exception e) {
            log.error("Service method failed: {}.{} - {}", className, methodName, e.getMessage());
            throw e;
        }
    }
    private String generateRequestId() {
        return UUID.randomUUID().toString().substring(0, 8);
    }
}