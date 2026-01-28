package com.staff_portal.backend_for_frontend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.staff_portal.backend_for_frontend.dto.PreserveCommandDTO;
import com.staff_portal.backend_for_frontend.util.CookieUtil;
import com.staff_portal.backend_for_frontend.util.RedisKeyUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class PreserveCommandStoreService {
    private static final Duration TTL = Duration.ofMinutes(10);
    private final RedisTemplate<String, String> redis;
    private final ObjectMapper objectMapper;
    private final RedisKeyUtil redisKeyUtil;

    public PreserveCommandStoreService(RedisTemplate<String, String> redis, @Qualifier("defaultObjectMapper") ObjectMapper objectMapper, RedisKeyUtil redisKeyUtil, CookieUtil cookieUtil) {
        this.redis = redis;
        this.objectMapper = objectMapper;
        this.redisKeyUtil = redisKeyUtil;
    }

    public void enqueue(String sessionId, String commandName, String originPage, JsonNode payload) {
        PreserveCommandDTO command = PreserveCommandDTO.builder()
                .commandId(UUID.randomUUID().toString())
                .commandName(commandName)
                .originPage(originPage)
                .payload(payload)
                .idempotencyKey(UUID.randomUUID().toString())
                .createdAt(Instant.now())
                .expiresAt(Instant.now().plus(TTL))
                .build();

        try {
            redis.opsForList().rightPush(redisKeyUtil.buildPRESERVED_COMMANDSKey(sessionId), objectMapper.writeValueAsString(command));
            redis.expire(redisKeyUtil.buildPRESERVED_COMMANDSKey(sessionId), TTL);
        } catch (Exception e) {
            throw new IllegalStateException("Failed to enqueue preserved command", e);
        }
    }

    public List<PreserveCommandDTO> drain(String sessionId){
        List<String> raw = redis.opsForList().range(redisKeyUtil.buildPRESERVED_COMMANDSKey(sessionId), 0, -1);
        redis.delete(redisKeyUtil.buildPRESERVED_COMMANDSKey(sessionId));
        if(raw == null || raw.isEmpty()){
            return List.of();
        }

        return raw.stream()
                .map(this::deserialize)
                .filter(this::notExpired)
                .toList();
    }

    private PreserveCommandDTO deserialize(String json){
        try{
            return objectMapper.readValue(json, PreserveCommandDTO.class);
        } catch (Exception e){
            log.warn("Failed to deserialize preserved command", e);
            return null;
        }
    }

    private boolean notExpired(PreserveCommandDTO preserveCommandDTO){
        return preserveCommandDTO !=null && preserveCommandDTO.getExpiresAt().isAfter(Instant.now());
    }
}
