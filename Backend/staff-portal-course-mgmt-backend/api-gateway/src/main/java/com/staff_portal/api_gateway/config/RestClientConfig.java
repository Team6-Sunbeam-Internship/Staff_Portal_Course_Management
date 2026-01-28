package com.staff_portal.api_gateway.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.time.Duration;

@Configuration
public class RestClientConfig {
    @Autowired
    private ObjectMapper objectMapper;

    @Bean
    @Primary
    public RestClient restClient() {
        return RestClient.builder()
                .requestFactory(clientHttpRequestFactory())
                .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {
                    String errorMessage = String.format("HTTP %d: %s",
                            response.getStatusCode().value(), response.getStatusText());
                    throw new HttpClientErrorException(response.getStatusCode(), errorMessage);
                })
                .messageConverters(converters -> converters.add(new MappingJackson2HttpMessageConverter(objectMapper)))
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Bean
    public ClientHttpRequestFactory clientHttpRequestFactory() {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(Duration.ofSeconds(30));
        factory.setReadTimeout(Duration.ofSeconds(30));
        return factory;
    }
}