package com.staff_portal.backend_for_frontend.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.security.jackson2.SecurityJackson2Modules;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Configures Redis for session management and OAuth2 client data storage.
 * Uses LettuceConnectionFactory with Redis-backed HttpSession.
 */

@Configuration
// @EnableRedisHttpSession(maxInactiveIntervalInSeconds = 1800)
@RequiredArgsConstructor
@Slf4j
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String redisHost;

    @Value("${spring.data.redis.port}")
    private int redisPort;

    @Bean
    public LettuceConnectionFactory connectionFactory() {
        LettuceConnectionFactory factory = new LettuceConnectionFactory(redisHost, redisPort);
        factory.setValidateConnection(true);
        log.info("Redis connection factory configured for {}:{}", redisHost, redisPort);
        return factory;
    }

    /**
     * @Bean (Primary) Provides ObjectMapper with Spring Security modules
     *       for serializing security-related objects.
     */
    @Bean("securityObjectMapper")
    public ObjectMapper securityObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModules(SecurityJackson2Modules.getModules(getClass().getClassLoader()));
        return mapper;
    }

    /**
     * @Bean Provides ObjectMapper with JavaTime support for general usage.
     */
    @Bean("defaultObjectMapper")
    @Primary
    public ObjectMapper defaultObjectMapper() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        objectMapper.deactivateDefaultTyping();
        return objectMapper;
    }

    @Bean
    public RedisTemplate<String, OAuth2AuthorizationRequest> authorizationRequestRedisTemplate(
            LettuceConnectionFactory connectionFactory,
            @Qualifier("securityObjectMapper") ObjectMapper securityObjectMapper) {
        return buildRedisTemplate(connectionFactory, securityObjectMapper, OAuth2AuthorizationRequest.class);
    }

    @Bean
    public RedisTemplate<String, OAuth2AuthorizedClient> authorizedClientRedisTemplate(
            LettuceConnectionFactory connectionFactory,
            @Qualifier("securityObjectMapper") ObjectMapper securityObjectMapper) {
        return buildRedisTemplate(connectionFactory, securityObjectMapper, OAuth2AuthorizedClient.class);
    }

    @Bean
    @Primary
    public RedisTemplate<String, String> clientRegistrationRedisTemplate(LettuceConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(new StringRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(LettuceConnectionFactory connectionFactory,
            @Qualifier("defaultObjectMapper") ObjectMapper defaultObjectMapper) {
        return buildRedisTemplate(connectionFactory, defaultObjectMapper, Object.class);
    }

    private <T> RedisTemplate<String, T> buildRedisTemplate(
            LettuceConnectionFactory connectionFactory,
            @Qualifier("securityObjectMapper") ObjectMapper mapper,
            Class<T> targetType) {

        RedisTemplate<String, T> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        Jackson2JsonRedisSerializer<T> serializer = new Jackson2JsonRedisSerializer<>(mapper, targetType);

        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);

        template.afterPropertiesSet();
        return template;
    }
}
