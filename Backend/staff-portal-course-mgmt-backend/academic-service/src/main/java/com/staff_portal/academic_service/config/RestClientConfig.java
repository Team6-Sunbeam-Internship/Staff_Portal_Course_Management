package com.staff_portal.academic_service.config;

import com.staff_portal.academic_service.exception.UserServiceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.net.URI;
import java.nio.charset.StandardCharsets;

@Configuration
public class RestClientConfig {
    @Value("${user-service.url}")
    private String userServiceBaseUrl;

    @Bean
    public RestClient.Builder baseBuilder(){
        return RestClient.builder()
                .requestFactory(new HttpComponentsClientHttpRequestFactory())
                .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {
                    String responseBody = "";
                    try {
                        responseBody = new String(response.getBody().readAllBytes(), StandardCharsets.UTF_8);
                    } catch (IOException e) {
                        responseBody = "Unable to read response body";
                    }

                    // Create error message with status code and response body
                    String errorMessage = String.format("HTTP %d: %s - %s",
                            response.getStatusCode().value(),
                            response.getStatusText(),
                            responseBody);
                    // Throw a custom exception that can be handled by GlobalException
                    throw new UserServiceException(errorMessage, response.getStatusCode());
                })

                .messageConverters(converters -> converters.add(new MappingJackson2HttpMessageConverter()))
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);
    }

    @Bean
    public RestClient userServiceRestClient(){
        return baseBuilder().baseUrl(URI.create(userServiceBaseUrl)).build();
    }
}
