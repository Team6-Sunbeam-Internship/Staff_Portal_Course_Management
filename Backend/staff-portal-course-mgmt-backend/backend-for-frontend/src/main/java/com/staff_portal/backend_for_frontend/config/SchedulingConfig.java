package com.staff_portal.backend_for_frontend.config;

import com.staff_portal.backend_for_frontend.util.RedisKeyUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import java.util.Set;

@Configuration
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class SchedulingConfig {
    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisKeyUtil redisKeyUtil;
    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void cleanupExpiredAuthRequests() {
        try {
            Set<String> keys = redisTemplate.keys("bff:authreq:*");
            if (keys != null && !keys.isEmpty()) {
                long deleted = keys.stream()
                    .filter(key -> {
                        Long ttl = redisTemplate.getExpire(key);
                        return ttl != null && ttl <= 0;
                    })
                    .mapToLong(key -> redisTemplate.delete(key) ? 1 : 0)
                    .sum();
                if (deleted > 0) {
                    log.debug("Cleaned up {} expired authorization requests", deleted);
                }
            }
        } catch (Exception e) {
            log.error("Error during authorization request cleanup", e);
        }
    }
    @Scheduled(fixedRate = 600000) // Every 10 minutes
    public void logRedisHealth() {
        try {
            Set<String> totalKeys = redisTemplate.keys("bff:*");
            int keyCount = totalKeys != null ? totalKeys.size() : 0;
            log.info("Redis health check - Total BFF keys: {}", keyCount);
        } catch (Exception e) {
            log.error("Redis health check failed", e);
        }
    }
}