package com.staff_portal.api_gateway.config;

import com.staff_portal.api_gateway.aspect.RequestLoggingAspect;
import com.staff_portal.api_gateway.aspect.SecurityAuditAspect;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class AopConfig {
    @Bean
    public RequestLoggingAspect requestLoggingAspect() {
        return new RequestLoggingAspect();
    }
    @Bean
    public SecurityAuditAspect securityAuditAspect() {
        return new SecurityAuditAspect();
    }
}